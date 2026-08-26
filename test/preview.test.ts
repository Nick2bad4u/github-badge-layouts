import { afterEach, describe, expect, it, vi } from "vitest";

import { loadLiveBadgeTitles, parseTerminalBadges } from "../src/preview.js";

const markdown =
    "[![Latest version.](https://flat.badgen.net/npm/v/example?color=0E7490)](https://www.npmjs.com/package/example)";

function badgeMarkdown(image: string): string {
    return `[![Badge.](${image})](https://example.com)`;
}

function stubFetchResponse(body: string, status = 200): void {
    vi.stubGlobal(
        "fetch",
        vi.fn(() =>
            Promise.resolve(
                new Response(body, {
                    headers: { "content-type": "image/svg+xml" },
                    status,
                })
            )
        )
    );
}

function svgResponse(body: string, status = 200): Response {
    return new Response(body, {
        headers: { "content-type": "image/svg+xml" },
        status,
    });
}

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("terminal badge preview", () => {
    it("parses badge links and their presentation metadata", () => {
        expect(parseTerminalBadges(markdown)).toEqual([
            {
                alt: "Latest version.",
                color: "0E7490",
                image: "https://flat.badgen.net/npm/v/example?color=0E7490",
                provider: "badgen",
                service: "Badgen",
                target: "https://www.npmjs.com/package/example",
            },
        ]);
    });

    it("derives colors and service names from safe URL components", () => {
        expect(
            parseTerminalBadges(
                badgeMarkdown(
                    "https://flat.badgen.net/static/build/passing/ABCDEF"
                )
            )[0]
        ).toMatchObject({
            color: "ABCDEF",
            provider: "badgen",
            service: "Badgen",
        });
        expect(
            parseTerminalBadges(
                badgeMarkdown(
                    "https://flat.badgen.net/static/build/passing/not-a-color"
                )
            )[0]
        ).toMatchObject({ color: "0E7490", service: "Badgen" });
        expect(
            parseTerminalBadges(badgeMarkdown("https://flat.badgen.net"))[0]
        ).toMatchObject({ color: "0E7490", service: "Badgen" });
        expect(
            parseTerminalBadges(
                badgeMarkdown("https://img.shields.io/npm/v/react")
            )[0]
        ).toMatchObject({ provider: "shields", service: "Shields.io" });
    });

    it("loads and decodes meaningful SVG titles", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(() =>
                Promise.resolve(
                    new Response(
                        '<svg xmlns="http://www.w3.org/2000/svg"><title>npm: 1.2.3 &amp; stable</title></svg>',
                        {
                            headers: { "content-type": "image/svg+xml" },
                            status: 200,
                        }
                    )
                )
            )
        );
        const badges = parseTerminalBadges(markdown);
        await expect(loadLiveBadgeTitles(badges)).resolves.toEqual([
            expect.objectContaining({ title: "npm: 1.2.3 & stable" }),
        ]);
    });

    it("uses accessible SVG label fallbacks before badge alt text", async () => {
        const badges = parseTerminalBadges(markdown);
        vi.stubGlobal(
            "fetch",
            vi.fn(() =>
                Promise.resolve(
                    svgResponse("<svg aria-label='npm package: 2.0.0'></svg>")
                )
            )
        );
        await expect(loadLiveBadgeTitles(badges)).resolves.toEqual([
            expect.objectContaining({ title: "npm package: 2.0.0" }),
        ]);

        vi.stubGlobal(
            "fetch",
            vi.fn(() =>
                Promise.resolve(
                    svgResponse(
                        "<svg><text>coverage</text><text><tspan>98%</tspan></text></svg>"
                    )
                )
            )
        );
        await expect(loadLiveBadgeTitles(badges)).resolves.toEqual([
            expect.objectContaining({ title: "coverage: 98%" }),
        ]);
    });

    it("decodes each XML entity exactly once", async () => {
        stubFetchResponse(
            "<svg><title>&amp;lt; &#38;lt; &#x1F680; &quot;x&quot; &apos;y&apos; &gt; &lt; &#9; &#55296; &#999999999;</title></svg>"
        );
        const badges = parseTerminalBadges(markdown);
        await expect(loadLiveBadgeTitles(badges)).resolves.toEqual([
            expect.objectContaining({
                title: `&lt; &lt; 🚀 "x" 'y' > < \t &#55296; &#999999999;`,
            }),
        ]);
    });

    it("rejects unsupported hosts and insecure badge URLs", async () => {
        const [externalBadge] = parseTerminalBadges(
            badgeMarkdown("https://example.com/badge.svg")
        );
        const insecureUrl = new URL("https://flat.badgen.net/npm/v/example");
        insecureUrl.protocol = "http:";
        const insecureBadge = {
            ...externalBadge!,
            image: insecureUrl.href,
        };
        await expect(
            loadLiveBadgeTitles([externalBadge!, insecureBadge])
        ).resolves.toEqual([
            expect.objectContaining({ error: "unsupported badge host" }),
            expect.objectContaining({ error: "unsupported badge host" }),
        ]);
    });

    it("reports HTTP and network failures and falls back to badge alt text", async () => {
        const badges = parseTerminalBadges(markdown);
        stubFetchResponse("unavailable", 503);
        await expect(loadLiveBadgeTitles(badges)).resolves.toEqual([
            expect.objectContaining({ error: "HTTP 503" }),
        ]);

        stubFetchResponse("<svg></svg>");
        await expect(loadLiveBadgeTitles(badges)).resolves.toEqual([
            expect.objectContaining({ title: "Latest version" }),
        ]);

        vi.stubGlobal(
            "fetch",
            vi.fn(() => Promise.reject(new Error("network offline")))
        );
        await expect(loadLiveBadgeTitles(badges)).resolves.toEqual([
            expect.objectContaining({ error: "Error: network offline" }),
        ]);
    });

    it("rejects non-SVG responses and redirects outside the registered service", async () => {
        const badges = parseTerminalBadges(markdown);
        vi.stubGlobal(
            "fetch",
            vi.fn(() =>
                Promise.resolve(
                    new Response("not an image", {
                        headers: { "content-type": "text/html" },
                        status: 200,
                    })
                )
            )
        );
        await expect(loadLiveBadgeTitles(badges)).resolves.toEqual([
            expect.objectContaining({ error: "response was not SVG" }),
        ]);

        vi.stubGlobal(
            "fetch",
            vi.fn(() =>
                Promise.resolve(
                    new Response(null, {
                        headers: { location: "https://example.com/badge.svg" },
                        status: 302,
                    })
                )
            )
        );
        await expect(loadLiveBadgeTitles(badges)).resolves.toEqual([
            expect.objectContaining({
                error: "Error: badge redirected to an unsupported host",
            }),
        ]);
    });

    it("follows registered redirects and rejects malformed redirect chains", async () => {
        const badges = parseTerminalBadges(markdown);
        const allowedRedirectFetch = vi
            .fn()
            .mockResolvedValueOnce(
                new Response(null, {
                    headers: {
                        location: "https://badgen.net/npm/v/example",
                    },
                    status: 302,
                })
            )
            .mockResolvedValueOnce(
                svgResponse("<svg><title>npm: 2.0.0</title></svg>")
            );
        vi.stubGlobal("fetch", allowedRedirectFetch);
        await expect(loadLiveBadgeTitles(badges)).resolves.toEqual([
            expect.objectContaining({ title: "npm: 2.0.0" }),
        ]);
        expect(allowedRedirectFetch).toHaveBeenCalledTimes(2);

        vi.stubGlobal(
            "fetch",
            vi.fn(() => Promise.resolve(new Response(null, { status: 302 })))
        );
        await expect(loadLiveBadgeTitles(badges)).resolves.toEqual([
            expect.objectContaining({
                error: "Error: badge redirect omitted its destination",
            }),
        ]);

        vi.stubGlobal(
            "fetch",
            vi.fn(() =>
                Promise.resolve(
                    new Response(null, {
                        headers: {
                            location: "https://badgen.net/npm/v/example",
                        },
                        status: 302,
                    })
                )
            )
        );
        await expect(loadLiveBadgeTitles(badges)).resolves.toEqual([
            expect.objectContaining({
                error: "Error: badge redirected too many times",
            }),
        ]);
    });

    it("bounds SVG bodies and reports an unavailable accessible label", async () => {
        const badges = parseTerminalBadges(markdown);
        stubFetchResponse(`<svg>${"x".repeat(256_001)}</svg>`);
        await expect(loadLiveBadgeTitles(badges)).resolves.toEqual([
            expect.objectContaining({
                error: "SVG exceeded preview size limit",
            }),
        ]);

        stubFetchResponse("<svg></svg>");
        await expect(
            loadLiveBadgeTitles(
                parseTerminalBadges(
                    "[![](https://flat.badgen.net/static/a/b)](https://example.com)"
                )
            )
        ).resolves.toEqual([
            expect.objectContaining({ error: "SVG label unavailable" }),
        ]);
    });

    it("flags error text hidden inside successful SVG responses", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(() =>
                Promise.resolve(
                    new Response("<svg><title>package: unknown</title></svg>", {
                        headers: { "content-type": "image/svg+xml" },
                        status: 200,
                    })
                )
            )
        );
        const [badge] = await loadLiveBadgeTitles(
            parseTerminalBadges(markdown)
        );
        expect(badge).toMatchObject({
            error: "badge rendered package: unknown",
            title: "package: unknown",
        });
    });
});
