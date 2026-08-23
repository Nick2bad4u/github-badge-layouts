import type {
    BadgeCatalogEntry,
    BadgeMarkdownInspection,
    PlaceholderValues,
    RenderOptions,
} from "./types.js";

import { badgeCatalog } from "./catalog.js";
import { convertBadgeStyle } from "./style.js";

const flatBadgePattern = /https:\/\/flat\.badgen\.net\//gv;
const classicBadgePattern = /https:\/\/badgen\.net\//gv;
const badgeImagePattern = /!\[/gv;
const knownPlaceholderNames = [
    ...new Set(badgeCatalog.entries.flatMap((entry) => entry.placeholders)),
];

/** Return the unresolved uppercase placeholders present in Markdown. */
export function findPlaceholders(markdown: string): readonly string[] {
    return knownPlaceholderNames
        .filter((name) => markdown.includes(name))
        .toSorted((left, right) => left.localeCompare(right));
}

/** Inspect badge counts, renderer styles, and unresolved placeholders. */
export function inspectBadgeMarkdown(
    markdown: string
): BadgeMarkdownInspection {
    const badgeCount = markdown.match(badgeImagePattern)?.length ?? 0;
    const flatBadgeCount = markdown.match(flatBadgePattern)?.length ?? 0;
    const classicBadgeCount = markdown.match(classicBadgePattern)?.length ?? 0;
    return {
        badgeCount,
        classicBadgeCount,
        flatBadgeCount,
        placeholders: findPlaceholders(markdown),
        unknownBadgeCount: Math.max(
            0,
            badgeCount - flatBadgeCount - classicBadgeCount
        ),
    };
}

/**
 * Render a catalog entry with repository coordinates and custom placeholders.
 *
 * @throws Error when a placeholder is missing or contains unsafe Markdown.
 */
export function renderLayout(
    entry: BadgeCatalogEntry,
    options: RenderOptions = {}
): string {
    const values: PlaceholderValues = {
        ...(options.owner !== undefined &&
            options.owner.length > 0 && { OWNER: options.owner }),
        ...(options.repo !== undefined &&
            options.repo.length > 0 && { REPO: options.repo }),
        ...(options.branch !== undefined &&
            options.branch.length > 0 && { BRANCH: options.branch }),
        ...options.placeholders,
    };

    let markdown = entry.template;
    const names = [...entry.placeholders].toSorted(
        (left, right) => right.length - left.length
    );
    for (const name of names) {
        const value = values[name];
        if (value === undefined) continue;
        const replacement = normalizePlaceholderValue(name, value);
        markdown = markdown.replaceAll(name, () => replacement);
    }

    markdown = convertBadgeStyle(markdown, options.style ?? "flat");
    const unresolved = entry.placeholders.filter((name) =>
        markdown.includes(name)
    );
    if (options.allowUnresolved !== true && unresolved.length > 0) {
        throw new Error(
            `Missing values for: ${unresolved.join(", ")}. Use --set NAME=VALUE or --allow-unresolved.`
        );
    }
    return markdown;
}

/**
 * Build or replace the managed badge block in a README without touching other
 * content.
 *
 * @throws Error when only one marker is present or the markers are reversed.
 */
export function upsertReadmeBadgeBlock(
    readme: string,
    badgeMarkdown: string
): string {
    const startMarker = "<!-- github-badge-layouts:start -->";
    const endMarker = "<!-- github-badge-layouts:end -->";
    const start = readme.indexOf(startMarker);
    const end = readme.indexOf(endMarker);

    const hasStartMarker = start !== -1;
    const hasEndMarker = end !== -1;
    if (hasStartMarker !== hasEndMarker || (hasStartMarker && end < start)) {
        throw new Error(
            "README has an incomplete or malformed github-badge-layouts marker block."
        );
    }

    const block = `${startMarker}\n${badgeMarkdown.trim()}\n${endMarker}`;
    if (hasStartMarker) {
        return `${readme.slice(0, start)}${block}${readme.slice(end + endMarker.length)}`;
    }

    const heading = /^# .+$/mv.exec(readme);
    if (heading?.index === undefined) {
        return `${block}\n\n${readme}`;
    }
    const insertionPoint = heading.index + heading[0].length;
    return `${readme.slice(0, insertionPoint)}\n\n${block}${readme.slice(insertionPoint)}`;
}

function normalizePlaceholderValue(name: string, value: string): string {
    const normalized = value.trim();
    if (normalized.length === 0) {
        throw new Error(`Placeholder ${name} cannot be empty.`);
    }
    if (
        /\p{C}/v.test(normalized) ||
        normalized.includes(")") ||
        normalized.includes("]")
    ) {
        throw new Error(
            `Placeholder ${name} contains a control character or Markdown delimiter.`
        );
    }
    return normalized.replaceAll(" ", "%20");
}
