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
        vi.fn(() => Promise.resolve(new Response(body, { status })))
    );
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
                service: "npm",
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
        ).toMatchObject({ color: "ABCDEF", service: "static" });
        expect(
            parseTerminalBadges(
                badgeMarkdown(
                    "https://flat.badgen.net/static/build/passing/not-a-color"
                )
            )[0]
        ).toMatchObject({ color: "0E7490", service: "static" });
        expect(
            parseTerminalBadges(badgeMarkdown("https://flat.badgen.net"))[0]
        ).toMatchObject({ color: "0E7490", service: "badge" });
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

    it("reports HTTP, missing-title, and network failures", async () => {
        const badges = parseTerminalBadges(markdown);
        stubFetchResponse("unavailable", 503);
        await expect(loadLiveBadgeTitles(badges)).resolves.toEqual([
            expect.objectContaining({ error: "HTTP 503" }),
        ]);

        stubFetchResponse("<svg></svg>");
        await expect(loadLiveBadgeTitles(badges)).resolves.toEqual([
            expect.objectContaining({ error: "SVG title unavailable" }),
        ]);

        vi.stubGlobal(
            "fetch",
            vi.fn(() => Promise.reject(new Error("network offline")))
        );
        await expect(loadLiveBadgeTitles(badges)).resolves.toEqual([
            expect.objectContaining({ error: "Error: network offline" }),
        ]);
    });

    it("flags error text hidden inside successful SVG responses", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(() =>
                Promise.resolve(
                    new Response("<svg><title>package: unknown</title></svg>", {
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
