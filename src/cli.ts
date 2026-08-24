import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import * as path from "node:path";

import type {
    BadgeCatalogEntry,
    PlaceholderValues,
    RenderOptions,
} from "./types.js";

import {
    badgeCatalog,
    convertBadgeStyle,
    getLayoutOrThrow,
    inspectBadgeMarkdown,
    listLayouts,
    parseBadgeStyle,
    renderLayout,
    upsertReadmeBadgeBlock,
} from "./index.js";
import {
    loadLiveBadgeTitles,
    parseTerminalBadges,
    type TerminalBadge,
} from "./preview.js";
import {
    type ColorMode,
    createTerminalTheme,
    formatTable,
    type TerminalTheme,
} from "./terminal.js";

interface GitContext {
    readonly branch: string;
    readonly owner?: string;
    readonly repo?: string;
    readonly source: "fallback" | "git";
}

interface ParsedArguments {
    readonly booleans: ReadonlySet<string>;
    readonly command: string;
    readonly options: ReadonlyMap<string, readonly string[]>;
    readonly positionals: readonly string[];
}

interface ParsedLongOption {
    readonly kind: "boolean" | "value";
    readonly name: string;
    readonly shouldConsumeNextToken: boolean;
    readonly value?: string;
}

type PreviewRenderer = "ansi" | "glow";

const commands = [
    "categories",
    "context",
    "convert",
    "help",
    "inspect",
    "languages",
    "list",
    "preview",
    "readme",
    "render",
    "search",
    "show",
    "version",
] as const;
const commandSet: ReadonlySet<string> = new Set(commands);
const unresolvedOptionName = "allow-unresolved";

const booleanOptions = new Set([
    "copy",
    "glow",
    "help",
    "json",
    "live",
    unresolvedOptionName,
    "version",
    "write",
]);
const valueOptions = new Set([
    "branch",
    "category",
    "color",
    "file",
    "input",
    "language",
    "limit",
    "output",
    "owner",
    "query",
    "renderer",
    "repo",
    "set",
    "style",
    "width",
]);
const commonOptions = new Set([
    "color",
    "help",
    "json",
    "version",
]);
const commandOptions: Readonly<Record<string, ReadonlySet<string>>> = {
    categories: commonOptions,
    context: commonOptions,
    convert: withCommon("copy", "input", "output", "style"),
    help: commonOptions,
    inspect: withCommon("input"),
    languages: commonOptions,
    list: withCommon("category", "language", "limit", "query"),
    preview: withCommon(
        unresolvedOptionName,
        "branch",
        "glow",
        "live",
        "owner",
        "renderer",
        "repo",
        "set",
        "style",
        "width"
    ),
    readme: withCommon(
        unresolvedOptionName,
        "branch",
        "file",
        "owner",
        "repo",
        "set",
        "style",
        "write"
    ),
    render: withCommon(
        unresolvedOptionName,
        "branch",
        "copy",
        "output",
        "owner",
        "repo",
        "set",
        "style"
    ),
    search: withCommon("category", "language", "limit", "query"),
    show: commonOptions,
    version: commonOptions,
};

