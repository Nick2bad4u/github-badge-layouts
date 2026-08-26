import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

interface ProviderRegistry {
    readonly providers: readonly {
        readonly deliveryHosts: readonly string[];
        readonly imageHosts: readonly string[];
    }[];
}

const indexHtml = readFileSync(
    new URL("../docs/index.html", import.meta.url),
    "utf8"
);
const providerRegistry = JSON.parse(
    readFileSync(new URL("../data/providers.json", import.meta.url), "utf8")
) as ProviderRegistry;

describe("site badge-image security", () => {
    it("keeps the CSP image hosts synchronized with the provider registry", () => {
        const contentStart = indexHtml.indexOf('content="default-src');
        expect(contentStart).toBeGreaterThan(-1);
        const cspStart = contentStart + 'content="'.length;
        const cspEnd = indexHtml.indexOf('"', cspStart);
        const csp = indexHtml.slice(cspStart, cspEnd);
        const imageDirectiveStart = csp.indexOf("img-src ");
        const imageDirectiveEnd = csp.indexOf(";", imageDirectiveStart);
        const imageDirective = csp.slice(
            imageDirectiveStart,
            imageDirectiveEnd
        );
        const cspHosts = new Set(
            imageDirective
                .split(" ")
                .filter((value) => value.startsWith("https://"))
                .map((value) => {
                    const url = new URL(value);
                    return url.hostname;
                })
        );
        const registeredHosts = new Set(
            providerRegistry.providers.flatMap((provider) => [
                ...provider.imageHosts,
                ...provider.deliveryHosts,
            ])
        );

        expect(cspHosts).toEqual(registeredHosts);
        expect(cspHosts).not.toContain("example.com");
    });
});
