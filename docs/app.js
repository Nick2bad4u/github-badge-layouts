import { badgeCatalog } from "./catalog.js";

/**
 * @typedef {"classic" | "flat"} BadgeStyle
 */

/**
 * @typedef {object} BadgeCatalogEntry
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

/**
 * @typedef {object} BadgeLink
 *
 * @property {string} alt
 * @property {string} image
 * @property {string} target
 */

/**
 * @typedef {object} AppState
 *
 * @property {string} branch
 * @property {string} category
 * @property {string} owner
 * @property {number} page
 * @property {number} pageSize
 * @property {string} query
 * @property {string} repo
 * @property {BadgeStyle} style
 */

const repositoryUrl = "https://github.com/Nick2bad4u/github-badge-layouts";
const storageKey = "github-badge-layouts:preferences:v1";
const defaultState = Object.freeze({
    branch: "main",
    category: "all",
    owner: "Nick2bad4u",
    page: 1,
    pageSize: 6,
    query: "",
    repo: "gh-runs-cleanup",
    style: /** @type {BadgeStyle} */ ("flat"),
});

/** @type {Map<string, Record<string, string>>} */
const valuesByEntry = new Map();
/** @type {{ timer: ReturnType<typeof setTimeout> | null }} */
const toastState = { timer: null };
/** @type {{ timer: ReturnType<typeof setTimeout> | null }} */
const contextRenderState = { timer: null };

/**
 * @template {Element} T
 *
 * @param {ParentNode} root
 * @param {string} selector
 *
 * @returns {T}
 */
function queryRequired(root, selector) {
    const element = root.querySelector(selector);
    if (!element) {
        throw new Error(`Required page element is missing: ${selector}`);
    }
    return /** @type {T} */ (element);
}

/** @type {HTMLInputElement} */
const ownerInput = queryRequired(document, "#owner");
/** @type {HTMLInputElement} */
const repositoryInput = queryRequired(document, "#repository");
/** @type {HTMLInputElement} */
const branchInput = queryRequired(document, "#branch");
/** @type {HTMLInputElement} */
const searchInput = queryRequired(document, "#search");
/** @type {HTMLSelectElement} */
const categorySelect = queryRequired(document, "#category");
/** @type {HTMLSelectElement} */
const pageSizeSelect = queryRequired(document, "#page-size");
/** @type {HTMLElement} */
const contextSummary = queryRequired(document, "#context-summary");
/** @type {HTMLElement} */
const grid = queryRequired(document, "#layout-grid");
/** @type {HTMLElement} */
const emptyState = queryRequired(document, "#empty-state");
/** @type {HTMLElement} */
const resultCount = queryRequired(document, "#result-count");
/** @type {HTMLElement} */
const pagination = queryRequired(document, "#pagination");
/** @type {HTMLElement} */
const pageList = queryRequired(document, "#page-list");
/** @type {HTMLElement} */
const pageSummary = queryRequired(document, "#page-summary");
/** @type {HTMLButtonElement} */
const firstPageButton = queryRequired(document, "#first-page");
/** @type {HTMLButtonElement} */
const previousPageButton = queryRequired(document, "#previous-page");
/** @type {HTMLButtonElement} */
const nextPageButton = queryRequired(document, "#next-page");
/** @type {HTMLButtonElement} */
const lastPageButton = queryRequired(document, "#last-page");
/** @type {HTMLButtonElement} */
const resetFiltersButton = queryRequired(document, "#reset-filters");
/** @type {HTMLButtonElement} */
const resetContextButton = queryRequired(document, "#reset-context");
/** @type {HTMLElement} */
const toast = queryRequired(document, "#toast");

