import { stripVTControlCharacters } from "node:util";

/** ANSI color policy accepted by the CLI. */
export type ColorMode =
    | "always"
    | "auto"
    | "never";

/** Small dependency-free terminal styling surface. */
export interface TerminalTheme {
    readonly accent: (value: string) => string;
    readonly badge: (value: string, hexadecimalColor?: string) => string;
    readonly bold: (value: string) => string;
    readonly danger: (value: string) => string;
    readonly dim: (value: string) => string;
    readonly enabled: boolean;
    readonly heading: (value: string) => string;
    readonly muted: (value: string) => string;
    readonly success: (value: string) => string;
    readonly underline: (value: string) => string;
    readonly warning: (value: string) => string;
}

interface TableOptions {
    readonly maxWidth?: number;
    readonly rightAligned?: ReadonlySet<number>;
    readonly theme?: TerminalTheme;
}

const graphemeSegmenter = new Intl.Segmenter("en", {
    granularity: "grapheme",
});
const reset = "\u{1B}[0m";

/** Create a terminal theme that follows `NO_COLOR`, TTY state, and overrides. */
export function createTerminalTheme(
    mode: ColorMode,
    isTty: boolean
): TerminalTheme {
    // eslint-disable-next-line n/no-process-env -- NO_COLOR and TERM are standard terminal capability inputs.
    const environment = process.env;
    const isEnabled =
        mode === "always" ||
        (mode === "auto" &&
            isTty &&
            environment["NO_COLOR"] === undefined &&
            environment["TERM"] !== "dumb");
    const style = (opening: string, value: string): string =>
        isEnabled ? `${opening}${value}${reset}` : value;

    return {
        accent: (value) => style("\u{1B}[38;2;51;214;255m", value),
        badge: (value, hexadecimalColor) =>
            isEnabled
                ? colorBadge(value, hexadecimalColor ?? "0E7490")
                : `[ ${value} ]`,
        bold: (value) => style("\u{1B}[1m", value),
        danger: (value) => style("\u{1B}[38;2;248;113;113m", value),
        dim: (value) => style("\u{1B}[2m", value),
        enabled: isEnabled,
        heading: (value) => style("\u{1B}[1;38;2;167;139;250m", value),
        muted: (value) => style("\u{1B}[38;2;148;163;184m", value),
        success: (value) => style("\u{1B}[38;2;52;211;153m", value),
        underline: (value) => style("\u{1B}[4m", value),
        warning: (value) => style("\u{1B}[38;2;251;191;36m", value),
    };
}

/**
 * Format a compact table that contracts to the current terminal width.
 *
 * @throws Error when a row has a different number of cells than the header.
 */
export function formatTable(
    headers: readonly string[],
    rows: readonly (readonly string[])[],
    options: TableOptions = {}
): string {
    if (headers[0] === undefined) return "";
    for (const row of rows) {
        if (row.length !== headers.length) {
            throw new Error(
                "Every table row must have the same width as its header."
            );
        }
    }

    const gap = 2;
    const maximumWidth = Math.max(
        headers.length * 8,
        options.maxWidth ??
            (process.stdout.columns > 0 ? process.stdout.columns : 100)
    );
    const widths = headers.map((header, index) =>
        Math.max(
            visibleLength(header),
            ...rows.map((row) => visibleLength(row[index] ?? ""))
        )
    );
    const minimumWidths = headers.map((header) =>
        Math.min(Math.max(visibleLength(header), 7), 16)
    );
    while (tableWidth(widths, gap) > maximumWidth) {
        const candidates = widths
            .map((width, index) => ({
                index,
                room: width - (minimumWidths[index] ?? 1),
            }))
            .filter(({ room }) => room > 0)
            .toSorted((left, right) => right.room - left.room);
        const candidate = candidates[0];
        if (candidate === undefined) break;
        widths[candidate.index] = (widths[candidate.index] ?? 1) - 1;
    }

    const theme = options.theme;
    const rightAligned = options.rightAligned ?? new Set<number>();
    const formatRow = (row: readonly string[]): string =>
        row
            .map((value, index) => {
                const width = widths[index] ?? visibleLength(value);
                const contracted = truncateVisible(value, width);
                return rightAligned.has(index)
                    ? padStartVisible(contracted, width)
                    : padEndVisible(contracted, width);
            })
            .join(" ".repeat(gap))
            .trimEnd();
    const header = formatRow(headers);
    const divider = widths
        .map((width) => "─".repeat(width))
        .join(" ".repeat(gap));
    return [
        theme?.bold(header) ?? header,
        theme?.dim(divider) ?? divider,
        ...rows.map((row) => formatRow(row)),
    ].join("\n");
}

/** Strip ANSI terminal control sequences for assertions and width calculations. */
export function stripAnsi(value: string): string {
    return stripVTControlCharacters(value);
}

function colorBadge(value: string, hexadecimalColor: string): string {
    const rgb = parseHexadecimalColor(hexadecimalColor) ?? [
        14,
        116,
        144,
    ];
    const [
        red,
        green,
        blue,
    ] = rgb;
    const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
    const foreground = luminance > 0.58 ? "30" : "97";
    return `\u{1B}[${foreground};48;2;${red};${green};${blue}m ${value} ${reset}`;
}

function graphemes(value: string): readonly string[] {
    return Array.from(
        graphemeSegmenter.segment(stripAnsi(value)),
        ({ segment }) => segment
    );
}

function padEndVisible(value: string, width: number): string {
    return value + " ".repeat(Math.max(0, width - visibleLength(value)));
}

function padStartVisible(value: string, width: number): string {
    return " ".repeat(Math.max(0, width - visibleLength(value))) + value;
}

function parseHexadecimalColor(value: string):
    | readonly [
          number,
          number,
          number,
      ]
    | undefined {
    const normalized = value.replace(/^#/v, "");
    if (!/^[\da-f]{6}$/iv.test(normalized)) return undefined;
    return [
        Number.parseInt(normalized.slice(0, 2), 16),
        Number.parseInt(normalized.slice(2, 4), 16),
        Number.parseInt(normalized.slice(4, 6), 16),
    ];
}

function tableWidth(widths: readonly number[], gap: number): number {
    let width = Math.max(0, widths.length - 1) * gap;
    for (const columnWidth of widths) width += columnWidth;
    return width;
}

function truncateVisible(value: string, width: number): string {
    if (visibleLength(value) <= width) return value;
    if (width <= 1) return "…";
    return `${graphemes(value)
        .slice(0, width - 1)
        .join("")}…`;
}

function visibleLength(value: string): number {
    return graphemes(value).length;
}
