import type { BadgeStyle } from "./types.js";

const badgenUrlPattern = /https:\/\/(?:flat\.)?badgen\.net\//gv;

/** Convert every Badgen image URL in Markdown to the selected renderer. */
export function convertBadgeStyle(markdown: string, style: BadgeStyle): string {
    const host =
        style === "flat" ? "https://flat.badgen.net/" : "https://badgen.net/";
    return markdown.replaceAll(badgenUrlPattern, () => host);
}

/**
 * Validate and normalize a user-supplied style name.
 *
 * @throws Error when the style name is unsupported.
 */
export function parseBadgeStyle(value: string): BadgeStyle {
    const normalized = value.trim().toLocaleLowerCase();
    if (normalized === "flat" || normalized === "classic") {
        return normalized;
    }
    if (normalized === "non-flat" || normalized === "nonflat") {
        return "classic";
    }
    throw new Error(
        `Unsupported badge style: ${value}. Expected "flat" or "classic".`
    );
}