/** @type {Readonly<Record<string, string>>} */
const generalExamples = Object.freeze({
    ACTION_SLUG: "checkout",
    ADDON_SLUG: "ublock-origin",
    APP_ID: "org.fdroid.fdroid",
    ARCH: "amd64",
    ARTIFACT_ID: "commons-lang3",
    CASK: "firefox",
    COLLECTIVE: "babel",
    CRATE: "serde",
    DISCORD_ID_OR_SLUG: "81384788765712384",
    DISTRIBUTION: "Moose",
    DOCKER_SCOPE: "library",
    EXTENSION: "vscode-yaml",
    EXTENSION_ID: "cjpalhdlnbpafiamejdnhcphjbkeiagm",
    FORMULA: "git",
    GEM: "rails",
    GITLAB_NAMESPACE: "gitlab-org",
    GROUP_ID: "org.apache.commons",
    IMAGE: "alpine",
    INVITE_CODE: "discord-developers",
    MODULE: "Pester",
    NAMESPACE: "redhat",
    PACKAGE: "eslint",
    POD: "Alamofire",
    "PUBLISHER.EXTENSION": "ms-vscode.cpptools",
    SCOOP_PACKAGE: "git",
    SNAP: "code",
    SNYK_ORG: "snyk-labs",
    SNYK_PROJECT_ID: "goof",
    TAG: "latest",
    TOOL_NAME: "ESLint plugin",
    UPTIME_ROBOT_MONITOR_KEY: "m780862947-3e92c0970c6c07c494b14c40",
    VENDOR: "monolog",
    WINGET_PACKAGE_ID: "Git.Git",
});

/** @type {{ test: RegExp; values: Record<string, string> }[]} */
const ecosystemExamples = [
    {
        test: /GitLab/v,
        values: { GITLAB_NAMESPACE: "gitlab-org", REPO: "gitlab" },
    },
    {
        test: /JavaScript|TypeScript|npm/v,
        values: { OWNER: "eslint", PACKAGE: "eslint", REPO: "eslint" },
    },
    { test: /Docker/v, values: { DOCKER_SCOPE: "library", IMAGE: "alpine" } },
    {
        test: /Go module/v,
        values: {
            MODULE: "github.com/gin-gonic/gin",
            OWNER: "gin-gonic",
            REPO: "gin",
        },
    },
    {
        test: /PowerShell/v,
        values: { MODULE: "Pester", OWNER: "pester", REPO: "Pester" },
    },
    {
        test: /PyPI|Python/v,
        values: { OWNER: "psf", PACKAGE: "requests", REPO: "requests" },
    },
    {
        test: /NuGet|\.NET/v,
        values: {
            OWNER: "JamesNK",
            PACKAGE: "Newtonsoft.Json",
            REPO: "Newtonsoft.Json",
        },
    },
    {
        test: /Rust/v,
        values: { CRATE: "serde", OWNER: "serde-rs", REPO: "serde" },
    },
];

/** @returns {Partial<AppState>} */
function loadStoredPreferences() {
    const raw = localStorage.getItem(storageKey);
    if (raw === null || raw.length === 0) return {};
    try {
        return parseStoredPreferences(raw);
    } catch {
        return {};
    }
}

