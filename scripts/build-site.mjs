import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repositoryRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    ".."
);
const libraryPath = path.join(repositoryRoot, "library.md");
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
 */

/**
 * @typedef {object} CatalogEntry
 *
 * @property {number} badgeCount
 * @property {string} category
 * @property {string} description
 * @property {string} id
 * @property {string[]} placeholders
 * @property {number} sourceLine
 * @property {string} template
 * @property {string} title
 */

const placeholderNames = [
    "UPTIME_ROBOT_MONITOR_KEY",
    "PUBLISHER.EXTENSION",
    "DISCORD_ID_OR_SLUG",
    "WINGET_PACKAGE_ID",
    "SNYK_PROJECT_ID",
    "GITLAB_NAMESPACE",
    "SCOOP_PACKAGE",
    "ACTION_SLUG",
    "EXTENSION_ID",
    "DOCKER_SCOPE",
    "DISTRIBUTION",
    "INVITE_CODE",
    "ARTIFACT_ID",
    "ADDON_SLUG",
    "SNYK_ORG",
    "TOOL_NAME",
    "NAMESPACE",
    "EXTENSION",
    "COLLECTIVE",
    "GROUP_ID",
    "APP_ID",
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

/** @param {string} value */
function stripInlineMarkdown(value) {
    return value
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
        .replace(/\s+/g, " ")
        .trim();
}

/** @param {string[]} lines */
function cleanDescription(lines) {
    return stripInlineMarkdown(
        lines.filter((line) => !line.trimStart().startsWith("[![")).join(" ")
    );
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
        if (!badge.image.startsWith("https://flat.badgen.net/")) {
            throw new Error(
                `Badge image in "${title}" does not use flat.badgen.net: ${badge.image}`
            );
        }
        if (!badge.alt.endsWith(".")) {
            throw new Error(
                `Badge alt text in "${title}" must end with a period: ${badge.alt}`
            );
        }
    }

    return badges;
}

/**
 * @param {string} markdown
 *
 * @returns {CatalogEntry[]}
 */
function parseLibrary(markdown) {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
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

    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index] ?? "";
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
        const block = [];
        const blockStartLine = index + 2;
        index += 1;
        while (index < lines.length && lines[index] !== "```") {
            block.push(lines[index] ?? "");
            index += 1;
        }

        if (index >= lines.length) {
            throw new Error(
                `Unclosed Markdown fence starting at library.md:${blockStartLine - 1}.`
            );
        }

        const template = block.join("\n").trim();
        const entryTitle = title || category;
        if (!category || !entryTitle) {
            throw new Error(
                `Layout at library.md:${blockStartLine} has no section heading.`
            );
        }

        let id = slugify(`${category}-${entryTitle}`);
        if (usedIds.has(id)) {
            id = `${id}-${markdownFenceCount}`;
        }
        usedIds.add(id);

        const badges = parseBadges(template, entryTitle);
        const placeholders = placeholderNames
            .filter((placeholder) => template.includes(placeholder))
            .sort(
                (left, right) =>
                    template.indexOf(left) - template.indexOf(right)
            );

        entries.push({
            id,
            category,
            title: entryTitle,
            description: cleanDescription(intro),
            sourceLine: headingLine,
            template,
            placeholders,
            badgeCount: badges.length,
        });

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

const library = await readFile(libraryPath, "utf8");
const entries = parseLibrary(library);
const categories = [...new Set(entries.map((entry) => entry.category))];
const badgeCount = entries.reduce(
    (total, entry) => total + entry.badgeCount,
    0
);
const catalog = {
    generatedFrom: "library.md",
    layoutCount: entries.length,
    badgeCount,
    categoryCount: categories.length,
    categories,
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
        `Catalog is current: ${entries.length} layouts, ${badgeCount} badges, ${categories.length} categories.`
    );
} else {
    await mkdir(path.dirname(packageOutputPath), { recursive: true });
    await Promise.all(
        generatedOutputs.map((generatedOutput) =>
            writeFile(generatedOutput.path, generatedOutput.content, "utf8")
        )
    );
    console.log(
        `Generated site and package catalogs: ${entries.length} layouts, ${badgeCount} badges, ${categories.length} categories.`
    );
}
