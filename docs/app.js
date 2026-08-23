"use strict";

const catalog = globalThis.BADGE_CATALOG;
if (!catalog || !Array.isArray(catalog.entries)) {
    throw new Error("Badge catalog failed to load.");
}

const repositoryUrl = "https://github.com/Nick2bad4u/github-badge-layouts";
const searchInput = document.querySelector("#search");
const categorySelect = document.querySelector("#category");
const resetButton = document.querySelector("#reset");
const grid = document.querySelector("#layout-grid");
const emptyState = document.querySelector("#empty-state");
const resultCount = document.querySelector("#result-count");
const toast = document.querySelector("#toast");
const valuesByEntry = new Map();
let toastTimer;

const generalExamples = Object.freeze({
    OWNER: "Nick2bad4u",
    REPO: "gh-runs-cleanup",
    BRANCH: "main",
    PACKAGE: "eslint",
    ACTION_SLUG: "checkout",
    UPTIME_ROBOT_MONITOR_KEY: "m780862947-3e92c0970c6c07c494b14c40",
    SNYK_ORG: "snyk-labs",
    SNYK_PROJECT_ID: "goof",
    GITLAB_NAMESPACE: "gitlab-org",
    DOCKER_SCOPE: "library",
    IMAGE: "alpine",
    TAG: "latest",
    ARCH: "amd64",
    MODULE: "Pester",
    CRATE: "serde",
    GEM: "rails",
    VENDOR: "monolog",
    GROUP_ID: "org.apache.commons",
    ARTIFACT_ID: "commons-lang3",
    POD: "Alamofire",
    DISTRIBUTION: "Moose",
    "PUBLISHER.EXTENSION": "ms-vscode.cpptools",
    NAMESPACE: "redhat",
    EXTENSION: "vscode-yaml",
    EXTENSION_ID: "cjpalhdlnbpafiamejdnhcphjbkeiagm",
    ADDON_SLUG: "ublock-origin",
    WINGET_PACKAGE_ID: "Git.Git",
    SCOOP_PACKAGE: "git",
    FORMULA: "git",
    CASK: "firefox",
    SNAP: "code",
    APP_ID: "org.fdroid.fdroid",
    COLLECTIVE: "babel",
    DISCORD_ID_OR_SLUG: "81384788765712384",
    INVITE_CODE: "discord-developers",
    TOOL_NAME: "ESLint plugin",
});

const ecosystemExamples = [
    {
        test: /GitLab/,
        values: { GITLAB_NAMESPACE: "gitlab-org", REPO: "gitlab" },
    },
    {
        test: /JavaScript|npm|TypeScript/,
        values: { OWNER: "eslint", REPO: "eslint", PACKAGE: "eslint" },
    },
    { test: /Docker/, values: { DOCKER_SCOPE: "library", IMAGE: "alpine" } },
    {
        test: /Go module/,
        values: {
            OWNER: "gin-gonic",
            REPO: "gin",
            MODULE: "github.com/gin-gonic/gin",
        },
    },
    {
        test: /PowerShell/,
        values: { OWNER: "pester", REPO: "Pester", MODULE: "Pester" },
    },
    {
        test: /Terraform/,
        values: { OWNER: "hashicorp", REPO: "terraform-provider-random" },
    },
    { test: /Helm/, values: { OWNER: "helm", REPO: "helm" } },
    {
        test: /Python|PyPI/,
        values: { OWNER: "psf", REPO: "requests", PACKAGE: "requests" },
    },
    {
        test: /Rust/,
        values: { OWNER: "serde-rs", REPO: "serde", CRATE: "serde" },
    },
    { test: /Ruby/, values: { OWNER: "rails", REPO: "rails", GEM: "rails" } },
    {
        test: /Packagist|PHP/,
        values: {
            OWNER: "Seldaek",
            REPO: "monolog",
            VENDOR: "monolog",
            PACKAGE: "monolog",
        },
    },
    {
        test: /NuGet|\.NET/,
        values: {
            OWNER: "JamesNK",
            REPO: "Newtonsoft.Json",
            PACKAGE: "Newtonsoft.Json",
        },
    },
    {
        test: /Maven|JVM/,
        values: { OWNER: "apache", REPO: "commons-lang", BRANCH: "master" },
    },
    {
        test: /Dart|Flutter/,
        values: { OWNER: "dart-lang", REPO: "http", PACKAGE: "http" },
    },
    {
        test: /Haskell|Hackage/,
        values: { OWNER: "haskell", REPO: "aeson", PACKAGE: "aeson" },
    },
    {
        test: /CRAN|R package/,
        values: { OWNER: "tidyverse", REPO: "ggplot2", PACKAGE: "ggplot2" },
    },
    {
        test: /LaTeX|CTAN/,
        values: { OWNER: "latex3", REPO: "hyperref", PACKAGE: "hyperref" },
    },
    {
        test: /D package|DUB/,
        values: { OWNER: "vibe-d", REPO: "vibe.d", PACKAGE: "vibe-d" },
    },
    { test: /Elm/, values: { OWNER: "elm", REPO: "json", PACKAGE: "json" } },
    {
        test: /Haxe/,
        values: { OWNER: "HaxeFoundation", REPO: "hxcpp", PACKAGE: "hxcpp" },
    },
    {
        test: /OCaml|opam/,
        values: { OWNER: "ocaml", REPO: "dune", PACKAGE: "dune" },
    },
    { test: /Perl|CPAN/, values: { OWNER: "moose", REPO: "Moose" } },
    {
        test: /Crystal/,
        values: { OWNER: "kemalcr", REPO: "kemal", PACKAGE: "kemal" },
    },
    {
        test: /Swift|Objective-C|CocoaPods/,
        values: { OWNER: "Alamofire", REPO: "Alamofire" },
    },
    {
        test: /Visual Studio|VS Code|Open VSX/,
        values: { OWNER: "microsoft", REPO: "vscode-cpptools" },
    },
    {
        test: /Chrome|Firefox|Edge/,
        values: { OWNER: "gorhill", REPO: "uBlock" },
    },
    { test: /winget|Scoop/, values: { OWNER: "git-for-windows", REPO: "git" } },
    { test: /F-Droid/, values: { OWNER: "f-droid", REPO: "fdroidclient" } },
    { test: /Open Collective/, values: { OWNER: "babel", REPO: "babel" } },
];