/** @param {string | null} value @param {number} fallback */
function parsePositiveInteger(value, fallback) {
    if (value === null) return fallback;
    const parsed = Number(value);
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

/** @param {string} raw @returns {Partial<AppState>} */
function parseStoredPreferences(raw) {
    const parsed = /** @type {unknown} */ (JSON.parse(raw));
    if (typeof parsed !== "object" || parsed === null) return {};

    const record = /** @type {Record<string, unknown>} */ (parsed);
    /** @type {Partial<AppState>} */
    const preferences = {};
    if (typeof record["branch"] === "string")
        preferences.branch = record["branch"];
    if (typeof record["owner"] === "string")
        preferences.owner = record["owner"];
    if (typeof record["pageSize"] === "number")
        preferences.pageSize = record["pageSize"];
    if (typeof record["repo"] === "string") preferences.repo = record["repo"];
    if (record["style"] === "classic" || record["style"] === "flat") {
        preferences.style = record["style"];
    }
    return preferences;
}

/** @param {string | null} value @param {BadgeStyle} fallback */
function parseStyle(value, fallback) {
    return value === "classic" || value === "flat" ? value : fallback;
}

const storedPreferences = loadStoredPreferences();
const initialParameters = new URLSearchParams(location.search);
/** @type {AppState} */
const state = {
    branch:
        initialParameters.get("branch") ??
        (typeof storedPreferences.branch === "string"
            ? storedPreferences.branch
            : defaultState.branch),
    category: initialParameters.get("category") ?? defaultState.category,
    owner:
        initialParameters.get("owner") ??
        (typeof storedPreferences.owner === "string"
            ? storedPreferences.owner
            : defaultState.owner),
    page: parsePositiveInteger(
        initialParameters.get("page"),
        defaultState.page
    ),
    pageSize: parsePositiveInteger(
        initialParameters.get("perPage"),
        typeof storedPreferences.pageSize === "number"
            ? storedPreferences.pageSize
            : defaultState.pageSize
    ),
    query: initialParameters.get("q") ?? defaultState.query,
    repo:
        initialParameters.get("repo") ??
        (typeof storedPreferences.repo === "string"
            ? storedPreferences.repo
            : defaultState.repo),
    style: parseStyle(
        initialParameters.get("style"),
        parseStyle(
            typeof storedPreferences.style === "string"
                ? storedPreferences.style
                : null,
            defaultState.style
        )
    ),
};

/** @param {BadgeCatalogEntry} entry */
function buildCard(entry) {
    const card = document.createElement("article");
    card.className = "layout-card";
    card.id = entry.id;

    const header = document.createElement("header");
    header.className = "card-header";
    const headingGroup = document.createElement("div");
    const category = document.createElement("p");
    category.className = "category-tag";
    category.textContent = entry.category;
    const heading = document.createElement("h2");
    heading.textContent = entry.title;
    headingGroup.append(category, heading);
    const source = document.createElement("a");
    source.className = "source-link";
    source.href = `${repositoryUrl}/blob/main/library.md#L${entry.sourceLine}`;
    source.textContent = "Source ↗";
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    header.append(headingGroup, source);
    card.append(header);

    if (entry.description) {
        const description = document.createElement("p");
        description.className = "description";
        description.textContent = entry.description;
        card.append(description);
    }

    const previewHeader = document.createElement("div");
    previewHeader.className = "preview-header";
    const previewLabel = document.createElement("p");
    previewLabel.className = "preview-label";
    previewLabel.textContent =
        entry.placeholders.length > 0 ? "Personalized preview" : "Live preview";
    const stylePill = document.createElement("span");
    stylePill.className = "style-pill";
    stylePill.textContent = `${state.style === "flat" ? "◆" : "◇"} ${state.style}`;
    previewHeader.append(previewLabel, stylePill);
    const preview = document.createElement("div");
    preview.className = "badge-preview";
    preview.dataset["preview"] = "";
    card.append(previewHeader, preview);

    const editor = buildPlaceholderEditor(entry, card);
    if (editor) card.append(editor);

    const markdownWrap = document.createElement("div");
    markdownWrap.className = "markdown-wrap";
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.dataset["markdown"] = "";
    pre.append(code);
    markdownWrap.append(pre);
    card.append(markdownWrap);

    const actions = document.createElement("div");
    actions.className = "card-actions";
    const actionButtons = document.createElement("div");
    actionButtons.className = "action-buttons";
    const copyButton = document.createElement("button");
    copyButton.className = "copy-button";
    copyButton.type = "button";
    copyButton.textContent = "⧉ Copy Markdown";
    copyButton.addEventListener("click", () => {
        void copyLayoutMarkdown(entry, copyButton);
    });
    const cliButton = document.createElement("button");
    cliButton.className = "secondary-button compact-button";
    cliButton.type = "button";
    cliButton.textContent = "⌘ Copy CLI";
    cliButton.addEventListener("click", () => {
        void copyLayoutCliCommand(entry);
    });
    actionButtons.append(copyButton, cliButton);
    const count = document.createElement("span");
    count.className = "badge-count";
    count.textContent = `${entry.badgeCount} badge${entry.badgeCount === 1 ? "" : "s"}`;
    actions.append(actionButtons, count);
    card.append(actions);

    updatePreview(entry, card);
    updateCode(entry, card);
    return card;
}

/** @param {BadgeCatalogEntry} entry */
function buildCliCommand(entry) {
    const localValues = valuesByEntry.get(entry.id) ?? {};
    const assignments = Object.entries(localValues)
        .filter(([, value]) => value.trim())
        .map(([name, value]) => {
            const assignment = `${name}=${value.trim()}`;
            return ` --set ${quoteCliArgument(assignment)}`;
        })
        .join("");
    const command = [
        "npx github-badge-layouts render",
        entry.id,
        "--owner",
        quoteCliArgument(state.owner),
        "--repo",
        quoteCliArgument(state.repo),
        "--branch",
        quoteCliArgument(state.branch),
        "--style",
        state.style,
    ].join(" ");
    return command + assignments;
}

/** @param {BadgeCatalogEntry} entry @param {HTMLElement} card */
function buildPlaceholderEditor(entry, card) {
    if (entry.placeholders.length === 0) return null;

    const details = document.createElement("details");
    details.className = "customizer";
    const summary = document.createElement("summary");
    summary.textContent = `Per-layout overrides (${entry.placeholders.length})`;
    details.append(summary);

    const fields = document.createElement("div");
    fields.className = "placeholder-grid";
    const values = valuesByEntry.get(entry.id) ?? {};
    const defaults = globalValues(entry);

    for (const placeholder of entry.placeholders) {
        const wrapper = document.createElement("div");
        wrapper.className = "placeholder-field";
        const inputId = `${entry.id}-${placeholder.replaceAll(/[^0-9a-z]+/giv, "-")}`;
        const label = document.createElement("label");
        label.className = "placeholder-label";
        label.htmlFor = inputId;
        label.textContent = placeholder;
        label.title = placeholder;
        const input = document.createElement("input");
        input.id = inputId;
        input.type = "text";
        input.value = values[placeholder] ?? "";
        input.placeholder =
            defaults[placeholder] ?? exampleValue(entry, placeholder);
        input.autocomplete = "off";
        input.spellcheck = false;
        input.addEventListener("input", () => {
            const nextValues = valuesByEntry.get(entry.id) ?? {};
            nextValues[placeholder] = input.value;
            valuesByEntry.set(entry.id, nextValues);
            updatePreview(entry, card);
            updateCode(entry, card);
        });
        wrapper.append(label, input);
        fields.append(wrapper);
    }

    const resetFields = document.createElement("button");
    resetFields.className = "reset-fields";
    resetFields.type = "button";
    resetFields.textContent = "↺ Clear overrides";
    resetFields.addEventListener("click", () => {
        valuesByEntry.delete(entry.id);
        fields.querySelectorAll("input").forEach((input) => {
            input.value = "";
        });
        updatePreview(entry, card);
        updateCode(entry, card);
        showToast(`Cleared overrides for ${entry.title}.`);
    });
    details.append(fields, resetFields);
    return details;
}

function contextIsValid() {
    const owner = ownerInput.value.trim();
    const repository = repositoryInput.value.trim();
    const branch = branchInput.value.trim();
    const isOwnerValid =
        owner.length > 0 &&
        owner.length <= 39 &&
        !owner.startsWith("-") &&
        !owner.endsWith("-") &&
        hasOnlyCharacters(
            owner,
            (character) => isAsciiAlphaNumeric(character) || character === "-"
        );
    const isRepositoryValid =
        repository.length > 0 &&
        repository.length <= 100 &&
        hasOnlyCharacters(
            repository,
            (character) =>
                isAsciiAlphaNumeric(character) || "._-".includes(character)
        );
    const isBranchValid = isValidGitRefName(branch);
    /**
     * @type {{
     *     input: HTMLInputElement;
     *     message: string;
     *     valid: boolean;
     * }[]}
     */
    const validity = [
        {
            input: ownerInput,
            message: "Enter a valid GitHub owner.",
            valid: isOwnerValid,
        },
        {
            input: repositoryInput,
            message: "Enter a valid repository name.",
            valid: isRepositoryValid,
        },
        {
            input: branchInput,
            message: "Enter a valid Git branch name.",
            valid: isBranchValid,
        },
    ];
    for (const { input, message, valid } of validity) {
        input.setAttribute("aria-invalid", String(!valid));
        input.setCustomValidity(valid ? "" : message);
    }
    return isOwnerValid && isRepositoryValid && isBranchValid;
}

/** @param {string} markdown @param {BadgeStyle} style */
function convertStyle(markdown, style) {
    const host =
        style === "flat" ? "https://flat.badgen.net/" : "https://badgen.net/";
    return markdown.replaceAll(
        /https:\/\/(?:flat\.)?badgen\.net\//gv,
        () => host
    );
}

/** @param {BadgeCatalogEntry} entry */
async function copyLayoutCliCommand(entry) {
    try {
        await copyText(buildCliCommand(entry));
        showToast(`Copied CLI command for ${entry.title}.`);
    } catch (error) {
        showToast(error instanceof Error ? error.message : "Copy failed.");
    }
}

/** @param {BadgeCatalogEntry} entry @param {HTMLButtonElement} button */
async function copyLayoutMarkdown(entry, button) {
    try {
        await copyText(replacePlaceholders(entry, false));
        button.textContent = "✓ Copied";
        showToast(`Copied ${entry.title}.`);
        setTimeout(() => {
            button.textContent = "⧉ Copy Markdown";
        }, 1600);
    } catch (error) {
        showToast(
            error instanceof Error ? error.message : "Could not copy Markdown."
        );
    }
}

/** @param {string} text */
async function copyText(text) {
    if (isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.className = "clipboard-fallback";
    document.body.append(textarea);
    textarea.select();
    const isCopied = document.execCommand("copy");
    textarea.remove();
    if (!isCopied) throw new Error("The browser denied clipboard access.");
}

/** @param {BadgeCatalogEntry} entry @param {string} placeholder */
function exampleValue(entry, placeholder) {
    const haystack = `${entry.category} ${entry.title}`;
    const ecosystem = ecosystemExamples.find(({ test }) => test.test(haystack));
    return (
        ecosystem?.values[placeholder] ??
        generalExamples[placeholder] ??
        placeholder
    );
}

function getFilteredEntries() {
    const query = state.query.trim().toLocaleLowerCase();
    return badgeCatalog.entries.filter((entry) => {
        const isInCategory =
            state.category === "all" || entry.category === state.category;
        if (!isInCategory) return false;
        if (!query) return true;
        return `${entry.title} ${entry.category} ${entry.description} ${entry.placeholders.join(" ")} ${entry.template}`
            .toLocaleLowerCase()
            .includes(query);
    });
}

/** @param {BadgeCatalogEntry} entry @returns {Record<string, string>} */
function globalValues(entry) {
    return {
        BRANCH: state.branch,
        OWNER: state.owner,
        REPO: state.repo,
        ...Object.fromEntries(
            entry.placeholders
                .filter((name) => generalExamples[name] !== undefined)
                .map((name) => [name, exampleValue(entry, name)])
        ),
    };
}

/** @param {string} value @param {(character: string) => boolean} predicate */
function hasOnlyCharacters(value, predicate) {
    for (const character of value) {
        if (!predicate(character)) return false;
    }
    return true;
}

/** @param {string} character */
function isAsciiAlphaNumeric(character) {
    const codePoint = character.codePointAt(0) ?? -1;
    return (
        (codePoint >= 48 && codePoint <= 57) ||
        (codePoint >= 65 && codePoint <= 90) ||
        (codePoint >= 97 && codePoint <= 122)
    );
}

/** @param {string} value */
function isValidGitRefName(value) {
    if (
        value.length === 0 ||
        value.startsWith(".") ||
        value.startsWith("/") ||
        value.endsWith(".") ||
        value.endsWith("/") ||
        value.endsWith(".lock") ||
        value.includes("..") ||
        value.includes("//") ||
        value.includes("@{")
    ) {
        return false;
    }
    const invalidCharacters = " ~^:?*[]\\";
    for (const character of value) {
        const codePoint = character.codePointAt(0) ?? 0;
        const isControlCharacter =
            codePoint <= 0x1f || (codePoint >= 0x7f && codePoint <= 0x9f);
        if (isControlCharacter || invalidCharacters.includes(character)) {
            return false;
        }
    }
    return true;
}

/** @param {string} value */
function normalizeReplacement(value) {
    return value.trim().replaceAll(" ", "%20");
}

/** @param {number} totalPages */
function paginationItems(totalPages) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    const pages = new Set([
        1,
        state.page,
        state.page + 1,
        state.page - 1,
        totalPages,
    ]);
    const validPages = [...pages]
        .filter((page) => page >= 1 && page <= totalPages)
        .toSorted((left, right) => left - right);
    /** @type {(number | "ellipsis")[]} */
    const items = [];
    for (const page of validPages) {
        const previous = items.at(-1);
        if (typeof previous === "number" && page - previous > 1) {
            items.push("ellipsis");
        }
        items.push(page);
    }
    return items;
}

/** @param {string} markdown @returns {BadgeLink[]} */
function parseBadgeLinks(markdown) {
    /** @type {BadgeLink[]} */
    const links = [];
    const pattern =
        /\[!\[(?<alt>[^\]]*)\]\((?<image>https:\/\/[^\s\)]+)\)\]\((?<target>https:\/\/[^\s\)]+)\)/gv;
    let match;
    while ((match = pattern.exec(markdown)) !== null) {
        const { alt = "", image = "", target = "" } = match.groups ?? {};
        links.push({ alt, image, target });
    }
    return links;
}

