import { describe, expect, it } from "vitest";

import {
    convertBadgeStyle,
    renderLayout as createLayoutMarkdown,
    findPlaceholders,
    getLayoutOrThrow,
    inspectBadgeMarkdown,
    parseBadgeStyle,
    upsertReadmeBadgeBlock,
} from "../src/index.js";

describe("badge style conversion", () => {
    const markdown =
        "[![Build.](https://flat.badgen.net/github/checks/OWNER/REPO/main)](https://github.com/OWNER/REPO/actions)";

    it("converts flat badges to classic and back without changing targets", () => {
        const classic = convertBadgeStyle(markdown, "classic");
        expect(classic).toContain("https://badgen.net/github/checks/");
        expect(classic).not.toContain("https://flat.badgen.net/");
        expect(convertBadgeStyle(classic, "flat")).toBe(markdown);
    });

    it("does not rewrite Badgen-like text outside a Markdown image URL", () => {
        const unrelated =
            "https://example.com/https://badgen.net/static/not-a-badge";
        expect(convertBadgeStyle(unrelated, "flat")).toBe(unrelated);
    });

    it("accepts user-friendly style aliases and rejects unknown styles", () => {
        expect(parseBadgeStyle("non-flat")).toBe("classic");
        expect(parseBadgeStyle("FLAT")).toBe("flat");
        expect(() => parseBadgeStyle("plastic")).toThrow(/Unsupported/v);
    });
});

describe("layout rendering", () => {
    const layout = getLayoutOrThrow("balanced-public-repository");

    it("renders repository coordinates and a selected style", () => {
        const markdownOutput = createLayoutMarkdown(layout, {
            branch: "develop",
            owner: "acme",
            repo: "toolkit",
            style: "classic",
        });
        expect(markdownOutput).toContain("https://github.com/acme/toolkit");
        expect(markdownOutput).toContain("/develop");
        expect(markdownOutput).toContain("https://badgen.net/");
        expect(findPlaceholders(markdownOutput)).toEqual([]);
    });

    it("requires layout-specific placeholders unless explicitly preserved", () => {
        const npmLayout = getLayoutOrThrow("general-npm-package");
        expect(() =>
            createLayoutMarkdown(npmLayout, {
                branch: "main",
                owner: "acme",
                repo: "toolkit",
            })
        ).toThrow(/PACKAGE/v);
        expect(
            createLayoutMarkdown(npmLayout, {
                allowUnresolved: true,
                branch: "main",
                owner: "acme",
                repo: "toolkit",
            })
        ).toContain("PACKAGE");
    });

    it("supports scoped package values and safely encodes spaces", () => {
        const npmLayout = getLayoutOrThrow("general-npm-package");
        const markdownOutput = createLayoutMarkdown(npmLayout, {
            branch: "main",
            owner: "acme",
            placeholders: { PACKAGE: "@acme/my package" },
            repo: "toolkit",
        });
        expect(markdownOutput).toContain("@acme/my%20package");
    });

    it("rejects control characters and Markdown delimiters", () => {
        expect(() =>
            createLayoutMarkdown(layout, {
                branch: "main",
                owner: "acme\nattacker",
                repo: "toolkit",
            })
        ).toThrow(/control character/v);
        expect(() =>
            createLayoutMarkdown(layout, {
                branch: "main",
                owner: "acme)",
                repo: "toolkit",
            })
        ).toThrow(/Markdown delimiter/v);
    });
});

describe("Markdown inspection", () => {
    it("counts mixed styles and unresolved placeholders", () => {
        const inspection = inspectBadgeMarkdown(
            "![A](https://flat.badgen.net/static/a/b) ![B](https://badgen.net/static/b/c) ![C](https://example.com/badge.svg) OWNER/REPO"
        );
        expect(inspection).toEqual({
            badgeCount: 3,
            classicBadgeCount: 1,
            flatBadgeCount: 1,
            placeholders: ["OWNER", "REPO"],
            unknownBadgeCount: 1,
        });
        expect(inspection.placeholders).not.toContain("UNRECOGNIZED_TOKEN");
    });
});

describe("README block management", () => {
    const start = "<!-- github-badge-layouts:start -->";
    const end = "<!-- github-badge-layouts:end -->";

    it("inserts a managed block after the first heading", () => {
        expect(upsertReadmeBadgeBlock("# Toolkit\n\nIntro.\n", "badges")).toBe(
            `# Toolkit\n\n${start}\nbadges\n${end}\n\nIntro.\n`
        );
    });

    it("replaces only the existing managed block", () => {
        const original = `# Toolkit\n\n${start}\nold\n${end}\n\nKeep me.\n`;
        expect(upsertReadmeBadgeBlock(original, "new")).toBe(
            `# Toolkit\n\n${start}\nnew\n${end}\n\nKeep me.\n`
        );
    });

    it("rejects malformed marker pairs", () => {
        expect(() =>
            upsertReadmeBadgeBlock(`# Toolkit\n${start}`, "new")
        ).toThrow(/incomplete or malformed/v);
    });
});