const helpSections: Readonly<Record<string, string>> = {
    categories: `Usage: badge-layouts categories [--json]\n\nList project/ecosystem categories with layout counts.`,
    context: `Usage: badge-layouts context [--json]\n\nShow repository coordinates detected from the current Git checkout.`,
    convert: `Usage: badge-layouts convert [markdown] --style <flat|classic> [options]\n\nOptions:\n  --input <file|->   Read Markdown from a file or stdin\n  --output <file>    Write converted Markdown to a file\n  --copy             Copy converted Markdown`,
    inspect: `Usage: badge-layouts inspect [markdown] [--input <file|->] [--json]\n\nCount badge styles and unresolved catalog placeholders.`,
    languages: `Usage: badge-layouts languages [--json]\n\nList language facets with layout counts. Use --language with list/search.`,
    list: `Usage: badge-layouts list [options]\n\nOptions:\n  --query <text>       Search all catalog metadata\n  --category <name>    Require an exact category\n  --language <name>    Require an exact language facet\n  --limit <count>      Limit returned layouts\n  --json               Emit catalog records as JSON`,
    preview: `Usage: badge-layouts preview <layout> [options]\n\nOptions:\n  --renderer <ansi|glow>  Terminal renderer (default: ansi)\n  --glow                  Shortcut for --renderer glow\n  --live                  Fetch live SVG titles for ANSI badges\n  --width <columns>       Glow wrapping width\n  --owner/--repo/--branch Repository coordinates\n  --set NAME=VALUE        Set an additional placeholder\n  --style <flat|classic>  Select the Badgen host`,
    readme: `Usage: badge-layouts readme <layout> [options]\n\nPreview a managed README badge block. Add --write only after review.\n\nOptions:\n  --file <path>       README path (default: README.md)\n  --write             Insert or replace the managed block\n  --owner/--repo/--branch, --set, --style`,
    render: `Usage: badge-layouts render <layout> [options]\n\nRender copy-ready badge Markdown. Repository coordinates are detected from Git when possible.\n\nOptions:\n  --owner/--repo/--branch Repository coordinates\n  --set NAME=VALUE        Set an additional placeholder; repeatable\n  --style <flat|classic>  Select the Badgen host\n  --allow-unresolved      Preserve missing placeholders\n  --output <file>         Write Markdown to a file\n  --copy                  Copy Markdown`,
    search: `Usage: badge-layouts search <query> [options]\n\nSearch titles, IDs, categories, languages, descriptions, placeholders, and Markdown.\nUse --category, --language, --limit, or --json to narrow the result.`,
    show: `Usage: badge-layouts show <layout> [--json]\n\nShow metadata and the unresolved Markdown template.`,
};

/** Run the CLI and return a process-compatible exit code. */
export async function runCli(cliArguments: readonly string[]): Promise<number> {
    try {
        const parsed = parseArguments(cliArguments);
        const theme = createTerminalTheme(
            parseColorMode(optionValue(parsed, "color") ?? "auto"),
            process.stdout.isTTY
        );
        await runCommand(parsed, theme);
        return 0;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const errorTheme = createTerminalTheme(
            rawColorMode(cliArguments),
            process.stderr.isTTY
        );
        process.stderr.write(
            `${errorTheme.danger("Error:")} ${message}\n${errorTheme.dim("Run `badge-layouts --help` for usage.")}\n`
        );
        return 1;
    }
}

function buildGlowPreview(
    layout: BadgeCatalogEntry,
    badges: readonly TerminalBadge[]
): string {
    const lines = [
        `# ${escapeMarkdownText(layout.title)}`,
        "",
        `> ${escapeMarkdownText(layout.category)} · ${escapeMarkdownText(layout.languages.join(", "))} · ${layout.badgeCount} badges`,
    ];
    if (layout.description.length > 0) {
        lines.push("", layout.description);
    }
    lines.push("", "## Badges", "");
    for (const badge of badges) {
        const label = escapeMarkdownText(
            (badge.title ?? badge.alt).replace(/\.$/v, "")
        );
        const warning =
            badge.error === undefined
                ? ""
                : ` — warning: ${escapeMarkdownText(badge.error)}`;
        lines.push(`- [${label}](${badge.target})${warning}`);
    }
    return `${lines.join("\n")}\n`;
}

function clipboardCandidates(): readonly {
    readonly arguments: readonly string[];
    readonly command: string;
}[] {
    if (process.platform === "win32") {
        return [{ arguments: [], command: "clip.exe" }];
    }
    if (process.platform === "darwin") {
        return [{ arguments: [], command: "pbcopy" }];
    }
    return [
        { arguments: [], command: "wl-copy" },
        { arguments: ["-selection", "clipboard"], command: "xclip" },
        { arguments: ["--clipboard", "--input"], command: "xsel" },
    ];
}

function copyToClipboard(text: string): void {
    for (const candidate of clipboardCandidates()) {
        const result = spawnSync(candidate.command, candidate.arguments, {
            encoding: "utf8",
            input: text,
            stdio: [
                "pipe",
                "ignore",
                "ignore",
            ],
        });
        if (result.status === 0) return;
    }
    throw new Error(
        "No supported clipboard command was available. Pipe the output to your clipboard tool instead."
    );
}