function persistState() {
    try {
        localStorage.setItem(
            storageKey,
            JSON.stringify({
                branch: state.branch,
                owner: state.owner,
                pageSize: state.pageSize,
                repo: state.repo,
                style: state.style,
            })
        );
    } catch {
        // Private browsing modes can disable storage; the live state still works.
    }

    const parameters = new URLSearchParams();
    if (state.query) parameters.set("q", state.query);
    if (state.category !== defaultState.category) {
        parameters.set("category", state.category);
    }
    if (state.page !== defaultState.page)
        parameters.set("page", String(state.page));
    if (state.pageSize !== defaultState.pageSize) {
        parameters.set("perPage", String(state.pageSize));
    }
    if (state.owner !== defaultState.owner)
        parameters.set("owner", state.owner);
    if (state.repo !== defaultState.repo) parameters.set("repo", state.repo);
    if (state.branch !== defaultState.branch)
        parameters.set("branch", state.branch);
    if (state.style !== defaultState.style)
        parameters.set("style", state.style);
    const query = parameters.toString();
    const search = query.length > 0 ? `?${query}` : "";
    history.replaceState(null, "", location.pathname + search + location.hash);
}

/** @param {string} value */
function quoteCliArgument(value) {
    const escaped = value.replaceAll('"', () => String.raw`\"`);
    return `"${escaped}"`;
}

