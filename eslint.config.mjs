import { createConfig } from "eslint-config-nick2bad4u";
import { fileURLToPath } from "node:url";

const rootDirectory = fileURLToPath(new URL(".", import.meta.url));

/** @type {import("eslint").Linter.Config[]} */
const config = [
    {
        ignores: [
            "docs/catalog.js",
            "dist/**",
            "reports/**",
            "src/generated/**",
        ],
        name: "Generated and report output",
    },
    ...createConfig({
        allowDefaultProjectFilePatterns: [],
        plugins: {
            actionlint: false,
            "docusaurus-2": false,
            remark: false,
            repo: false,
            secretlint: false,
            "stylelint-2": false,
            yamllint: false,
        },
        rootDirectory,
        tsconfigPaths: ["./tsconfig.eslint.json"],
        vitest: false,
    }),
    {
        files: ["eslint.config.mjs"],
        name: "Node 22-compatible ESLint configuration",
        rules: {
            "unicorn/prefer-import-meta-properties": "off",
        },
    },
    {
        files: [".gitleaks.toml"],
        name: "Cross-platform Gitleaks configuration",
        rules: {
            // Tombi's platform binaries disagree on table indentation. Gitleaks
            // still parses this file in every local and CI release gate.
            "tombi/tombi": "off",
        },
    },
    {
        files: ["src/**/*.ts"],
        name: "Dependency-free package source",
        rules: {
            "canonical/no-use-extend-native": "off",
            "typefest/prefer-ts-extras-array-first": "off",
            "typefest/prefer-ts-extras-array-join": "off",
            "typefest/prefer-ts-extras-assert": "off",
            "typefest/prefer-ts-extras-is-defined": "off",
            "typefest/prefer-ts-extras-is-safe-integer": "off",
            "typefest/prefer-ts-extras-safe-cast-to": "off",
            "typefest/prefer-ts-extras-set-has": "off",
        },
    },
    {
        files: ["src/cli.ts"],
        name: "Native CLI integration",
        rules: {
            "n/no-sync": "off",
            "security/detect-non-literal-fs-filename": "off",
            "unicorn/prefer-error-is-error": "off",
        },
    },
    {
        files: ["src/bin.ts"],
        name: "Compiled npm executable",
        rules: {
            // The source shebang is preserved in dist/cli/bin.js, the package bin target.
            "n/hashbang": "off",
        },
    },
    {
        files: ["src/index.ts"],
        name: "Public package entry point",
        rules: {
            "canonical/filename-no-index": "off",
            "no-barrel-files/no-barrel-files": "off",
        },
    },
    {
        files: ["docs/app.js"],
        name: "Browser application overrides",
        rules: {
            "@typescript-eslint/no-deprecated": "off",
            "canonical/no-use-extend-native": "off",
            "case-police/string-check": "off",
            "import-x/extensions": "off",
            "listeners/no-inline-function-event-listener": "off",
            "listeners/no-missing-remove-event-listener": "off",
            "n/no-unsupported-features/node-builtins": "off",
            "sonarjs/deprecation": "off",
            "unicorn/prefer-error-is-error": "off",
        },
    },
    {
        files: ["docs/index.html"],
        name: "Static Pages HTML overrides",
        rules: {
            "@html-eslint/id-naming-convention": "off",
            "@html-eslint/no-extra-spacing-tags": "off",
            "@html-eslint/require-open-graph-protocol": "off",
            "@html-eslint/use-baseline": "off",
        },
    },
];

export default config;