function detectGitContext(): GitContext {
    const remote = gitOutput([
        "config",
        "--get",
        "remote.origin.url",
    ]);
    const coordinates =
        remote === undefined ? undefined : parseGitHubRemote(remote);
    const remoteHead = gitOutput([
        "symbolic-ref",
        "--quiet",
        "--short",
        "refs/remotes/origin/HEAD",
    ]);
    const currentBranch = gitOutput(["branch", "--show-current"]);
    const branch =
        remoteHead?.replace(/^origin\//v, "") ?? currentBranch ?? "main";
    return coordinates === undefined
        ? { branch, source: "fallback" }
        : { ...coordinates, branch, source: "git" };
}

function editDistance(left: string, right: string): number {
    const previous = Array.from(
        { length: right.length + 1 },
        (_, index) => index
    );
    for (let leftIndex = 0; leftIndex < left.length; leftIndex += 1) {
        const leftCharacter = left.charAt(leftIndex);
        const current = [leftIndex + 1];
        for (let rightIndex = 0; rightIndex < right.length; rightIndex += 1) {
            const rightCharacter = right.charAt(rightIndex);
            current.push(
                Math.min(
                    (current[rightIndex] ?? 0) + 1,
                    (previous[rightIndex + 1] ?? 0) + 1,
                    (previous[rightIndex] ?? 0) +
                        (leftCharacter === rightCharacter ? 0 : 1)
                )
            );
        }
        previous.splice(0, previous.length, ...current);
    }
    let finalDistance = right.length;
    for (const distance of previous) finalDistance = distance;
    return finalDistance;
}

function ensureNoOutputFile(parsed: ParsedArguments): void {
    if (optionValue(parsed, "output") !== undefined) {
        throw new Error(
            "--output cannot be combined with --json; redirect stdout instead."
        );
    }
}

function escapeMarkdownText(value: string): string {
    return value
        .replaceAll("\\", "\\\\")
        .replaceAll("[", String.raw`\[`)
        .replaceAll("]", String.raw`\]`);
}

function gitOutput(commandArguments: readonly string[]): string | undefined {
    // eslint-disable-next-line sonarjs/no-os-command-from-path -- Git must resolve from the user's configured CLI PATH.
    const result = spawnSync("git", commandArguments, {
        encoding: "utf8",
        stdio: [
            "ignore",
            "pipe",
            "ignore",
        ],
    });
    const output = result.status === 0 ? result.stdout.trim() : "";
    return output.length > 0 ? output : undefined;
}

function isPlaceholderName(name: string): boolean {
    const first = name.charAt(0);
    if (first.length === 0 || first < "A" || first > "Z") return false;
    for (let index = 1; index < name.length; index += 1) {
        const character = name.charAt(index);
        const isLetter = character >= "A" && character <= "Z";
        const isNumber = character >= "0" && character <= "9";
        if (!isLetter && !isNumber && !"-._".includes(character)) return false;
    }
    return true;
}

function nearestCommand(command: string): string | undefined {
    const candidates = commands
        .map((candidate) => ({
            candidate,
            distance: editDistance(command, candidate),
        }))
        .toSorted((left, right) => left.distance - right.distance);
    const nearest = candidates[0];
    return nearest !== undefined && nearest.distance <= 3
        ? nearest.candidate
        : undefined;
}

function normalizeCommand(command: string): string {
    if (command === "find") return "search";
    if (command === "ls") return "list";
    if (command === "view") return "preview";
    return command;
}

function optionValue(
    parsed: ParsedArguments,
    name: string
): string | undefined {
    return parsed.options.get(name)?.at(-1);
}

async function packageVersion(): Promise<string> {
    const parsedManifest: unknown = JSON.parse(
        await readFile(new URL("../../package.json", import.meta.url), "utf8")
    );
    if (typeof parsedManifest !== "object" || parsedManifest === null) {
        throw new TypeError("package.json must contain a JSON object.");
    }
    const version = (parsedManifest as { readonly version?: unknown }).version;
    if (typeof version !== "string") {
        throw new TypeError("package.json does not declare a string version.");
    }
    return version;
}

function parseArguments(cliArguments: readonly string[]): ParsedArguments {
    const normalizedArguments = cliArguments.map((argument) => {
        if (argument === "-h") return "--help";
        if (argument === "-j") return "--json";
        if (argument === "-v") return "--version";
        if (argument === "--no-color") return "--color=never";
        return argument;
    });
    const [first = "help", ...rest] = normalizedArguments;
    const command = first.startsWith("-") ? "help" : normalizeCommand(first);
    const tokens = first.startsWith("-") ? normalizedArguments : rest;
    const booleans = new Set<string>();
    const options = new Map<string, string[]>();
    const positionals: string[] = [];
    let isOptionsEnded = false;

    for (let index = 0; index < tokens.length; index += 1) {
        const token = tokens[index] ?? "";
        if (token === "--" && !isOptionsEnded) {
            isOptionsEnded = true;
        } else if (!isOptionsEnded && token.startsWith("--")) {
            const parsedOption = parseLongOption(token, tokens[index + 1]);
            if (parsedOption.kind === "boolean") {
                booleans.add(parsedOption.name);
            } else {
                const values = options.get(parsedOption.name) ?? [];
                values.push(parsedOption.value ?? "");
                options.set(parsedOption.name, values);
            }
            if (parsedOption.shouldConsumeNextToken) index += 1;
        } else {
            positionals.push(token);
        }
    }
    return { booleans, command, options, positionals };
}

function parseColorMode(value: string): ColorMode {
    switch (value) {
        case "always":
        case "auto":
        case "never": {
            return value;
        }
        default: {
            throw new Error(
                `--color must be always, auto, or never; received: ${value}`
            );
        }
    }
}

function parseGitHubRemote(
    remote: string
): undefined | { readonly owner: string; readonly repo: string } {
    const match =
        /github\.com[\/:](?<owner>[^\s\/:]+)\/(?<repo>[^\s\/]+?)(?:\.git)?$/iv.exec(
            remote.trim()
        );
    const owner = match?.groups?.["owner"];
    const repo = match?.groups?.["repo"];
    return owner === undefined || repo === undefined
        ? undefined
        : { owner, repo };
}

function parseLimit(value: string | undefined): number | undefined {
    if (value === undefined) return undefined;
    const limit = Number(value);
    if (!Number.isSafeInteger(limit) || limit < 1) {
        throw new Error(
            `--limit must be a positive integer, received: ${value}`
        );
    }
    return limit;
}

function parseLongOption(
    token: string,
    nextToken: string | undefined
): ParsedLongOption {
    const separator = token.indexOf("=");
    const name = token.slice(2, separator === -1 ? token.length : separator);
    if (booleanOptions.has(name)) {
        if (separator !== -1) {
            throw new Error(
                `Boolean option --${name} does not accept a value.`
            );
        }
        return { kind: "boolean", name, shouldConsumeNextToken: false };
    }
    if (!valueOptions.has(name)) {
        throw new Error(`Unknown option: --${name}.`);
    }
    const shouldConsumeNextToken = separator === -1;
    const value = shouldConsumeNextToken
        ? nextToken
        : token.slice(separator + 1);
    if (value === undefined || value.startsWith("--")) {
        throw new Error(`Option --${name} requires a value.`);
    }
    return { kind: "value", name, shouldConsumeNextToken, value };
}

function parsePlaceholderValues(values: readonly string[]): PlaceholderValues {
    const placeholders: Record<string, string> = {};
    for (const assignment of values) {
        const separator = assignment.indexOf("=");
        if (separator <= 0) {
            throw new Error(
                `Invalid --set value: ${assignment}. Expected NAME=VALUE.`
            );
        }
        const name = assignment.slice(0, separator).trim().toUpperCase();
        if (!isPlaceholderName(name)) {
            throw new Error(`Invalid placeholder name: ${name}`);
        }
        placeholders[name] = assignment.slice(separator + 1);
    }
    return placeholders;
}

function parsePreviewRenderer(value: string): PreviewRenderer {
    if (value === "ansi" || value === "glow") return value;
    throw new Error(`--renderer must be ansi or glow; received: ${value}`);
}

function parseWidth(value: string | undefined): number {
    if (value === undefined) {
        return Math.max(
            40,
            process.stdout.columns > 0 ? process.stdout.columns : 100
        );
    }
    const width = Number(value);
    if (!Number.isSafeInteger(width) || width < 20 || width > 500) {
        throw new Error(
            `--width must be an integer from 20 to 500; received: ${value}`
        );
    }
    return width;
}

function rawColorMode(cliArguments: readonly string[]): ColorMode {
    const argumentSet = new Set(cliArguments);
    if (argumentSet.has("--no-color")) {
        return "never";
    }
    const colorIndex = cliArguments.findIndex(
        (argument) => argument === "--color" || argument.startsWith("--color=")
    );
    if (colorIndex === -1) return "auto";
    const token = cliArguments[colorIndex] ?? "";
    const value = token.includes("=")
        ? token.slice(token.indexOf("=") + 1)
        : cliArguments[colorIndex + 1];
    if (value === "always") return "always";
    return value === "never" ? "never" : "auto";
}

async function readMarkdownInput(parsed: ParsedArguments): Promise<string> {
    const input = optionValue(parsed, "input");
    if (input !== "-" && input !== undefined && input.length > 0) {
        return readFile(path.resolve(input), "utf8");
    }
    if (parsed.positionals.length > 0) return parsed.positionals.join(" ");
    if (input === "-" || !process.stdin.isTTY) {
        const chunks: Buffer[] = [];
        for await (const chunk of process.stdin) {
            chunks.push(
                Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk))
            );
        }
        return Buffer.concat(chunks).toString("utf8");
    }
    throw new Error(
        "Provide Markdown, --input <file>, or pipe Markdown on stdin."
    );
}