function render() {
    const entries = getFilteredEntries();
    const totalPages = Math.max(1, Math.ceil(entries.length / state.pageSize));
    state.page = Math.min(Math.max(1, state.page), totalPages);
    const start = (state.page - 1) * state.pageSize;
    const visibleEntries = entries.slice(start, start + state.pageSize);

    grid.replaceChildren(...visibleEntries.map((entry) => buildCard(entry)));
    emptyState.hidden = entries.length > 0;
    grid.hidden = entries.length === 0;
    const first = entries.length === 0 ? 0 : start + 1;
    const last = Math.min(start + visibleEntries.length, entries.length);
    resultCount.textContent = `Showing ${first}–${last} of ${entries.length} matching layouts (${badgeCatalog.layoutCount} total)`;
    contextSummary.textContent = `${state.owner}/${state.repo} · ${state.branch} · ${state.style} Badgen`;
    renderPagination(totalPages);
    persistState();
}

/** @param {number} totalPages */
function renderPagination(totalPages) {
    pagination.hidden = totalPages <= 1;
    firstPageButton.disabled = state.page === 1;
    previousPageButton.disabled = state.page === 1;
    nextPageButton.disabled = state.page === totalPages;
    lastPageButton.disabled = state.page === totalPages;
    pageSummary.textContent = `Page ${state.page} of ${totalPages}`;
    pageList.replaceChildren();

    for (const item of paginationItems(totalPages)) {
        if (item === "ellipsis") {
            const separator = document.createElement("span");
            separator.className = "page-ellipsis";
            separator.textContent = "…";
            separator.ariaHidden = "true";
            pageList.append(separator);
            continue;
        }
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = String(item);
        button.ariaLabel = `Page ${item}`;
        if (item === state.page) {
            button.className = "current-page";
            button.ariaCurrent = "page";
        }
        button.addEventListener("click", () => {
            setPage(item);
        });
        pageList.append(button);
    }
}

