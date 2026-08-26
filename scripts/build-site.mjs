import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repositoryRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    ".."
);
const libraryPath = path.join(repositoryRoot, "library.md");
const providerRegistryPath = path.join(
    repositoryRoot,
    "data",
    "providers.json"
);
const siteOutputPath = path.join(repositoryRoot, "docs", "catalog.js");
const packageOutputPath = path.join(
    repositoryRoot,
    "src",
    "generated",
    "catalog.ts"
);
const checkOnly = process.argv.includes("--check");
const minimumLayoutCount = 52;

/**
 * @typedef {object} Badge
 *
 * @property {string} alt
 * @property {string} image
 * @property {string} target
 * @property {string} provider
 */

/**
 * @typedef {object} CatalogEntry
 *
 * @property {number} badgeCount
 * @property {string} category
 * @property {string} description
 * @property {string} id
 * @property {string[]} languages
 * @property {string[]} placeholders
 * @property {Record<string, number>} providerBadgeCounts
 * @property {string[]} providers
 * @property {number} sourceLine
 * @property {string} template
 * @property {string} title
 */

const placeholderNames = [
    "UPTIME_ROBOT_MONITOR_KEY",
    "WORKFLOW_FILE",
    "CODECLIMATE_REPO",
    "CODECLIMATE_ORG",
    "DEEPSCAN_PROJECT",
    "DEEPSCAN_BRANCH",
    "DEEPSCAN_TEAM",
    "LIBERAPAY_ACCOUNT",
    "APPVEYOR_PROJECT",
    "APPVEYOR_ACCOUNT",
    "AZURE_PIPELINE",
    "PUBLISHER.EXTENSION",
    "DISCORD_ID_OR_SLUG",
    "WINGET_PACKAGE_ID",
    "AZURE_PROJECT",
    "MATRIX_SERVER",
    "MASTODON_SERVER",
    "MASTODON_USER",
    "SNYK_PROJECT_ID",
    "GITLAB_NAMESPACE",
    "SCOOP_PACKAGE",
    "MATRIX_ROOM",
    "ACTION_SLUG",
    "EXTENSION_ID",
    "DOCKER_SCOPE",
    "DISTRIBUTION",
    "INVITE_CODE",
    "ARTIFACT_ID",
    "ADDON_SLUG",
    "SNYK_ORG",
    "TOOL_NAME",
    "AZURE_ORG",
    "CI_BRANCH",
    "CI_OWNER",
    "CI_REPO",
    "NAMESPACE",
    "EXTENSION",
    "COLLECTIVE",
    "GROUP_ID",
    "APP_ID",
    "FILE_PATH",
    "FORMULA",
    "PACKAGE",
    "BRANCH",
    "MODULE",
    "VENDOR",
    "OWNER",
    "REPO",
    "IMAGE",
    "CRATE",
    "GEM",
    "POD",
    "CASK",
    "SNAP",
    "ARCH",
    "TAG",
];

const languageAnnotationPattern = /^<!-- languages: ([^<>]+) -->$/;

/**
 * @typedef {object} ProviderDefinition
 *
 * @property {string[]} deliveryHosts
 * @property {string} documentation
 * @property {string} homepage
 * @property {string} id
 * @property {string[]} imageHosts
 * @property {string} name
 * @property {string} sampleUrl
 */

/**
 * @param {string} image
 * @param {string} title
 *
 * @returns {string}
 */
function providerForImage(image, title) {
    const url = new URL(image);
    if (
        url.protocol !== "https:" ||
        url.username.length > 0 ||
        url.password.length > 0
    ) {
        throw new Error(
            `Badge image in "${title}" is not safe HTTPS: ${image}`
        );
    }
    const provider = providerByImageHost.get(url.hostname);
    if (provider === undefined) {
        throw new Error(
            `Badge image in "${title}" uses an unregistered service: ${url.hostname}`
        );
    }
    return provider.id;
}