function requiredLayout(
    parsed: ParsedArguments,
    command: string
): BadgeCatalogEntry {
    const identifier = parsed.positionals[0] ?? "";
    if (identifier.length === 0) {
        throw new Error(`${command} requires a layout ID or title.`);
    }
    return getLayoutOrThrow(identifier);
}

function resolveRenderOptions(parsed: ParsedArguments): RenderOptions {
    const context = detectGitContext();
    return {
        allowUnresolved: parsed.booleans.has(unresolvedOptionName),
        branch: optionValue(parsed, "branch") ?? context.branch,
        ...((optionValue(parsed, "owner") ?? context.owner) !== undefined && {
            owner: optionValue(parsed, "owner") ?? context.owner,
        }),
        placeholders: parsePlaceholderValues(parsed.options.get("set") ?? []),
        ...((optionValue(parsed, "repo") ?? context.repo) !== undefined && {
            repo: optionValue(parsed, "repo") ?? context.repo,
        }),
        style: parseBadgeStyle(optionValue(parsed, "style") ?? "flat"),
    };
}

async function runCommand(
    parsed: ParsedArguments,
    theme: TerminalTheme
): Promise<void> {
    if (parsed.booleans.has("version") || parsed.command === "version") {
        process.stdout.write(`${await packageVersion()}\n`);
        return;
    }
    if (parsed.booleans.has("help") || parsed.command === "help") {
        writeHelp(parsed, theme);
        return;
    }
    if (!commandSet.has(parsed.command)) {
        const suggestion = nearestCommand(parsed.command);
        const suggestionText =
            suggestion === undefined ? "" : ` Did you mean ${suggestion}?`;
        throw new Error(`Unknown command: ${parsed.command}.${suggestionText}`);
    }
    validateCommandOptions(parsed);

    switch (parsed.command) {
        case "categories": {
            writeFacets(
                "Categories",
                badgeCatalog.categories,
                "category",
                parsed,
                theme
            );
            return;
        }
        case "context": {
            writeContext(parsed, theme);
            return;
        }
        case "convert": {
            await runConvertCommand(parsed, theme);
            return;
        }
        case "inspect": {
            await runInspectCommand(parsed, theme);
            return;
        }
        case "languages": {
            writeFacets(
                "Languages",
                badgeCatalog.languages,
                "language",
                parsed,
                theme
            );
            return;
        }
        case "list":
        case "search": {
            runListCommand(parsed, theme);
            return;
        }
        case "preview": {
            await runPreviewCommand(parsed, theme);
            return;
        }
        case "readme":
        case "render": {
            await runRenderCommand(parsed, theme);
            return;
        }
        case "show": {
            runShowCommand(parsed, theme);
            return;
        }
        default: {
            throw new Error(`Command is not implemented: ${parsed.command}.`);
        }
    }
}

