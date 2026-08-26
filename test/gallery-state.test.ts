import { describe, expect, it } from "vitest";

import {
    decodeHashTarget,
    filterAndSortEntries,
    paginateEntries,
    parseGalleryView,
    parseSortMode,
} from "../docs/gallery-state";

const entries = [
    {
        badgeCount: 5,
        category: "Packages",
        description: "An npm layout.",
        languages: ["JavaScript", "TypeScript"],
        placeholders: ["PACKAGE"],
        providers: ["badgen"],
        template: "npm PACKAGE",
        title: "Zulu package",
    },
    {
        badgeCount: 2,
        category: "Projects",
        description: "A GitHub layout.",
        languages: ["Language agnostic"],
        placeholders: ["OWNER", "REPO"],
        providers: ["shields"],
        template: "github OWNER/REPO",
        title: "Alpha project",
    },
    {
        badgeCount: 5,
        category: "Packages",
        description: "A Rust layout.",
        languages: ["Rust"],
        placeholders: ["CRATE"],
        providers: ["badgen", "codecov"],
        template: "crates CRATE",
        title: "Alpha package",
    },
];

describe("gallery state", () => {
    it("filters across catalog metadata and category", () => {
        expect(
            filterAndSortEntries(entries, {
                category: "Packages",
                language: "Rust",
                query: "crate",
                service: "codecov",
                sort: "featured",
            })
        ).toEqual([entries[2]]);
        expect(
            filterAndSortEntries(entries, {
                category: "all",
                language: "all",
                query: "OWNER/REPO",
                service: "all",
                sort: "featured",
            })
        ).toEqual([entries[1]]);
    });

    it("preserves canonical order for featured results", () => {
        expect(
            filterAndSortEntries(entries, {
                category: "all",
                language: "all",
                query: "",
                service: "all",
                sort: "featured",
            })
        ).toEqual(entries);
    });

    it("sorts badge totals in either direction with stable title ties", () => {
        const descending = filterAndSortEntries(entries, {
            category: "all",
            language: "all",
            query: "",
            service: "all",
            sort: "badges-desc",
        });
        expect(descending.map(({ title }) => title)).toEqual([
            "Alpha package",
            "Zulu package",
            "Alpha project",
        ]);

        const ascending = filterAndSortEntries(entries, {
            category: "all",
            language: "all",
            query: "",
            service: "all",
            sort: "badges-asc",
        });
        expect(ascending.map(({ title }) => title)).toEqual([
            "Alpha project",
            "Alpha package",
            "Zulu package",
        ]);
    });

    it("sorts by title or category", () => {
        const titleDescending = filterAndSortEntries(entries, {
            category: "all",
            language: "all",
            query: "",
            service: "all",
            sort: "title-desc",
        });
        expect(titleDescending.map(({ title }) => title)).toEqual([
            "Zulu package",
            "Alpha project",
            "Alpha package",
        ]);

        const categoryAscending = filterAndSortEntries(entries, {
            category: "all",
            language: "all",
            query: "",
            service: "all",
            sort: "category-asc",
        });
        expect(categoryAscending.map(({ title }) => title)).toEqual([
            "Alpha package",
            "Zulu package",
            "Alpha project",
        ]);
    });

    it("defaults ascending title sort and ignores blank category mismatches", () => {
        const titleAscending = filterAndSortEntries(entries, {
            category: "all",
            language: "all",
            query: "npm",
            service: "badgen",
            sort: "title-asc",
        });
        expect(titleAscending).toEqual([entries[0]]);
        expect(
            filterAndSortEntries(entries, {
                category: "Missing",
                language: "all",
                query: "",
                service: "all",
                sort: "title-asc",
            })
        ).toEqual([]);
    });

    it("clamps pagination and reports visible bounds", () => {
        expect(paginateEntries(entries, 9, 2)).toEqual({
            first: 3,
            last: 3,
            page: 2,
            totalPages: 2,
            visibleEntries: [entries[2]],
        });
        expect(paginateEntries([], -1, 0)).toEqual({
            first: 0,
            last: 0,
            page: 1,
            totalPages: 1,
            visibleEntries: [],
        });
    });

    it("parses only supported view and sort preferences", () => {
        expect(parseGalleryView("list", "grid")).toBe("list");
        expect(parseGalleryView("cards", "grid")).toBe("grid");
        expect(parseGalleryView("cards", "grid")).not.toBe("cards");
        expect(parseGalleryView("cards", "list")).toBe("list");
        expect(
            parseGalleryView(
                "cards",
                "cards" as Parameters<typeof parseGalleryView>[1]
            )
        ).toBe("grid");
        expect(parseSortMode("badges-desc", "featured")).toBe("badges-desc");
        expect(parseSortMode("popular", "featured")).toBe("featured");
        expect(parseSortMode("popular", "title-desc")).toBe("title-desc");
        expect(
            parseSortMode(
                "popular",
                "popular" as Parameters<typeof parseSortMode>[1]
            )
        ).toBe("featured");
    });

    it("decodes safe hash targets without throwing on malformed input", () => {
        expect(decodeHashTarget("#layout%20name")).toBe("layout name");
        expect(decodeHashTarget("#%E0%A4%A")).toBe("");
        expect(decodeHashTarget("layout-name")).toBe("");
        expect(decodeHashTarget("#")).toBe("");
    });
});