/** @param {BadgeCatalogEntry} entry @param {boolean} useExamples */
function replacePlaceholders(entry, useExamples) {
    const localValues = valuesByEntry.get(entry.id) ?? {};
    const defaults = globalValues(entry);
    let markdown = entry.template;
    const sortedPlaceholders = entry.placeholders.toSorted(
        (left, right) => right.length - left.length
    );
    for (const placeholder of sortedPlaceholders) {
        const localValue = localValues[placeholder]?.trim();
        const globalValue = defaults[placeholder]?.trim();
        const replacement =
            localValue !== undefined && localValue.length > 0
                ? normalizeReplacement(localValue)
                : globalValue !== undefined && globalValue.length > 0
                  ? normalizeReplacement(globalValue)
                  : useExamples
                    ? normalizeReplacement(exampleValue(entry, placeholder))
                    : placeholder;
        markdown = markdown.replaceAll(placeholder, () => replacement);
    }
    return convertStyle(markdown, state.style);
}

function resetContext() {
    state.owner = defaultState.owner;
    state.repo = defaultState.repo;
    state.branch = defaultState.branch;
    state.style = defaultState.style;
    ownerInput.value = state.owner;
    repositoryInput.value = state.repo;
    branchInput.value = state.branch;
    /** @type {HTMLInputElement} */
    const styleInput = queryRequired(
        document,
        `input[name="badge-style"][value="${state.style}"]`
    );
    styleInput.checked = true;
    contextIsValid();
    render();
    showToast("Restored Nick's repository defaults.");
}