async function runConvertCommand(
    parsed: ParsedArguments,
    theme: TerminalTheme
): Promise<void> {
    const markdown = await readMarkdownInput(parsed);
    const style = parseBadgeStyle(optionValue(parsed, "style") ?? "flat");
    const converted = convertBadgeStyle(markdown, style);
    if (parsed.booleans.has("copy")) {
        copyToClipboard(converted);
        process.stderr.write(
            `${theme.success("✓")} Copied converted Markdown.\n`
        );
    }
    if (parsed.booleans.has("json")) {
        ensureNoOutputFile(parsed);
        writeJson({ markdown: converted, style });
        return;
    }
    await writeTextOutput(converted, parsed, theme);
}

function runGlow(markdown: string, width: number): void {
    /* eslint-disable sonarjs/no-os-command-from-path -- Glow is an optional user-installed CLI discovered through PATH. */
    const result = spawnSync(
        "glow",
        [
            "-w",
            String(width),
            "-",
        ],
        {
            encoding: "utf8",
            input: markdown,
            stdio: [
                "pipe",
                "pipe",
                "pipe",
            ],
        }
    );
    /* eslint-enable sonarjs/no-os-command-from-path -- Re-enable after the scoped optional CLI spawn. */
    if (result.error !== undefined) {
        const install =
            process.platform === "win32"
                ? "Install it with `winget install charmbracelet.glow`, or use `--renderer ansi`."
                : "Install Glow from https://github.com/charmbracelet/glow, or use `--renderer ansi`.";
        throw new Error(`Glow is not available on PATH. ${install}`);
    }
    if (result.status !== 0) {
        const standardError = result.stderr.trim();
        const failureDetail =
            standardError.length > 0
                ? standardError
                : `exit ${result.status ?? "unknown"}`;
        throw new Error(`Glow failed: ${failureDetail}`);
    }
    process.stdout.write(
        result.stdout.endsWith("\n") ? result.stdout : `${result.stdout}\n`
    );
}

