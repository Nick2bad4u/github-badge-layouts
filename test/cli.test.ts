import { spawnSync } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const cliPath = path.join(repositoryRoot, "dist", "cli", "bin.js");

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
        expect(help.stdout).toContain("discover, customize, and maintain");

        const version = runCli(["--version"]);
        expect(version.status).toBe(0);
        expect(version.stdout).toMatch(/^0\.1\.0\s*$/v);
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