/** @param {string} template */
function findPlaceholders(template) {
    let remainingTemplate = template;
    const placeholders = [];
    const longestFirst = placeholderNames.toSorted(
        (left, right) => right.length - left.length
    );
    for (const placeholder of longestFirst) {
        const index = remainingTemplate.indexOf(placeholder);
        if (index === -1) continue;
        placeholders.push({ index, placeholder });
        remainingTemplate = remainingTemplate.replaceAll(placeholder, () =>
            " ".repeat(placeholder.length)
        );
    }
    return placeholders
        .toSorted((left, right) => left.index - right.index)
        .map(({ placeholder }) => placeholder);
}

/** @param {string} value */
function stripInlineMarkdown(value) {
    return stripInlineLinks(value.replaceAll(/`([^`]+)`/g, "$1"))
        .replaceAll(/\s+/g, " ")
        .trim();
}

/** @param {string} value */
function stripInlineLinks(value) {
    let cursor = 0;
    let result = "";

    while (cursor < value.length) {
        const labelStart = value.indexOf("[", cursor);
        if (labelStart === -1) return result + value.slice(cursor);

        const labelEnd = value.indexOf("](", labelStart + 1);
        if (labelEnd === -1) return result + value.slice(cursor);

        const targetEnd = value.indexOf(")", labelEnd + 2);
        if (targetEnd === -1) return result + value.slice(cursor);

        result += value.slice(cursor, labelStart);
        result += value.slice(labelStart + 1, labelEnd);
        cursor = targetEnd + 1;
    }

    return result;
}

/** @param {string[]} lines */
function cleanDescription(lines) {
    return stripInlineMarkdown(
        lines
            .filter(
                (line) =>
                    !line.trimStart().startsWith("[![") &&
                    !languageAnnotationPattern.test(line.trim())
            )
            .join(" ")
    );
}

/**
 * @param {string[]} lines
 * @param {string} title
 * @param {number} sourceLine
 *
 * @returns {string[]}
 */
function parseLanguages(lines, title, sourceLine) {
    const annotations = lines
        .map((line) => languageAnnotationPattern.exec(line.trim()))
        .filter((match) => match !== null);
    if (annotations.length !== 1) {
        throw new Error(
            `Layout "${title}" at library.md:${sourceLine} must have exactly one <!-- languages: ... --> annotation.`
        );
    }

    const languages = (annotations[0]?.[1] ?? "")
        .split(",")
        .map((language) => language.trim())
        .filter(Boolean);
    if (
        languages.length === 0 ||
        new Set(languages).size !== languages.length
    ) {
        throw new Error(
            `Layout "${title}" at library.md:${sourceLine} has empty or duplicate language values.`
        );
    }
    return languages;
}

/** @param {string} value */
function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

/**
 * @param {string} markdown
 * @param {string} title
 *
 * @returns {Badge[]}
 */
function parseBadges(markdown, title) {
    /** @type {Badge[]} */
    const badges = [];
    const pattern =
        /\[!\[([^\]]*)\]\((https:\/\/[^)\s]+)\)\]\((https:\/\/[^)\s]+)\)/g;
    let match;

    while ((match = pattern.exec(markdown)) !== null) {
        badges.push({
            alt: match[1] ?? "",
            image: match[2] ?? "",
            provider: "",
            target: match[3] ?? "",
        });
    }

    const markerCount = (markdown.match(/\[!\[/g) ?? []).length;
    if (badges.length !== markerCount || badges.length === 0) {
        throw new Error(
            `Could not parse every badge in "${title}": parsed ${badges.length} of ${markerCount}.`
        );
    }

    for (const badge of badges) {
        badge.provider = providerForImage(badge.image, title);
        if (!badge.alt.endsWith(".")) {
            throw new Error(
                `Badge alt text in "${title}" must end with a period: ${badge.alt}`
            );
        }
    }

    return badges;
}

/**
 * @param {string[]} lines
 * @param {number} fenceIndex
 *
 * @returns {{ endIndex: number; startLine: number; template: string }}
 */
function readMarkdownBlock(lines, fenceIndex) {
    const block = [];
    const startLine = fenceIndex + 2;
    let index = fenceIndex + 1;

    while (index < lines.length && lines[index] !== "```") {
        block.push(lines[index] ?? "");
        index += 1;
    }

    if (index >= lines.length) {
        throw new Error(
            `Unclosed Markdown fence starting at library.md:${startLine - 1}.`
        );
    }

    return { endIndex: index, startLine, template: block.join("\n").trim() };
}