async function runInspectCommand(
    parsed: ParsedArguments,
    theme: TerminalTheme
): Promise<void> {
    const inspection = inspectBadgeMarkdown(await readMarkdownInput(parsed));
    if (parsed.booleans.has("json")) {
        writeJson(inspection);
        return;
    }
    const rows = [
        ["All badges", String(inspection.badgeCount)],
        ["Flat Badgen", String(inspection.flatBadgeCount)],
        ["Classic Badgen", String(inspection.classicBadgeCount)],
        ["Other images", String(inspection.unknownBadgeCount)],
        [
            "Placeholders",
            inspection.placeholders.length > 0
                ? inspection.placeholders.join(", ")
                : "none",
        ],
    ];
    process.stdout.write(
        `${theme.heading("Markdown inspection")}\n${formatTable(
            ["METRIC", "VALUE"],
            rows,
            { theme }
        )}\n`
    );
}

function runListCommand(parsed: ParsedArguments, theme: TerminalTheme): void {
    const positionalQuery =
        parsed.command === "search" ? parsed.positionals.join(" ") : undefined;
    const query =
        positionalQuery !== undefined && positionalQuery.length > 0
            ? positionalQuery
            : optionValue(parsed, "query");
    if (
        parsed.command === "search" &&
        (query === undefined || query.length === 0)
    ) {
        throw new Error("search requires a query.");
    }
    const limit = parseLimit(optionValue(parsed, "limit"));
    const category = optionValue(parsed, "category");
    const language = optionValue(parsed, "language");
    const allMatches = listLayouts({
        ...(category !== undefined && category.length > 0 && { category }),
        ...(language !== undefined && language.length > 0 && { language }),
        ...(query !== undefined && query.length > 0 && { query }),
    });
    const layouts = allMatches.slice(0, limit);
    if (parsed.booleans.has("json")) {
        writeJson(layouts);
        return;
    }
    if (layouts[0] === undefined) {
        process.stdout.write(
            `${theme.warning("No matching layouts.")} Try a broader query or run ${theme.accent("badge-layouts languages")} to inspect facets.\n`
        );
        return;
    }
    const rows = layouts.map((entry) => [
        entry.id,
        entry.title,
        entry.languages.join(", "),
        entry.category,
        String(entry.badgeCount),
    ]);
    const shown =
        layouts.length === allMatches.length
            ? `${layouts.length} ${layouts.length === 1 ? "layout" : "layouts"}`
            : `${layouts.length} of ${allMatches.length} layouts`;
    const countLabel = theme.dim(`(${shown})`);
    process.stdout.write(
        `${theme.heading("Badge layouts")} ${countLabel}\n${formatTable(
            [
                "ID",
                "TITLE",
                "LANGUAGES",
                "CATEGORY",
                "#",
            ],
            rows,
            { rightAligned: new Set([4]), theme }
        )}\n${theme.dim("Tip: run `badge-layouts preview <id>` for a terminal preview.")}\n`
    );
}