function resetFilters() {
    state.query = defaultState.query;
    state.category = defaultState.category;
    state.page = defaultState.page;
    searchInput.value = state.query;
    categorySelect.value = state.category;
    render();
    searchInput.focus();
}

function scheduleContextRender() {
    if (contextRenderState.timer !== null) {
        clearTimeout(contextRenderState.timer);
    }
    contextRenderState.timer = setTimeout(() => {
        if (!contextIsValid()) {
            contextSummary.textContent =
                "Fix the highlighted repository values to refresh layouts.";
            return;
        }
        state.owner = ownerInput.value.trim();
        state.repo = repositoryInput.value.trim();
        state.branch = branchInput.value.trim();
        render();
    }, 240);
}

/** @param {number} page @param {boolean} [shouldScroll] */
function setPage(page, shouldScroll = true) {
    if (page === state.page) return;
    state.page = page;
    render();
    if (shouldScroll) {
        resultCount.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

/** @param {string} message */
function showToast(message) {
    if (toastState.timer !== null) clearTimeout(toastState.timer);
    toast.textContent = message;
    toast.classList.add("visible");
    toastState.timer = setTimeout(() => {
        toast.classList.remove("visible");
    }, 2200);
}

/** @param {BadgeCatalogEntry} entry @param {HTMLElement} card */
function updateCode(entry, card) {
    queryRequired(card, "[data-markdown]").textContent = replacePlaceholders(
        entry,
        false
    );
}

/** @param {BadgeCatalogEntry} entry @param {HTMLElement} card */
function updatePreview(entry, card) {
    /** @type {HTMLElement} */
    const preview = queryRequired(card, "[data-preview]");
    preview.replaceChildren();
    const badges = parseBadgeLinks(replacePlaceholders(entry, true));
    for (const badge of badges) {
        const link = document.createElement("a");
        link.href = badge.target;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.title = `${badge.alt} Open destination in a new tab.`;

        const image = document.createElement("img");
        image.src = badge.image;
        image.alt = badge.alt;
        image.height = 20;
        image.loading = "lazy";
        image.decoding = "async";
        image.fetchPriority = "low";
        image.referrerPolicy = "no-referrer";
        image.addEventListener(
            "error",
            () => {
                const error = document.createElement("span");
                error.className = "badge-error";
                error.textContent = badge.alt;
                link.replaceChildren(error);
            },
            { once: true }
        );
        link.append(image);
        preview.append(link);
    }
}

for (const category of badgeCatalog.categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.append(option);
}

ownerInput.value = state.owner;
repositoryInput.value = state.repo;
branchInput.value = state.branch;
searchInput.value = state.query;
categorySelect.value = badgeCatalog.categories.includes(state.category)
    ? state.category
    : defaultState.category;
state.category = categorySelect.value;
const allowedPageSizes = [
    4,
    6,
    9,
    12,
];
pageSizeSelect.value = String(defaultState.pageSize);
if (allowedPageSizes.includes(state.pageSize)) {
    pageSizeSelect.value = String(state.pageSize);
}
state.pageSize = Number(pageSizeSelect.value);
/** @type {HTMLInputElement} */
const initialStyleInput = queryRequired(
    document,
    `input[name="badge-style"][value="${state.style}"]`
);
initialStyleInput.checked = true;

queryRequired(document, "#layout-total").textContent =
    badgeCatalog.layoutCount.toLocaleString();
queryRequired(document, "#badge-total").textContent =
    badgeCatalog.badgeCount.toLocaleString();
queryRequired(document, "#category-total").textContent =
    badgeCatalog.categoryCount.toLocaleString();

searchInput.addEventListener("input", () => {
    state.query = searchInput.value;
    state.page = 1;
    render();
});
categorySelect.addEventListener("change", () => {
    state.category = categorySelect.value;
    state.page = 1;
    render();
});
pageSizeSelect.addEventListener("change", () => {
    state.pageSize = Number(pageSizeSelect.value);
    state.page = 1;
    render();
});
for (const input of [
    ownerInput,
    repositoryInput,
    branchInput,
]) {
    input.addEventListener("input", scheduleContextRender);
    input.addEventListener("blur", () => {
        input.reportValidity();
    });
}
document.querySelectorAll('input[name="badge-style"]').forEach((input) => {
    input.addEventListener("change", () => {
        if (!(input instanceof HTMLInputElement) || !input.checked) return;
        state.style = /** @type {BadgeStyle} */ (input.value);
        render();
    });
});
resetFiltersButton.addEventListener("click", resetFilters);
resetContextButton.addEventListener("click", resetContext);
queryRequired(document, "[data-reset-filters]").addEventListener(
    "click",
    resetFilters
);
firstPageButton.addEventListener("click", () => {
    setPage(1);
});
previousPageButton.addEventListener("click", () => {
    setPage(state.page - 1);
});
nextPageButton.addEventListener("click", () => {
    setPage(state.page + 1);
});
lastPageButton.addEventListener("click", () => {
    setPage(Math.ceil(getFilteredEntries().length / state.pageSize));
});
document.addEventListener("keydown", (event) => {
    const activeTag = document.activeElement?.tagName ?? "";
    const isTyping = [
        "INPUT",
        "SELECT",
        "TEXTAREA",
    ].includes(activeTag);
    if (!isTyping && event.key === "/") {
        event.preventDefault();
        searchInput.focus();
    }
    if (!isTyping && state.page > 1 && event.key === "[") {
        setPage(state.page - 1);
    }
    if (!isTyping && event.key === "]") {
        const totalPages = Math.ceil(
            getFilteredEntries().length / state.pageSize
        );
        if (state.page < totalPages) setPage(state.page + 1);
    }
});

contextIsValid();
if (location.hash.length > 1) {
    const targetId = decodeURIComponent(location.hash.slice(1));
    const targetIndex = getFilteredEntries().findIndex(
        (entry) => entry.id === targetId
    );
    if (targetIndex !== -1) {
        state.page = Math.floor(targetIndex / state.pageSize) + 1;
    }
}
render();
if (location.hash.length > 1) {
    requestAnimationFrame(() =>
        document.querySelector(location.hash)?.scrollIntoView()
    );
}
