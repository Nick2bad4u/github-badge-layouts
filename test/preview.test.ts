import { afterEach, describe, expect, it, vi } from "vitest";

import { loadLiveBadgeTitles, parseTerminalBadges } from "../src/preview.js";

const markdown =
    "[![Latest version.](https://flat.badgen.net/npm/v/example?color=0E7490)](https://www.npmjs.com/package/example)";

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
        vi.stubGlobal(
            "fetch",
            vi.fn(() =>
                Promise.resolve(
                    new Response(
                        "<svg><title>&amp;lt; &#38;lt; &#x1F680; &quot;x&quot; &#999999999;</title></svg>",
                        { status: 200 }
                    )
                )
            )
        );
        const badges = parseTerminalBadges(markdown);
        await expect(loadLiveBadgeTitles(badges)).resolves.toEqual([
            expect.objectContaining({
                title: `&lt; &lt; 🚀 "x" &#999999999;`,
            }),
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
