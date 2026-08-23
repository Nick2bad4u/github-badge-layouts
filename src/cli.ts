import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import * as path from "node:path";

import type { BadgeStyle, PlaceholderValues } from "./types.js";

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

const defaultCoordinates = Object.freeze({
    branch: "main",
    owner: "Nick2bad4u",
    repo: "gh-runs-cleanup",
});

const helpText = `github-badge-layouts — discover, customize, and maintain README badges

Usage:
  badge-layouts <command> [arguments] [options]

Commands:
  list                     List layouts; filter with --query or --category
  search <query>           Search titles, categories, placeholders, and Markdown
  categories               List catalog categories
  show <layout>            Show layout metadata and its raw template
  render <layout>          Render copy-ready Markdown for a repository
  convert [markdown]       Convert Badgen image URLs between flat and classic
  inspect [markdown]       Count badges, styles, and unresolved placeholders
  readme <layout>          Preview or write a managed README badge block

Repository options:
  --owner <name>           GitHub owner (default: Nick2bad4u)
  --repo <name>            GitHub repository (default: gh-runs-cleanup)
  --branch <name>          Default branch (default: main)
  --set NAME=VALUE         Set any additional placeholder; repeat as needed
  --style <flat|classic>   Select the Badgen renderer (default: flat)
  --allow-unresolved       Preserve placeholders that have no supplied value

Input/output options:
  --input <file>           Read Markdown from a file; use - for stdin
  --file <README>          README path for the readme command (default: README.md)
  --write                  Apply the managed README block (preview is the default)
  --copy                   Copy rendered Markdown using the native clipboard tool
  --json, -j               Emit machine-readable JSON
  --limit <count>          Limit list/search results
  --help, -h               Show help
  --version, -v            Show the package version

Examples:
  badge-layouts search powershell
  badge-layouts render balanced-public-repository --owner acme --repo toolkit
  badge-layouts render general-npm-package --set PACKAGE=@acme/toolkit
  badge-layouts convert --style classic --input README.md
  badge-layouts readme balanced-public-repository --write --file README.md
`;

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

const booleanOptions = new Set([
    "allow-unresolved",
    "copy",
    "help",
    "json",
    "version",
    "write",
]);
const valueOptions = new Set([
    "branch",
    "category",
    "file",
    "input",
    "limit",
    "owner",
    "query",
    "repo",
    "set",
    "style",
]);

/** Run the CLI and return a process-compatible exit code. */
export async function runCli(cliArguments: readonly string[]): Promise<number> {
    try {
        const parsed = parseArguments(cliArguments);
        await runCommand(parsed);
        return 0;
    } catch (error) {
        process.stderr.write(
            `Error: ${error instanceof Error ? error.message : String(error)}\n`
        );
        return 1;
    }
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
        {
            arguments: ["-selection", "clipboard"],
            command: "xclip",
        },
        { arguments: ["--clipboard", "--input"], command: "xsel" },
    ];
}