function exampleValue(entry, placeholder) {
    const haystack = `${entry.category} ${entry.title}`;
    const ecosystem = ecosystemExamples.find(({ test }) => test.test(haystack));
    return (
        ecosystem?.values[placeholder] ??
        generalExamples[placeholder] ??
        placeholder
    );
}

function normalizeReplacement(value) {
    return value.trim().replaceAll(" ", "%20");
}

function replacePlaceholders(entry, useExamples) {
    const values = valuesByEntry.get(entry.id) ?? {};
    return [...entry.placeholders]
        .sort((left, right) => right.length - left.length)
        .reduce((markdown, placeholder) => {
            const explicitValue = values[placeholder]?.trim();
            const replacement = explicitValue
                ? normalizeReplacement(explicitValue)
                : useExamples
                  ? normalizeReplacement(exampleValue(entry, placeholder))
                  : placeholder;
            return markdown.replaceAll(placeholder, replacement);
        }, entry.template);
}

function parseBadgeLinks(markdown) {
    const links = [];
    const pattern =
        /\[!\[([^\]]*)\]\((https:\/\/[^)\s]+)\)\]\((https:\/\/[^)\s]+)\)/g;
    let match;
    while ((match = pattern.exec(markdown)) !== null) {
        links.push({ alt: match[1], image: match[2], target: match[3] });
    }
    return links;
}

function updatePreview(entry, card) {
    const preview = card.querySelector("[data-preview]");
    preview.replaceChildren();

    for (const badge of parseBadgeLinks(replacePlaceholders(entry, true))) {
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

function updateCode(entry, card) {
    card.querySelector("[data-markdown]").textContent = replacePlaceholders(
        entry,
        false
    );
}

function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("visible");
    toastTimer = window.setTimeout(
        () => toast.classList.remove("visible"),
        2200
    );
}

async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) {
        throw new Error("The browser denied clipboard access.");
    }
}