async function runPreviewCommand(
    parsed: ParsedArguments,
    theme: TerminalTheme
): Promise<void> {
    const layout = requiredLayout(parsed, "preview");
    const options = { ...resolveRenderOptions(parsed), allowUnresolved: true };
    const markdown = renderLayout(layout, options);
    const renderer = parsePreviewRenderer(
        parsed.booleans.has("glow")
            ? "glow"
            : (optionValue(parsed, "renderer") ?? "ansi")
    );
    let badges = parseTerminalBadges(markdown);
    if (parsed.booleans.has("live")) {
        badges = await loadLiveBadgeTitles(badges);
    }
    if (renderer === "glow") {
        if (parsed.booleans.has("json")) {
            throw new Error(
                "--json cannot be combined with the interactive Glow renderer."
            );
        }
        runGlow(
            buildGlowPreview(layout, badges),
            parseWidth(optionValue(parsed, "width"))
        );
        return;
    }
    if (parsed.booleans.has("json")) {
        writeJson({ badges, layout, markdown });
        return;
    }
    const metadata = `${layout.category} • ${layout.languages.join(", ")} • ${layout.badgeCount} badges`;
    const lines = [theme.heading(layout.title), theme.dim(metadata)];
    if (layout.description.length > 0) lines.push(layout.description);
    lines.push("");
    for (const badge of badges) {
        const label = (badge.title ?? badge.alt).replace(/\.$/v, "");
        const rendered = theme.badge(
            label,
            badge.error === undefined ? badge.color : "B91C1C"
        );
        const status =
            badge.error === undefined
                ? theme.muted(badge.service)
                : theme.danger(`⚠ ${badge.error}`);
        lines.push(`  ${rendered} ${status}`);
    }
    lines.push(
        "",
        parsed.booleans.has("live")
            ? theme.dim(
                  "Live values come from Badgen SVG titles and may change between runs."
              )
            : theme.dim(
                  "Offline labels shown. Add --live for current SVG values or --glow for Markdown rendering."
              )
    );
    process.stdout.write(`${lines.join("\n")}\n`);
}

async function runRenderCommand(
    parsed: ParsedArguments,
    theme: TerminalTheme
): Promise<void> {
    const layout = requiredLayout(parsed, parsed.command);
    const markdown = renderLayout(layout, resolveRenderOptions(parsed));
    if (parsed.command === "render") {
        if (parsed.booleans.has("copy")) {
            copyToClipboard(markdown);
            process.stderr.write(
                `${theme.success("✓")} Copied ${layout.title}.\n`
            );
        }
        if (parsed.booleans.has("json")) {
            ensureNoOutputFile(parsed);
            writeJson({ layout: layout.id, markdown });
        } else {
            await writeTextOutput(markdown, parsed, theme);
        }
        return;
    }

    const readmePath = path.resolve(optionValue(parsed, "file") ?? "README.md");
    const block = `<!-- github-badge-layouts:start -->\n${markdown}\n<!-- github-badge-layouts:end -->`;
    if (!parsed.booleans.has("write")) {
        if (parsed.booleans.has("json")) {
            writeJson({ block, file: readmePath, layout: layout.id });
        } else {
            process.stdout.write(`${block}\n`);
        }
        return;
    }
    const current = await readFile(readmePath, "utf8");
    await writeFile(
        readmePath,
        upsertReadmeBadgeBlock(current, markdown),
        "utf8"
    );
    if (parsed.booleans.has("json")) {
        writeJson({ file: readmePath, layout: layout.id, written: true });
    } else {
        process.stderr.write(`${theme.success("✓")} Updated ${readmePath}\n`);
    }
}

function runShowCommand(parsed: ParsedArguments, theme: TerminalTheme): void {
    const layout = requiredLayout(parsed, "show");
    if (parsed.booleans.has("json")) {
        writeJson(layout);
        return;
    }
    const metadata = [
        ["ID", layout.id],
        ["Category", layout.category],
        ["Languages", layout.languages.join(", ")],
        ["Badges", String(layout.badgeCount)],
        ["Placeholders", layout.placeholders.join(", ") || "none"],
        ["Source", `library.md:${layout.sourceLine}`],
    ];
    const output = [
        theme.heading(layout.title),
        formatTable(["FIELD", "VALUE"], metadata, { theme }),
        ...(layout.description.length > 0 ? ["", layout.description] : []),
        "",
        theme.bold("Template"),
        layout.template,
        "",
        theme.dim(`Preview with: badge-layouts preview ${layout.id}`),
    ];
    process.stdout.write(`${output.join("\n")}\n`);
}

