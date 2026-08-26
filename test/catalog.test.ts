import { describe, expect, it } from "vitest";

import {
    badgeCatalog,
    findLayout,
    getLayoutOrThrow,
    identifyBadgeProvider,
    isBadgeProviderUrl,
    listLayouts,
} from "../src/index.js";

describe("catalog", () => {
    it("exposes internally consistent totals", () => {
        expect(badgeCatalog.layoutCount).toBe(badgeCatalog.entries.length);
        expect(badgeCatalog.categoryCount).toBe(badgeCatalog.categories.length);
        expect(badgeCatalog.languageCount).toBe(badgeCatalog.languages.length);
        expect(badgeCatalog.providerCount).toBe(badgeCatalog.providers.length);
        expect(badgeCatalog.badgeCount).toBe(
            badgeCatalog.entries.reduce(
                (total, entry) => total + entry.badgeCount,
                0
            )
        );
        expect(badgeCatalog).toMatchObject({
            badgeCount: 500,
            categoryCount: 11,
            languageCount: 45,
            layoutCount: 81,
            providerCount: 10,
        });
        let providerBadgeTotal = 0;
        for (const entry of badgeCatalog.entries) {
            for (const providerId of entry.providers) {
                providerBadgeTotal +=
                    entry.providerBadgeCounts[providerId] ?? 0;
            }
        }
        expect(providerBadgeTotal).toBe(badgeCatalog.badgeCount);
    });

    it("filters and identifies registered badge services", () => {
        const shieldsLayouts = listLayouts({ service: "Shields.io" });
        expect(shieldsLayouts.length).toBeGreaterThan(0);
        expect(
            shieldsLayouts.every((entry) => entry.providers.includes("shields"))
        ).toBe(true);
        expect(listLayouts({ service: "SHIELDS" })).toEqual(shieldsLayouts);
        expect(listLayouts({ service: "missing-service" })).toEqual([]);
        expect(
            identifyBadgeProvider("https://img.shields.io/npm/v/react")
        ).toMatchObject({ id: "shields", name: "Shields.io" });
        expect(
            identifyBadgeProvider("https://example.com/badge.svg")
        ).toBeUndefined();
        expect(identifyBadgeProvider("not a URL")).toBeUndefined();
        expect(
            identifyBadgeProvider("https://user@img.shields.io/npm/v/react")
        ).toBeUndefined();
        expect(
            isBadgeProviderUrl(
                new URL("https://d25lcipzij17d.cloudfront.net/badge.svg"),
                "badge-fury"
            )
        ).toBe(true);
        const insecureDeliveryUrl = new URL(
            "https://d25lcipzij17d.cloudfront.net/badge.svg"
        );
        insecureDeliveryUrl.protocol = "http:";
        expect(isBadgeProviderUrl(insecureDeliveryUrl, "badge-fury")).toBe(
            false
        );
    });

    it("removes the two superseded personal upgrade layouts", () => {
        expect(
            badgeCatalog.entries.some((entry) =>
                entry.title.includes("gh-runs-cleanup")
            )
        ).toBe(false);
        expect(
            badgeCatalog.entries.some((entry) =>
                entry.title.includes("eslint-plugin-typefest")
            )
        ).toBe(false);
    });

    it("searches titles, categories, and placeholders", () => {
        expect(listLayouts({ query: "PowerShell" })).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ title: "PowerShell module" }),
            ])
        );
        expect(
            listLayouts({ query: "PUBLISHER.EXTENSION" }).length
        ).toBeGreaterThan(0);
        expect(
            listLayouts({ category: "JavaScript and TypeScript" })
        ).toHaveLength(6);
        expect(
            listLayouts({ category: "External CI and code quality" })
        ).toHaveLength(5);
        expect(listLayouts({ language: "Rust" })).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ title: "Rust crate" }),
                expect.objectContaining({
                    title: "Rust application or command-line tool",
                }),
            ])
        );
        expect(listLayouts({ language: "TypeScript" }).length).toBeGreaterThan(
            listLayouts({ category: "JavaScript and TypeScript" }).length
        );
        expect(listLayouts({ query: "MATRIX_SERVER" })).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: "Project with a Matrix community",
                }),
            ])
        );
        expect(listLayouts({ query: "MELPA" })).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ title: "Emacs package on MELPA" }),
            ])
        );
    });

    it("finds exact and unambiguous partial layout identifiers", () => {
        const layout = getLayoutOrThrow("balanced-public-repository");
        expect(findLayout(layout.title)).toBe(layout);
        expect(findLayout("balanced-public")).toBe(layout);
    });

    it("distinguishes composite placeholders from nested names", () => {
        expect(
            getLayoutOrThrow("visual-studio-marketplace-extension").placeholders
        ).not.toContain("EXTENSION");
        expect(getLayoutOrThrow("dual-published-vs-code").placeholders).toEqual(
            expect.arrayContaining(["PUBLISHER.EXTENSION", "EXTENSION"])
        );
        expect(
            getLayoutOrThrow("azure-pipelines-project").placeholders
        ).toEqual(
            expect.arrayContaining([
                "AZURE_ORG",
                "AZURE_PIPELINE",
                "AZURE_PROJECT",
            ])
        );
    });

    it("rejects unknown or ambiguous identifiers with guidance", () => {
        expect(() => getLayoutOrThrow("definitely-not-a-layout")).toThrow(
            /Run `badge-layouts list`/v
        );
        expect(() => getLayoutOrThrow("package")).toThrow(/ambiguous layout/v);
    });
});