function buildPlaceholderEditor(entry, card) {
    if (entry.placeholders.length === 0) {
        return null;
    }

    const details = document.createElement("details");
    details.className = "customizer";
    const summary = document.createElement("summary");
    summary.textContent = `Customize placeholders (${entry.placeholders.length})`;
    details.append(summary);

    const fields = document.createElement("div");
    fields.className = "placeholder-grid";
    const values = valuesByEntry.get(entry.id) ?? {};

    for (const placeholder of entry.placeholders) {
        const wrapper = document.createElement("div");
        wrapper.className = "placeholder-field";
        const inputId = `${entry.id}-${placeholder.replace(/[^A-Za-z0-9]+/g, "-")}`;
        const label = document.createElement("label");
        label.htmlFor = inputId;
        label.textContent = placeholder;
        label.title = placeholder;
        const input = document.createElement("input");
        input.id = inputId;
        input.type = "text";
        input.value = values[placeholder] ?? "";
        input.placeholder = exampleValue(entry, placeholder);
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
    resetFields.textContent = "Clear this layout";
    resetFields.addEventListener("click", () => {
        valuesByEntry.delete(entry.id);
        fields.querySelectorAll("input").forEach((input) => {
            input.value = "";
        });
        updatePreview(entry, card);
        updateCode(entry, card);
        showToast(`Cleared ${entry.title}.`);
    });

    details.append(fields, resetFields);
    return details;
}

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

    const previewLabel = document.createElement("p");
    previewLabel.className = "preview-label";
    previewLabel.textContent =
        entry.placeholders.length > 0 ? "Example preview" : "Live preview";
    const preview = document.createElement("div");
    preview.className = "badge-preview";
    preview.dataset.preview = "";
    card.append(previewLabel, preview);

    const editor = buildPlaceholderEditor(entry, card);
    if (editor) {
        card.append(editor);
    }

    const markdownWrap = document.createElement("div");
    markdownWrap.className = "markdown-wrap";
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.dataset.markdown = "";
    pre.append(code);
    markdownWrap.append(pre);
    card.append(markdownWrap);

    const actions = document.createElement("div");
    actions.className = "card-actions";
    const copyButton = document.createElement("button");
    copyButton.className = "copy-button";
    copyButton.type = "button";
    copyButton.textContent = "Copy Markdown";
    copyButton.addEventListener("click", async () => {
        try {
            await copyText(replacePlaceholders(entry, false));
            copyButton.textContent = "Copied!";
            showToast(`Copied ${entry.title}.`);
            window.setTimeout(() => {
                copyButton.textContent = "Copy Markdown";
            }, 1600);
        } catch (error) {
            showToast(
                error instanceof Error
                    ? error.message
                    : "Could not copy Markdown."
            );
        }
    });
    const count = document.createElement("span");
    count.className = "badge-count";
    count.textContent = `${entry.badgeCount} badge${entry.badgeCount === 1 ? "" : "s"}`;
    actions.append(copyButton, count);
    card.append(actions);

    updatePreview(entry, card);
    updateCode(entry, card);
    return card;
}

function getFilteredEntries() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    const selectedCategory = categorySelect.value;
    return catalog.entries.filter((entry) => {
        const inCategory =
            selectedCategory === "all" || entry.category === selectedCategory;
        if (!inCategory) return false;
        if (!query) return true;
        return `${entry.title} ${entry.category} ${entry.description} ${entry.template}`
            .toLocaleLowerCase()
            .includes(query);
    });
}

function render() {
    const entries = getFilteredEntries();
    grid.replaceChildren(...entries.map(buildCard));
    emptyState.hidden = entries.length > 0;
    grid.hidden = entries.length === 0;
    resultCount.textContent = `Showing ${entries.length} of ${catalog.layoutCount} layouts`;
}

function resetFilters() {
    searchInput.value = "";
    categorySelect.value = "all";
    render();
    searchInput.focus();
}

for (const category of catalog.categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.append(option);
}

document.querySelector("#layout-total").textContent =
    catalog.layoutCount.toLocaleString();
document.querySelector("#badge-total").textContent =
    catalog.badgeCount.toLocaleString();
document.querySelector("#category-total").textContent =
    catalog.categoryCount.toLocaleString();
searchInput.addEventListener("input", render);
categorySelect.addEventListener("change", render);
resetButton.addEventListener("click", resetFilters);
document
    .querySelector("[data-reset-filters]")
    .addEventListener("click", resetFilters);
document.addEventListener("keydown", (event) => {
    const activeTag = document.activeElement?.tagName;
    if (
        event.key === "/" &&
        ![
            "INPUT",
            "SELECT",
            "TEXTAREA",
        ].includes(activeTag)
    ) {
        event.preventDefault();
        searchInput.focus();
    }
});

render();

if (window.location.hash) {
    window.requestAnimationFrame(() =>
        document.querySelector(window.location.hash)?.scrollIntoView()
    );
}