/**
 * @param {string} category
 * @param {string} title
 * @param {number} headingLine
 * @param {number} markdownFenceCount
 * @param {string} template
 * @param {Set<string>} usedIds
 *
 * @returns {CatalogEntry}
 */
function createCatalogEntry(
    category,
    title,
    headingLine,
    markdownFenceCount,
    template,
    usedIds
) {
    const entryTitle = title || category;
    if (!category || !entryTitle) {
        throw new Error(
            `Layout at library.md:${headingLine} has no section heading.`
        );
    }

    let id = slugify(`${category}-${entryTitle}`);
    if (usedIds.has(id)) id = `${id}-${markdownFenceCount}`;
    usedIds.add(id);

    const badges = parseBadges(template, entryTitle);
    const placeholders = findPlaceholders(template);
    const providers = [...new Set(badges.map((badge) => badge.provider))];
    const providerBadgeCounts = Object.fromEntries(
        providers.map((provider) => [
            provider,
            badges.filter((badge) => badge.provider === provider).length,
        ])
    );

    return {
        id,
        category,
        title: entryTitle,
        description: "",
        languages: [],
        sourceLine: headingLine,
        template,
        placeholders,
        providerBadgeCounts,
        providers,
        badgeCount: badges.length,
    };
}

/**
 * @param {string} markdown
 *
 * @returns {CatalogEntry[]}
 */
function parseLibrary(markdown) {
    const lines = markdown.replaceAll("\r\n", "\n").split("\n");
    /** @type {CatalogEntry[]} */
    const entries = [];
    const headingLayoutCounts = new Map();
    const usedIds = new Set();
    let category = "";
    let title = "";
    let headingLine = 0;
    /** @type {string[]} */
    let intro = [];
    let markdownFenceCount = 0;
    let consumedThrough = -1;

    for (const [index, line] of lines.entries()) {
        // A fenced block is parsed as one layout; skip its individual lines.
        if (index <= consumedThrough) continue;

        const categoryMatch = /^## (.+)$/.exec(line);
        if (categoryMatch) {
            category = stripInlineMarkdown(categoryMatch[1] ?? "");
            title = "";
            headingLine = index + 1;
            intro = [];
            continue;
        }

        const titleMatch = /^### (.+)$/.exec(line);
        if (titleMatch) {
            title = stripInlineMarkdown(titleMatch[1] ?? "");
            headingLine = index + 1;
            headingLayoutCounts.set(headingLine, 0);
            intro = [];
            continue;
        }

        if (line !== "```md") {
            intro.push(line.trim());
            continue;
        }

        markdownFenceCount += 1;
        const block = readMarkdownBlock(lines, index);
        consumedThrough = block.endIndex;
        const entry = createCatalogEntry(
            category,
            title,
            block.startLine,
            markdownFenceCount,
            block.template,
            usedIds
        );
        entry.languages = parseLanguages(intro, entry.title, headingLine);
        entry.description = cleanDescription(intro);
        entry.sourceLine = headingLine;
        entries.push(entry);

        if (title) {
            headingLayoutCounts.set(
                headingLine,
                (headingLayoutCounts.get(headingLine) ?? 0) + 1
            );
        }
        intro = [];
    }

    if (entries.length !== markdownFenceCount) {
        throw new Error(
            `Parsed ${entries.length} layouts from ${markdownFenceCount} Markdown fences.`
        );
    }
    if (entries.length < minimumLayoutCount) {
        throw new Error(
            `Expected at least ${minimumLayoutCount} layouts, found ${entries.length}.`
        );
    }

    const emptyHeadings = [...headingLayoutCounts.entries()].filter(
        ([, count]) => count === 0
    );
    if (emptyHeadings.length > 0) {
        throw new Error(
            `Every level-three heading must own a layout; missing at lines ${emptyHeadings
                .map(([line]) => line)
                .join(", ")}.`
        );
    }

    return entries;
}