function validateCommandOptions(parsed: ParsedArguments): void {
    const allowed = commandOptions[parsed.command];
    if (allowed === undefined) return;
    const supplied = [...parsed.booleans, ...parsed.options.keys()];
    const unsupported = supplied.find((option) => !allowed.has(option));
    if (unsupported !== undefined) {
        throw new Error(
            `Command ${parsed.command} does not accept --${unsupported}.`
        );
    }
}

function withCommon(...options: readonly string[]): ReadonlySet<string> {
    const combined = new Set(commonOptions);
    for (const option of options) combined.add(option);
    return combined;
}

function writeContext(parsed: ParsedArguments, theme: TerminalTheme): void {
    const context = detectGitContext();
    if (parsed.booleans.has("json")) {
        writeJson(context);
        return;
    }
    const rows = [
        ["Owner", context.owner ?? "not detected"],
        ["Repository", context.repo ?? "not detected"],
        ["Branch", context.branch],
        ["Source", context.source === "git" ? "Git remote.origin" : "fallback"],
    ];
    process.stdout.write(
        `${theme.heading("Repository context")}\n${formatTable(
            ["FIELD", "VALUE"],
            rows,
            { theme }
        )}\n`
    );
}

function writeFacets(
    heading: string,
    values: readonly string[],
    kind: "category" | "language",
    parsed: ParsedArguments,
    theme: TerminalTheme
): void {
    if (parsed.booleans.has("json")) {
        writeJson(values);
        return;
    }
    const rows = values.map((value) => [
        value,
        String(listLayouts({ [kind]: value }).length),
    ]);
    const countLabel = theme.dim(`(${values.length})`);
    process.stdout.write(
        `${theme.heading(heading)} ${countLabel}\n${formatTable(
            [kind.toUpperCase(), "LAYOUTS"],
            rows,
            { rightAligned: new Set([1]), theme }
        )}\n`
    );
}

function writeHelp(parsed: ParsedArguments, theme: TerminalTheme): void {
    const requestedCommand =
        parsed.command === "help" ? parsed.positionals[0] : parsed.command;
    if (requestedCommand !== undefined && requestedCommand !== "help") {
        const section = helpSections[normalizeCommand(requestedCommand)] ?? "";
        if (section.length === 0) {
            throw new Error(
                `No help is available for unknown command: ${requestedCommand}.`
            );
        }
        process.stdout.write(
            `${theme.heading("github-badge-layouts")}\n\n${section}\n`
        );
        return;
    }
    const output = `${theme.heading("github-badge-layouts")} ${theme.dim("— discover, preview, and maintain README badges")}

${theme.bold("Usage")}
  badge-layouts <command> [arguments] [options]

${theme.bold("Discover")}
  list                  Browse layouts in a readable table
  search <query>        Search all catalog metadata
  categories            List project/ecosystem categories
  languages             List filterable language facets
  show <layout>         Inspect metadata and raw Markdown

${theme.bold("Create and preview")}
  preview <layout>      Render terminal badges; supports --live and --glow
  render <layout>       Produce copy-ready Markdown
  readme <layout>       Preview or write a managed README block
  context               Show Git-detected repository coordinates

${theme.bold("Markdown tools")}
  convert [markdown]    Switch between flat and classic Badgen URLs
  inspect [markdown]    Count badges, styles, and placeholders

${theme.bold("Global options")}
  --json, -j            Emit machine-readable JSON
  --color <mode>        ANSI policy: auto, always, or never
  --no-color            Alias for --color never
  --help, -h            Show general or command-specific help
  --version, -v         Show the package version

${theme.bold("Examples")}
  badge-layouts search powershell --language PowerShell
  badge-layouts preview general-npm-package --set PACKAGE=eslint --live
  badge-layouts preview balanced-public-repository --glow
  badge-layouts render general-npm-package --set PACKAGE=@acme/toolkit --copy

Run ${theme.accent("badge-layouts <command> --help")} for command options.
`;
    process.stdout.write(output);
}

function writeJson(value: unknown): void {
    process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

async function writeTextOutput(
    value: string,
    parsed: ParsedArguments,
    theme: TerminalTheme
): Promise<void> {
    const output = optionValue(parsed, "output");
    if (output !== undefined) {
        const outputPath = path.resolve(output);
        await writeFile(
            outputPath,
            value.endsWith("\n") ? value : `${value}\n`,
            "utf8"
        );
        process.stderr.write(`${theme.success("✓")} Wrote ${outputPath}\n`);
        return;
    }
    process.stdout.write(value.endsWith("\n") ? value : `${value}\n`);
}
