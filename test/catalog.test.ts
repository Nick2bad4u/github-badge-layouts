import { describe, expect, it } from "vitest";

import {
    badgeCatalog,
    findLayout,
    getLayoutOrThrow,
    listLayouts,
} from "../src/index.js";

describe("catalog", () => {
    it("exposes internally consistent totals", () => {
        expect(badgeCatalog.layoutCount).toBe(badgeCatalog.entries.length);
        expect(badgeCatalog.categoryCount).toBe(badgeCatalog.categories.length);
        expect(badgeCatalog.badgeCount).toBe(
            badgeCatalog.entries.reduce(
                (total, entry) => total + entry.badgeCount,
                0
            )
        );
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
        ).toHaveLength(5);
    });

    it("finds exact and unambiguous partial layout identifiers", () => {
        const layout = getLayoutOrThrow("balanced-public-repository");
        expect(findLayout(layout.title)).toBe(layout);
        expect(findLayout("balanced-public")).toBe(layout);
    });

    it("rejects unknown or ambiguous identifiers with guidance", () => {
        expect(() => getLayoutOrThrow("definitely-not-a-layout")).toThrow(
            /Run `badge-layouts list`/v
        );
        expect(() => getLayoutOrThrow("package")).toThrow(/ambiguous layout/v);
    });
});
