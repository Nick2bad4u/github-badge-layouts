/**
 * @typedef {object} GalleryEntry
 *
 * @property {number} badgeCount
 * @property {string} category
 * @property {string} description
 * @property {ReadonlyArray<string>} placeholders
 * @property {string} template
 * @property {string} title
 */

/** @typedef {"grid" | "list"} GalleryView */
/**
 * @typedef {"badges-asc"
 *     | "badges-desc"
 *     | "category-asc"
 *     | "featured"
 *     | "title-asc"
 *     | "title-desc"} SortMode
 */

const titleCollator = new Intl.Collator("en", {
    numeric: true,
    sensitivity: "base",
});
const sortModes = new Set([
    "badges-asc",
    "badges-desc",
    "category-asc",
    "featured",
    "title-asc",
    "title-desc",
]);

/** @param {string} hash */
export function decodeHashTarget(hash) {
    if (!hash.startsWith("#") || hash.length === 1) return "";
    try {
        return decodeURIComponent(hash.slice(1));
    } catch {
        return "";
    }
}

/**
 * @template {GalleryEntry} T
 *
 * @param {ReadonlyArray<T>} entries
 * @param {{ category: string; query: string; sort: SortMode }} options
 *
 * @returns {T[]}
 */
export function filterAndSortEntries(entries, options) {
    const query = options.query.trim().toLocaleLowerCase();
    const filteredEntries = entries.filter((entry) => {
        const isInCategory =
            options.category === "all" || entry.category === options.category;
        if (!isInCategory) return false;
        if (!query) return true;
        return `${entry.title} ${entry.category} ${entry.description} ${entry.placeholders.join(" ")} ${entry.template}`
            .toLocaleLowerCase()
            .includes(query);
    });

    if (options.sort === "featured") return filteredEntries;

    return filteredEntries.toSorted((left, right) => {
        if (options.sort === "badges-asc") {
            return (
                left.badgeCount - right.badgeCount ||
                titleCollator.compare(left.title, right.title)
            );
        }
        if (options.sort === "badges-desc") {
            return (
                right.badgeCount - left.badgeCount ||
                titleCollator.compare(left.title, right.title)
            );
        }
        if (options.sort === "category-asc") {
            return (
                titleCollator.compare(left.category, right.category) ||
                titleCollator.compare(left.title, right.title)
            );
        }
        const titleOrder = titleCollator.compare(left.title, right.title);
        return options.sort === "title-desc" ? -titleOrder : titleOrder;
    });
}

/**
 * @template {GalleryEntry} T
 *
 * @param {ReadonlyArray<T>} entries
 * @param {number} requestedPage
 * @param {number} requestedPageSize
 */
export function paginateEntries(entries, requestedPage, requestedPageSize) {
    const pageSize =
        Number.isSafeInteger(requestedPageSize) && requestedPageSize > 0
            ? requestedPageSize
            : 1;
    const totalPages = Math.max(1, Math.ceil(entries.length / pageSize));
    const page = Math.min(Math.max(1, requestedPage), totalPages);
    const start = (page - 1) * pageSize;
    return {
        first: entries.length === 0 ? 0 : start + 1,
        last: Math.min(start + pageSize, entries.length),
        page,
        totalPages,
        visibleEntries: entries.slice(start, start + pageSize),
    };
}

/** @param {string | null | undefined} value @param {GalleryView} fallback */
export function parseGalleryView(value, fallback) {
    return value === "grid" || value === "list" ? value : fallback;
}

/** @param {string | null | undefined} value @param {SortMode} fallback */
export function parseSortMode(value, fallback) {
    if (sortModes.has(value ?? "")) {
        return /** @type {SortMode} */ (value);
    }
    return fallback;
}
