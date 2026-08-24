# GitHub Badge Layouts

[![Open the interactive badge gallery.](https://flat.badgen.net/static/preview/GitHub%20Pages/0E7490)](https://nick2bad4u.github.io/github-badge-layouts/) [![GitHub Actions checks on main.](https://flat.badgen.net/github/checks/Nick2bad4u/github-badge-layouts/main)](https://github.com/Nick2bad4u/github-badge-layouts/actions) [![Codecov coverage.](https://flat.badgen.net/codecov/github/Nick2bad4u/github-badge-layouts/main)](https://codecov.io/gh/Nick2bad4u/github-badge-layouts) [![Library license: MIT.](https://flat.badgen.net/static/license/MIT/4338CA)](LICENSE)

<p align="center">
  <img src="docs/public/assets/badge-layouts-hero.png" width="920" alt="Abstract cyan and violet badge rows arranged as a technical catalog on a dark background." />
</p>

A curated library of copy-ready [Badgen](https://badgen.net/) combinations, a personalized browser gallery, and a dependency-free npm CLI/API for maintaining README badges.

The canonical [`library.md`](library.md) currently contains **72 layouts**, **447 badges**, and **11 categories** covering GitHub projects, JavaScript and TypeScript, native and managed languages, package registries, containers, infrastructure, external CI and code quality, editor/browser extensions, operating-system distribution, and community metadata.

## Interactive gallery

[Open the gallery](https://nick2bad4u.github.io/github-badge-layouts/) to:

- Personalize every visible layout from one owner, repository, and branch form. Defaults use `Nick2bad4u/gh-runs-cleanup` on `main`.
- Switch every Badgen image between flat and classic rendering without changing its destination.
- Search and filter the catalog, sort by title, category, or badge count, and switch between detailed grid cards and compact list rows with inline copy actions.
- Select 4, 6, 9, or 12 layouts per page and use real pagination. Only the current page creates badge-image requests.
- Apply layout-specific placeholders such as `PACKAGE`, `CRATE`, `POD`, or `EXTENSION_ID`.
- Copy rendered Markdown or the equivalent CLI command.
- Preserve shareable filters and personalization in the URL, with view, sort, style, and page-size preferences stored locally.

The interface uses code-native SVG/CSS motion and the generated hero artwork above. It uses an installed `Symbols Nerd Font Mono` when available, with Unicode and system-font fallbacks; the repository does not vendor the multi-license Nerd Fonts symbols archive.

## CLI

Run the CLI without installing it:

```sh
npx github-badge-layouts search powershell
npx github-badge-layouts render powershell-automation-repository \
  --owner acme \
  --repo toolkit \
  --branch main
```

Install it globally if you use it frequently:

```sh
npm install --global github-badge-layouts
badge-layouts --help
```

The two executable names, `badge-layouts` and `github-badge-layouts`, are aliases.

| Command           | Purpose                                                                     |
| ----------------- | --------------------------------------------------------------------------- |
| `list`            | List layouts with optional category, query, JSON, and result-limit filters. |
| `search <query>`  | Search titles, categories, descriptions, placeholders, and Markdown.        |
| `categories`      | Print the canonical category list.                                          |
| `show <layout>`   | Inspect a layout and its unresolved template.                               |
| `render <layout>` | Render copy-ready Markdown with repository and custom placeholder values.   |
| `convert`         | Convert Badgen image URLs between flat and classic styles.                  |
| `inspect`         | Count badge renderers and known unresolved placeholders in Markdown.        |
| `readme <layout>` | Preview or safely update a managed badge block in a README.                 |

Useful examples:

```sh
# Render an npm layout with a scoped package name.
badge-layouts render general-npm-package \
  --owner acme \
  --repo toolkit \
  --set PACKAGE=@acme/toolkit

# Convert badge images read from a file or stdin.
badge-layouts convert --style classic --input README.md
Get-Content README.md | badge-layouts inspect --json

# Preview first; add --write only after reviewing the managed block.
badge-layouts readme balanced-public-repository --file README.md
badge-layouts readme balanced-public-repository --file README.md --write
```

The README writer only owns content between these markers:

```md
<!-- github-badge-layouts:start -->
<!-- github-badge-layouts:end -->
```

See the complete [CLI reference](docs/CLI.md) for input precedence, JSON output, clipboard support, placeholder safety, and exit behavior.

## JavaScript API

The package is ESM-only and includes TypeScript declarations.

```ts
import {
 getLayoutOrThrow,
 inspectBadgeMarkdown,
 renderLayout,
} from "github-badge-layouts";

const layout = getLayoutOrThrow("general-npm-package");
const markdown = renderLayout(layout, {
 branch: "main",
 owner: "acme",
 placeholders: { PACKAGE: "@acme/toolkit" },
 repo: "toolkit",
 style: "flat",
});

console.log(markdown);
console.log(inspectBadgeMarkdown(markdown));
```

The public API also exports the generated `badgeCatalog`, `findLayout`, `listLayouts`, style conversion/parsing helpers, placeholder inspection, and managed README-block helpers.

## Use a layout manually

1. Open the gallery and find the closest project type.
2. Enter the target owner, repository, and branch.
3. Expand **Customize placeholders** for ecosystem-specific values.
4. Preview every badge and remove signals the project does not actually use.
5. Copy the Markdown into the target README.
6. Search the result for remaining uppercase placeholders before committing it.

The complete prose guide, color system, placeholder reference, personalized examples, conditional-endpoint warnings, and final quality checklist remain in [`library.md`](library.md).

## Development

This repository uses the imported shared lint, formatting, secret-scanning, link-checking, changelog, and GitHub automation conventions. The browser application itself remains framework-free.

```powershell
npm ci
npm run build
npm run validate
npm run test:coverage
npm run site:dev
```

Open the local URL printed by Vite. Use `npm run site:preview` to inspect the exact production build.

| Path                                                             | Responsibility                                                                 |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [`library.md`](library.md)                                       | Canonical prose and badge-layout templates.                                    |
| [`scripts/build-site.mjs`](scripts/build-site.mjs)               | Parser, validator, and deterministic catalog generator.                        |
| [`docs/index.html`](docs/index.html)                             | Dependency-free Pages UI, manifest, and visual assets.                         |
| [`src/index.ts`](src/index.ts)                                   | ESM package API and CLI source.                                                |
| [`test/cli.test.ts`](test/cli.test.ts)                           | Vitest unit and CLI integration tests.                                         |
| [`.github/workflows/quality.yml`](.github/workflows/quality.yml) | Quality, Pages, CodeQL, security, maintenance, and trusted release automation. |

Do not edit `docs/catalog.js` or `src/generated/catalog.ts` directly. Run `npm run build:catalog` after changing `library.md`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the layout contract and [RELEASING.md](docs/RELEASING.md) for the one-time npm bootstrap and later trusted-publishing flow.

## Third-party services

Badge images are requested from `flat.badgen.net` or `badgen.net`; clicking a badge opens the relevant project or service. Badgen and the upstream services are not affiliated with this repository. Review their availability and privacy policies before using them in a project.

## License

[MIT](LICENSE)