const providerRegistry = JSON.parse(
    await readFile(providerRegistryPath, "utf8")
);
/** @type {ProviderDefinition[]} */
const providerDefinitions = providerRegistry.providers ?? [];
if (providerDefinitions.length === 0) {
    throw new Error("data/providers.json must define at least one provider.");
}
const providerIds = providerDefinitions.map((provider) => provider.id);
if (new Set(providerIds).size !== providerIds.length) {
    throw new Error("data/providers.json contains duplicate provider IDs.");
}
/** @type {Map<string, ProviderDefinition>} */
const providerByImageHost = new Map();
for (const provider of providerDefinitions) {
    for (const hostname of provider.imageHosts) {
        if (providerByImageHost.has(hostname)) {
            throw new Error(`Provider image host is duplicated: ${hostname}`);
        }
        providerByImageHost.set(hostname, provider);
    }
}

const library = await readFile(libraryPath, "utf8");
const entries = parseLibrary(library);
const categories = [...new Set(entries.map((entry) => entry.category))];
const languages = [
    ...new Set(entries.flatMap((entry) => entry.languages)),
].toSorted((left, right) => {
    if (left === "Language agnostic") return -1;
    if (right === "Language agnostic") return 1;
    return left.localeCompare(right);
});
const badgeCount = entries.reduce(
    (total, entry) => total + entry.badgeCount,
    0
);
const providers = providerDefinitions.map((provider) => ({
    ...provider,
    badgeCount: entries.reduce(
        (total, entry) => total + (entry.providerBadgeCounts[provider.id] ?? 0),
        0
    ),
    layoutCount: entries.filter((entry) =>
        entry.providers.includes(provider.id)
    ).length,
}));
const catalog = {
    generatedFrom: "library.md",
    layoutCount: entries.length,
    badgeCount,
    categoryCount: categories.length,
    categories,
    languageCount: languages.length,
    languages,
    providerCount: providers.length,
    providers,
    entries,
};
const catalogJson = JSON.stringify(catalog, null, 4);
const siteOutput = `// Generated by scripts/build-site.mjs from library.md. Do not edit.\n\nexport const badgeCatalog = ${catalogJson};\n`;
const packageOutput = `// Generated by scripts/build-site.mjs from library.md. Do not edit.\n\nexport const badgeCatalog = ${catalogJson} as const;\n`;
const generatedOutputs = [
    { content: siteOutput, path: siteOutputPath },
    { content: packageOutput, path: packageOutputPath },
];

if (checkOnly) {
    const staleOutputs = [];
    for (const generatedOutput of generatedOutputs) {
        const current = await readFile(generatedOutput.path, "utf8").catch(
            () => ""
        );
        if (current !== generatedOutput.content) {
            staleOutputs.push(
                path.relative(repositoryRoot, generatedOutput.path)
            );
        }
    }
    if (staleOutputs.length > 0) {
        throw new Error(
            `${staleOutputs.join(", ")} ${staleOutputs.length === 1 ? "is" : "are"} stale. Run npm run build:catalog and commit the generated output.`
        );
    }
    console.log(
        `Catalog is current: ${entries.length} layouts, ${badgeCount} badges, ${categories.length} categories, ${languages.length} languages, ${providers.length} services.`
    );
} else {
    await mkdir(path.dirname(packageOutputPath), { recursive: true });
    await Promise.all(
        generatedOutputs.map((generatedOutput) =>
            writeFile(generatedOutput.path, generatedOutput.content, "utf8")
        )
    );
    console.log(
        `Generated site and package catalogs: ${entries.length} layouts, ${badgeCount} badges, ${categories.length} categories, ${languages.length} languages, ${providers.length} services.`
    );
}
