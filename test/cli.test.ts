import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const cliPath = path.join(repositoryRoot, "dist", "cli", "bin.js");
const packageVersion = (
    JSON.parse(
        readFileSync(path.join(repositoryRoot, "package.json"), "utf8")
    ) as { readonly version: string }
).version;

function runCli(cliArguments: readonly string[], input?: string) {
    return spawnSync(process.execPath, [cliPath, ...cliArguments], {
        cwd: repositoryRoot,
        encoding: "utf8",
        input,
    });
}

describe("CLI", () => {
    it("prints help and version", () => {
        const help = runCli(["--help"]);
        expect(help.status).toBe(0);
        expect(help.stdout).toContain("discover, preview, and maintain");
        expect(help.stdout).toContain("preview <layout>");

        const version = runCli(["--version"]);
        expect(version.status).toBe(0);
        expect(version.stdout.trim()).toBe(packageVersion);
    });

    it("searches the catalog as JSON", () => {
        const result = runCli([
            "search",
            "powershell",
            "--json",
        ]);
        expect(result.status).toBe(0);
        const layouts = JSON.parse(result.stdout) as {
            readonly title: string;
        }[];
        expect(layouts.map((layout) => layout.title)).toContain(
            "PowerShell module"
        );
    });

    it("filters layouts by language and lists language counts", () => {
        const search = runCli([
            "search",
            "package",
            "--language",
            "Rust",
            "--json",
        ]);
        expect(search.status).toBe(0);
        const layouts = JSON.parse(search.stdout) as {
            readonly languages: readonly string[];
            readonly title: string;
        }[];
        expect(layouts).toEqual([
            expect.objectContaining({
                languages: expect.arrayContaining(["Rust"]),
                title: "Rust crate",
            }),
        ]);

        const languages = runCli(["languages"]);
        expect(languages.status).toBe(0);
        expect(languages.stdout).toContain("Language agnostic");
        expect(languages.stdout).toContain("TypeScript");
    });

    it("renders ANSI previews and command-specific help", () => {
        const preview = runCli([
            "preview",
            "balanced-public-repository",
            "--color",
            "always",
        ]);
        expect(preview.status).toBe(0);
        expect(preview.stdout).toContain("\u{1B}[");
        expect(preview.stdout).toContain("Latest stable GitHub release");
        expect(preview.stdout).toContain("Add --live");

        const help = runCli(["preview", "--help"]);
        expect(help.status).toBe(0);
        expect(help.stdout).toContain("--renderer <ansi|glow>");
    });

    it("detects repository context and suggests misspelled commands", () => {
        const context = runCli(["context", "--json"]);
        expect(context.status).toBe(0);
        expect(JSON.parse(context.stdout)).toMatchObject({
            owner: "Nick2bad4u",
            repo: "github-badge-layouts",
            source: "git",
        });

        const misspelled = runCli(["previe"]);
        expect(misspelled.status).toBe(1);
        expect(misspelled.stderr).toContain("Did you mean preview?");
    });

    it("renders personalized classic badges", () => {
        const result = runCli([
            "render",
            "balanced-public-repository",
            "--owner",
            "acme",
            "--repo",
            "toolkit",
            "--style",
            "classic",
        ]);
        expect(result.status).toBe(0);
        expect(result.stdout).toContain("github.com/acme/toolkit");
        expect(result.stdout).toContain("https://badgen.net/");
        expect(result.stdout).not.toContain("OWNER/REPO");
    });

    it("converts piped Markdown", () => {
        const result = runCli(
            [
                "convert",
                "--style",
                "classic",
                "--input",
                "-",
            ],
            "![A](https://flat.badgen.net/static/a/b)"
        );
        expect(result.status).toBe(0);
        expect(result.stdout).toContain("https://badgen.net/static/a/b");
    });

    it("returns a nonzero status and useful errors", () => {
        const result = runCli(["render", "does-not-exist"]);
        expect(result.status).toBe(1);
        expect(result.stderr).toContain("Unknown or ambiguous layout");
    });
});
