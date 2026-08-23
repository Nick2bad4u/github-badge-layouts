/** The complete generated badge catalog. */
export interface BadgeCatalog {
    readonly badgeCount: number;
    readonly categories: readonly string[];
    readonly categoryCount: number;
    readonly entries: readonly BadgeCatalogEntry[];
    readonly generatedFrom: string;
    readonly layoutCount: number;
}

/** A single reusable badge-layout record generated from `library.md`. */
export interface BadgeCatalogEntry {
    readonly badgeCount: number;
    readonly category: string;
    readonly description: string;
    readonly id: string;
    readonly placeholders: readonly string[];
    readonly sourceLine: number;
    readonly template: string;
    readonly title: string;
}

/** Result returned by {@link inspectBadgeMarkdown}. */
export interface BadgeMarkdownInspection {
    readonly badgeCount: number;
    readonly classicBadgeCount: number;
    readonly flatBadgeCount: number;
    readonly placeholders: readonly string[];
    readonly unknownBadgeCount: number;
}

/** The two Badgen renderers supported by the catalog. */
export type BadgeStyle = "classic" | "flat";

/** Placeholder values used while rendering a layout. */
export type PlaceholderValues = Readonly<Record<string, string>>;

/** Options accepted by {@link renderLayout}. */
export interface RenderOptions {
    /** Preserve unresolved placeholders instead of rejecting the render. */
    readonly allowUnresolved?: boolean;
    /** Default branch used for the `BRANCH` placeholder. */
    readonly branch?: string;
    /** GitHub owner used for the `OWNER` placeholder. */
    readonly owner?: string;
    /** Additional or overriding placeholder values. */
    readonly placeholders?: PlaceholderValues;
    /** GitHub repository used for the `REPO` placeholder. */
    readonly repo?: string;
    /** Badgen hostname style. Defaults to `flat`. */
    readonly style?: BadgeStyle;
}
