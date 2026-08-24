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
        placeholders: ["PACKAGE"],
        template: "npm PACKAGE",
        title: "Zulu package",
    },
    {
        badgeCount: 2,
        category: "Projects",
        description: "A GitHub layout.",
        placeholders: ["OWNER", "REPO"],
        template: "github OWNER/REPO",
        title: "Alpha project",
    },
    {
        badgeCount: 5,
        category: "Packages",
        description: "A Rust layout.",
        placeholders: ["CRATE"],
        template: "crates CRATE",
        title: "Alpha package",
    },
];

describe("gallery state", () => {
    it("filters across catalog metadata and category", () => {
        expect(
            filterAndSortEntries(entries, {
                category: "Packages",
                query: "crate",
                sort: "featured",
            })
        ).toEqual([entries[2]]);
        expect(
            filterAndSortEntries(entries, {
                category: "all",
                query: "OWNER/REPO",
                sort: "featured",
            })
        ).toEqual([entries[1]]);
    });

    it("preserves canonical order for featured results", () => {
        expect(
            filterAndSortEntries(entries, {
                category: "all",
                query: "",
                sort: "featured",
            })
        ).toEqual(entries);
    });

    it("sorts badge totals in either direction with stable title ties", () => {
        const descending = filterAndSortEntries(entries, {
            category: "all",
            query: "",
            sort: "badges-desc",
        });
        expect(descending.map(({ title }) => title)).toEqual([
            "Alpha package",
            "Zulu package",
            "Alpha project",
        ]);

        const ascending = filterAndSortEntries(entries, {
            category: "all",
            query: "",
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
            query: "",
            sort: "title-desc",
        });
        expect(titleDescending.map(({ title }) => title)).toEqual([
            "Zulu package",
            "Alpha project",
            "Alpha package",
        ]);

        const categoryAscending = filterAndSortEntries(entries, {
            category: "all",
            query: "",
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
            query: "npm",
            sort: "title-asc",
        });
        expect(titleAscending).toEqual([entries[0]]);
        expect(
            filterAndSortEntries(entries, {
                category: "Missing",
                query: "",
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
        expect(parseSortMode("badges-desc", "featured")).toBe("badges-desc");
        expect(parseSortMode("popular", "featured")).toBe("featured");
    });

    it("decodes safe hash targets without throwing on malformed input", () => {
        expect(decodeHashTarget("#layout%20name")).toBe("layout name");
        expect(decodeHashTarget("#%E0%A4%A")).toBe("");
        expect(decodeHashTarget("layout-name")).toBe("");
        expect(decodeHashTarget("#")).toBe("");
    });
});
