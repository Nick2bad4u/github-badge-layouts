import { describe, expect, it } from "vitest";

import {
    createTerminalTheme,
    formatTable,
    stripAnsi,
} from "../src/terminal.js";

describe("terminal formatting", () => {
    it("supports forced ANSI and deterministic plain output", () => {
        const colored = createTerminalTheme("always", false);
        const plain = createTerminalTheme("never", true);
        expect(colored.heading("Layouts")).toContain("\u{1B}[");
        expect(stripAnsi(colored.heading("Layouts"))).toBe("Layouts");
        expect(plain.heading("Layouts")).toBe("Layouts");
        expect(plain.badge("passing")).toBe("[ passing ]");
    });

    it("contracts wide tables without losing headers", () => {
        const table = formatTable(
            [
                "IDENTIFIER",
                "CATEGORY",
                "COUNT",
            ],
            [
                [
                    "an-extremely-long-layout-identifier",
                    "A very long category name",
                    "12",
                ],
            ],
            { maxWidth: 40, rightAligned: new Set([2]) }
        );
        expect(table).toContain("IDENTIFIER");
        expect(table).toContain("COUNT");
        expect(table).toContain("…");
        expect(table.split("\n").every((line) => line.length <= 40)).toBe(true);
    });
});
