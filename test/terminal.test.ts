import { afterEach, describe, expect, it, vi } from "vitest";

import {
    createTerminalTheme,
    formatTable,
    stripAnsi,
} from "../src/terminal.js";

afterEach(() => {
    vi.unstubAllEnvs();
});

describe("terminal formatting", () => {
    it("supports forced ANSI and deterministic plain output", () => {
        const colored = createTerminalTheme("always", false);
        const plain = createTerminalTheme("never", true);
        expect(colored.heading("Layouts")).toContain("\u{1B}[");
        expect(stripAnsi(colored.heading("Layouts"))).toBe("Layouts");
        expect(plain.heading("Layouts")).toBe("Layouts");
        expect(plain.badge("passing")).toBe("[ passing ]");
    });

    it("styles every semantic role and chooses readable badge contrast", () => {
        const theme = createTerminalTheme("always", false);
        const styledValues = [
            theme.accent("accent"),
            theme.bold("bold"),
            theme.danger("danger"),
            theme.dim("dim"),
            theme.muted("muted"),
            theme.success("success"),
            theme.underline("underline"),
            theme.warning("warning"),
        ];
        expect(styledValues.every((value) => value.includes("\u{1B}["))).toBe(
            true
        );
        expect(styledValues.map((value) => stripAnsi(value))).toEqual([
            "accent",
            "bold",
            "danger",
            "dim",
            "muted",
            "success",
            "underline",
            "warning",
        ]);
        expect(theme.badge("dark", "0E7490")).toContain("[97;48;2;14;116;144m");
        expect(theme.badge("light", "#FFFFFF")).toContain(
            "[30;48;2;255;255;255m"
        );
        expect(theme.badge("fallback", "invalid")).toContain(
            "[97;48;2;14;116;144m"
        );
    });

    it("honors automatic TTY, NO_COLOR, and dumb-terminal detection", () => {
        vi.stubEnv("NO_COLOR", undefined);
        vi.stubEnv("TERM", "xterm-256color");
        const isCapableTtyEnabled = createTerminalTheme("auto", true).enabled;
        const isNonTtyEnabled = createTerminalTheme("auto", false).enabled;

        vi.stubEnv("NO_COLOR", "1");
        const isNoColorThemeEnabled = createTerminalTheme("auto", true).enabled;
        vi.stubEnv("NO_COLOR", undefined);
        vi.stubEnv("TERM", "dumb");
        const isDumbTerminalEnabled = createTerminalTheme("auto", true).enabled;
        expect({
            isCapableTtyEnabled,
            isDumbTerminalEnabled,
            isNoColorThemeEnabled,
            isNonTtyEnabled,
        }).toEqual({
            isCapableTtyEnabled: true,
            isDumbTerminalEnabled: false,
            isNoColorThemeEnabled: false,
            isNonTtyEnabled: false,
        });
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

    it("handles empty, invalid, themed, and impossibly narrow tables", () => {
        expect(formatTable([], [])).toBe("");
        expect(() => formatTable(["A"], [["A", "B"]])).toThrow(/same width/v);

        const theme = createTerminalTheme("always", false);
        const themed = formatTable(["NAME", "COUNT"], [["alpha", "7"]], {
            rightAligned: new Set([1]),
            theme,
        });
        expect(themed).toContain("\u{1B}[");
        expect(stripAnsi(themed)).toContain("alpha");
        expect(stripAnsi(themed)).toContain("    7");

        const narrow = formatTable(
            ["EXTREMELY-LONG-HEADER", "ANOTHER-LONG-HEADER"],
            [["value", "other"]],
            { maxWidth: 1 }
        );
        expect(narrow).toContain("…");
    });
});