function copyToClipboard(text: string): void {
    const candidates = clipboardCandidates();

    for (const candidate of candidates) {
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

function isPlaceholderName(name: string): boolean {
    const [first, ...rest] = name;
    const isUppercaseAscii =
        first !== undefined && first >= "A" && first <= "Z";
    return (
        isUppercaseAscii &&
        rest.every(
            (character) =>
                (character >= "A" && character <= "Z") ||
                (character >= "0" && character <= "9") ||
                "-._".includes(character)
        )
    );
}

function optionValue(
    parsed: ParsedArguments,
    name: string
): string | undefined {
    return parsed.options.get(name)?.at(-1);
}

async function packageVersion(): Promise<string> {
    const manifestUrl = new URL("../../package.json", import.meta.url);
    const parsedManifest: unknown = JSON.parse(
        await readFile(manifestUrl, "utf8")
    );
    if (typeof parsedManifest !== "object" || parsedManifest === null) {
        throw new TypeError("package.json must contain a JSON object.");
    }
    const manifest = parsedManifest as {
        readonly version?: unknown;
    };
    if (typeof manifest.version !== "string") {
        throw new TypeError("package.json does not declare a string version.");
    }
    return manifest.version;
}

function parseArguments(cliArguments: readonly string[]): ParsedArguments {
    const normalizedArguments = cliArguments.map((argument) => {
        if (argument === "-h") return "--help";
        if (argument === "-j") return "--json";
        if (argument === "-v") return "--version";
        return argument;
    });
    const [first = "help", ...rest] = normalizedArguments;
    const command = first.startsWith("-") ? "help" : first;
    const tokens = first.startsWith("-") ? normalizedArguments : rest;
    const booleans = new Set<string>();
    const options = new Map<string, string[]>();
    const positionals: string[] = [];

    for (let index = 0; index < tokens.length; index += 1) {
        const token = tokens[index] ?? "";
        if (token.startsWith("--")) {
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
        throw new Error(`Unknown option: --${name}`);
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

async function readMarkdownInput(parsed: ParsedArguments): Promise<string> {
    const input = optionValue(parsed, "input");
    if (input !== "-" && input !== undefined && input.length > 0) {
        return readFile(path.resolve(input), "utf8");
    }
    if (parsed.positionals.length > 0) {
        return parsed.positionals.join(" ");
    }
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

function renderOptions(parsed: ParsedArguments): {
    readonly allowUnresolved: boolean;
    readonly branch: string;
    readonly owner: string;
    readonly placeholders: PlaceholderValues;
    readonly repo: string;
    readonly style: BadgeStyle;
} {
    return {
        allowUnresolved: parsed.booleans.has("allow-unresolved"),
        branch: optionValue(parsed, "branch") ?? defaultCoordinates.branch,
        owner: optionValue(parsed, "owner") ?? defaultCoordinates.owner,
        placeholders: parsePlaceholderValues(parsed.options.get("set") ?? []),
        repo: optionValue(parsed, "repo") ?? defaultCoordinates.repo,
        style: parseBadgeStyle(optionValue(parsed, "style") ?? "flat"),
    };
}

async function runCommand(parsed: ParsedArguments): Promise<void> {
    if (parsed.booleans.has("version") || parsed.command === "version") {
        process.stdout.write(`${await packageVersion()}\n`);
        return;
    }
    if (parsed.booleans.has("help") || parsed.command === "help") {
        process.stdout.write(helpText);
        return;
    }

    switch (parsed.command) {
        case "categories": {
            writeCategories(parsed);
            return;
        }
        case "convert": {
            await runConvertCommand(parsed);
            return;
        }
        case "inspect": {
            await runInspectCommand(parsed);
            return;
        }
        case "list":
        case "search": {
            runListCommand(parsed);
            return;
        }
        case "readme":
        case "render": {
            await runRenderCommand(parsed);
            return;
        }
        case "show": {
            runShowCommand(parsed);
            return;
        }
        default: {
            throw new Error(
                `Unknown command: ${parsed.command}. Run \`badge-layouts --help\`.`
            );
        }
    }
}

async function runConvertCommand(parsed: ParsedArguments): Promise<void> {
    const markdown = await readMarkdownInput(parsed);
    const style = parseBadgeStyle(optionValue(parsed, "style") ?? "flat");
    const converted = convertBadgeStyle(markdown, style);
    if (parsed.booleans.has("copy")) copyToClipboard(converted);
    if (parsed.booleans.has("json")) {
        writeJson({ markdown: converted, style });
        return;
    }
    process.stdout.write(
        converted.endsWith("\n") ? converted : `${converted}\n`
    );
}

async function runInspectCommand(parsed: ParsedArguments): Promise<void> {
    const markdown = await readMarkdownInput(parsed);
    const inspection = inspectBadgeMarkdown(markdown);
    if (parsed.booleans.has("json")) {
        writeJson(inspection);
        return;
    }
    const placeholders =
        inspection.placeholders.length > 0
            ? inspection.placeholders.join(", ")
            : "none";
    const output = [
        `Badges: ${inspection.badgeCount}`,
        `Flat: ${inspection.flatBadgeCount}`,
        `Classic: ${inspection.classicBadgeCount}`,
        `Other: ${inspection.unknownBadgeCount}`,
        `Placeholders: ${placeholders}`,
    ];
    process.stdout.write(`${output.join("\n")}\n`);
}

function runListCommand(parsed: ParsedArguments): void {
    const query =
        parsed.command === "search"
            ? parsed.positionals.join(" ")
            : optionValue(parsed, "query");
    if (
        parsed.command === "search" &&
        (query === undefined || query.length === 0)
    ) {
        throw new Error("search requires a query.");
    }
    const limit = parseLimit(optionValue(parsed, "limit"));
    const category = optionValue(parsed, "category");
    const layouts = listLayouts({
        ...(category !== undefined && category.length > 0 && { category }),
        ...(query !== undefined && query.length > 0 && { query }),
    }).slice(0, limit);
    if (parsed.booleans.has("json")) {
        writeJson(layouts);
        return;
    }
    const output = layouts.map(
        (entry) => `${entry.id}\t${entry.category}\t${entry.title}`
    );
    process.stdout.write(
        output.length > 0 ? `${output.join("\n")}\n` : "No matching layouts.\n"
    );
}

async function runRenderCommand(parsed: ParsedArguments): Promise<void> {
    const identifier = parsed.positionals[0];
    if (identifier === undefined || identifier.length === 0) {
        throw new Error(`${parsed.command} requires a layout ID or title.`);
    }
    const layout = getLayoutOrThrow(identifier);
    const markdown = renderLayout(layout, renderOptions(parsed));
    if (parsed.command === "render") {
        if (parsed.booleans.has("copy")) copyToClipboard(markdown);
        if (parsed.booleans.has("json")) {
            writeJson({ layout: layout.id, markdown });
        } else {
            process.stdout.write(`${markdown}\n`);
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
    const updated = upsertReadmeBadgeBlock(current, markdown);
    await writeFile(readmePath, updated, "utf8");
    if (parsed.booleans.has("json")) {
        writeJson({ file: readmePath, layout: layout.id, written: true });
    } else {
        process.stderr.write(`Updated ${readmePath}\n`);
    }
}

function runShowCommand(parsed: ParsedArguments): void {
    const identifier = parsed.positionals[0];
    if (identifier === undefined || identifier.length === 0) {
        throw new Error("show requires a layout ID or title.");
    }
    const layout = getLayoutOrThrow(identifier);
    if (parsed.booleans.has("json")) {
        writeJson(layout);
        return;
    }
    const placeholderLine =
        layout.placeholders.length > 0
            ? `Placeholders: ${layout.placeholders.join(", ")}`
            : "Placeholders: none";
    const output = [
        layout.title,
        layout.category,
        `${layout.badgeCount} badges`,
        placeholderLine,
        "",
        layout.template,
    ];
    process.stdout.write(`${output.join("\n")}\n`);
}

function writeCategories(parsed: ParsedArguments): void {
    if (parsed.booleans.has("json")) {
        writeJson(badgeCatalog.categories);
        return;
    }
    process.stdout.write(`${badgeCatalog.categories.join("\n")}\n`);
}

function writeJson(value: unknown): void {
    process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}
