import type { BadgeCatalog, BadgeCatalogEntry } from "./types.js";

import { badgeCatalog as generatedCatalog } from "./generated/catalog.js";

/** The immutable catalog generated from the repository's canonical library. */
export const badgeCatalog: BadgeCatalog = { ...generatedCatalog };

/** Resolve a layout by exact ID, exact title, or an unambiguous partial match. */
export function findLayout(identifier: string): BadgeCatalogEntry | undefined {
    const normalized = identifier.trim().toLocaleLowerCase();
    if (normalized.length === 0) return undefined;

    const exact = badgeCatalog.entries.find(
        (entry) =>
            entry.id.toLocaleLowerCase() === normalized ||
            entry.title.toLocaleLowerCase() === normalized
    );
    if (exact !== undefined) return exact;

    const partial = badgeCatalog.entries.filter(
        (entry) =>
            entry.id.toLocaleLowerCase().includes(normalized) ||
            entry.title.toLocaleLowerCase().includes(normalized)
    );
    return partial.length === 1 ? partial[0] : undefined;
}

/**
 * Resolve a layout or throw a human-readable error with useful suggestions.
 *
 * @throws Error when the identifier is unknown or ambiguous.
 */
export function getLayoutOrThrow(identifier: string): BadgeCatalogEntry {
    const layout = findLayout(identifier);
    if (layout !== undefined) return layout;

    const suggestions = listLayouts({ query: identifier })
        .slice(0, 5)
        .map((entry) => entry.id);
    const suffix =
        suggestions.length > 0
            ? ` Did you mean: ${suggestions.join(", ")}?`
            : " Run `badge-layouts list` to see available layouts.";
    throw new Error(`Unknown or ambiguous layout: ${identifier}.${suffix}`);
}

/** Return all layouts, optionally filtered by facets and free-text query. */
export function listLayouts(
    options: {
        readonly category?: string;
        readonly language?: string;
        readonly query?: string;
        readonly service?: string;
    } = {}
): readonly BadgeCatalogEntry[] {
    const category = options.category?.trim().toLocaleLowerCase();
    const language = options.language?.trim().toLocaleLowerCase();
    const query = options.query?.trim().toLocaleLowerCase();
    const service = options.service?.trim().toLocaleLowerCase();
    const serviceId = badgeCatalog.providers.find(
        (provider) =>
            provider.id.toLocaleLowerCase() === service ||
            provider.name.toLocaleLowerCase() === service
    )?.id;

    return badgeCatalog.entries.filter((entry) => {
        if (
            category !== undefined &&
            category.length > 0 &&
            entry.category.toLocaleLowerCase() !== category
        ) {
            return false;
        }
        if (
            service !== undefined &&
            service.length > 0 &&
            (serviceId === undefined ||
                entry.providers.every((providerId) => providerId !== serviceId))
        ) {
            return false;
        }
        if (
            language !== undefined &&
            language.length > 0 &&
            entry.languages.every(
                (entryLanguage) =>
                    entryLanguage.toLocaleLowerCase() !== language
            )
        ) {
            return false;
        }
        if (query === undefined || query.length === 0) return true;

        return [
            entry.id,
            entry.title,
            entry.category,
            entry.description,
            entry.languages.join(" "),
            entry.placeholders.join(" "),
            entry.providers
                .map(
                    (providerId) =>
                        badgeCatalog.providers.find(
                            (provider) => provider.id === providerId
                        )?.name ?? providerId
                )
                .join(" "),
            entry.template,
        ]
            .join(" ")
            .toLocaleLowerCase()
            .includes(query);
    });
}
