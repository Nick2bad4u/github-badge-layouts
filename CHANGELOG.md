<!-- markdownlint-disable -->
<!-- eslint-disable markdown/no-missing-label-refs -->

# 📜 Changelog

## ✨ What's Changed

- <b>Commit Range: ➡️</b> [`v0.3.0...61ace9d`](https://github.com/Nick2bad4u/github-badge-layouts/compare/v0.3.0...61ace9d6999dbf03410a0b9ceb47b6ef822d3717 "View full commit range on GitHub")

### 🧹 Chores

- [`61ace9d`](https://github.com/Nick2bad4u/github-badge-layouts/commit/61ace9d6999dbf03410a0b9ceb47b6ef822d3717 "Diff: 2 files, +3 | -3") — _(release)_ Prepare v0.4.0&nbsp;<sub><em>(2&nbsp;files,&nbsp;+3,&nbsp;-3)</em></sub>
  - 🔖 [chore] Raise the package and lockfile version for the backwards-compatible multi-service catalog, CLI, API, and gallery expansion.

### 🛡️ Security

- [`171a052`](https://github.com/Nick2bad4u/github-badge-layouts/commit/171a052ba3bd5f3f027824cedf4425650ee80626 "Diff: 31 files, +3106 | -361") — ✨ [feat] (providers) add multi-service badge layouts&nbsp;<sub><em>(31&nbsp;files,&nbsp;+3106,&nbsp;-361)</em></sub>
  - ✨ [feat] Add ten-service metadata, provider-aware catalog entries, API helpers, CLI service commands, and combined filtering.
  - 🔒️ [fix] Harden live previews with exact HTTPS host checks, redirect validation, SVG content bounds, and accessible label fallbacks.
  - 💄 [style] Add service-colored gallery facets, richer icons, responsive polish, npm navigation, and the selected v4 enhanced hero artwork.
  - 🧪 [test] Cover provider classification, CLI and gallery facets, redirect security, accessible SVG parsing, and CSP registry synchronization.
  - 📝 [docs] Refresh the README, CLI and contribution guides, package metadata, and scoped agent instructions.

## ✨ What's Changed in v0.3.0

- <b>Commit Range: ➡️</b> [`v0.2.0...v0.3.0`](https://github.com/Nick2bad4u/github-badge-layouts/compare/v0.2.0...v0.3.0 "View full commit range on GitHub")

### ✨ Features

- [`834890e`](https://github.com/Nick2bad4u/github-badge-layouts/commit/834890e694c398080d2659035b2a797e38e28690 "Diff: 8 files, +1399 | -228") — _(cli)_ Deliver rich terminal badge previews&nbsp;<sub><em>(8&nbsp;files,&nbsp;+1399,&nbsp;-228)</em></sub>
  - ✨ [feat] Add structured command help, language-aware discovery, Git context detection, validated command options, output files, clipboard support, JSON modes, aliases, and actionable error suggestions.
  - ✨ [feat] Render responsive ANSI badge previews with NO_COLOR support, optional bounded live Badgen SVG-title lookups, and clean Markdown summaries piped to Glow.
  - 🧪 [test] Cover terminal width behavior, preview parsing and warnings, CLI discovery, rendering, and option validation.
  - 📝 [docs] Replace the CLI guide and refresh README examples for the expanded terminal workflow.

- [`d102e00`](https://github.com/Nick2bad4u/github-badge-layouts/commit/d102e00e9a4d3275d0300bbef125e86dbfd5477c "Diff: 13 files, +1270 | -181") — _(catalog)_ Add language facets and curated layouts&nbsp;<sub><em>(13&nbsp;files,&nbsp;+1270,&nbsp;-181)</em></sub>
  - ✨ [feat] Classify all 75 layouts across 45 language facets, add three live-validated badge combinations, and expose language metadata through the generated catalog and package API.
  - ✨ [feat] Add URL-persisted language filtering, responsive gallery controls, language metadata on cards, and trusted-literal normalization for persisted view and sort preferences.
  - 🧪 [test] Cover language filtering, generated catalog metadata, pagination, and untrusted gallery preference fallbacks.
  - 📝 [docs] Document canonical language annotations and live SVG-title validation rules for future layout contributions.

### 🛠️ Bug Fixes

- [`746196a`](https://github.com/Nick2bad4u/github-badge-layouts/commit/746196a18f636d9a4a4ef14e0e32de5617dadf24 "Diff: 2 files, +54 | -28") — _(preview)_ Decode XML entities once&nbsp;<sub><em>(2&nbsp;files,&nbsp;+54,&nbsp;-28)</em></sub>
  - 🐛 [fix] Replace the multi-pass SVG title decoder with a single-pass XML entity parser that preserves nested encodings and rejects invalid XML code points.
  - 🧪 [test] Cover named, decimal, hexadecimal, nested, and out-of-range entity behavior reported by CodeQL.

### 🚜 Refactor

- [`d1ba27c`](https://github.com/Nick2bad4u/github-badge-layouts/commit/d1ba27cc288766690c3d79f50728f47eb22bc691 "Diff: 1 file, +20 | -8") — _(cli)_ Simplify argument handling&nbsp;<sub><em>(1&nbsp;file,&nbsp;+20,&nbsp;-8)</em></sub>
  - 🚜 [refactor] Extract parsed-option recording from the argument loop and centralize singular layout-count formatting to remove the two Sonar maintainability findings without changing CLI behavior.

### 📝 Documentation

- [`97dc873`](https://github.com/Nick2bad4u/github-badge-layouts/commit/97dc873cb3b9af50d31cb1dc8ab22c1c365696c4 "Diff: 1 file, +22 | -1") — _(changelog)_ Document v0.3.0&nbsp;<sub><em>(1&nbsp;file,&nbsp;+22,&nbsp;-1)</em></sub>
  - 📝 [docs] Record the new language facets, rich terminal previews, Glow integration, curated layouts, and quality fixes.

### 🧪 Testing

- [`1dad51b`](https://github.com/Nick2bad4u/github-badge-layouts/commit/1dad51b8e4f6dccdab5e9977b4bd0dd1ba3d31a8 "Diff: 2 files, +157 | -12") — 🧪 [test] cover preview and terminal edge cases&nbsp;<sub><em>(2&nbsp;files,&nbsp;+157,&nbsp;-12)</em></sub>
  - 🧪 [test] Exercise automatic color policy, all semantic ANSI roles, badge contrast, malformed tables, constrained widths, safe URL metadata, network and HTTP failures, missing SVG titles, and single-pass XML entities.
  - 🦺 [test] Restore the existing coverage gate without lowering thresholds: 97.82% statements, 91.41% branches, 100% functions, and 99.19% lines.

### 🧹 Chores

- [`dc4d59a`](https://github.com/Nick2bad4u/github-badge-layouts/commit/dc4d59a0b95f15e130e724ac0acec284e655fa0d "Diff: 2 files, +3 | -3") — _(release)_ Prepare v0.3.0&nbsp;<sub><em>(2&nbsp;files,&nbsp;+3,&nbsp;-3)</em></sub>
  - 🔖 [chore] Raise the package and lockfile version for the backwards-compatible CLI, catalog, and gallery expansion.

### 👷 CI/CD

- [`74c76fe`](https://github.com/Nick2bad4u/github-badge-layouts/commit/74c76fe47fe34c06fed6e66979ca879154ac2a48 "Diff: 1 file, +1 | -1") — _(quality)_ Update Harden Runner&nbsp;<sub><em>(1&nbsp;file,&nbsp;+1,&nbsp;-1)</em></sub>
  - 👷 [ci] Pin the Quality workflow to the verified Harden-Runner v2.21.0 commit already used by the Pages and release workflows.

> [!NOTE]
> **Release comparison**: https://github.com/Nick2bad4u/github-badge-layouts/compare/v0.2.0...v0.3.0

## ✨ What's Changed in v0.2.0

- <b>Commit Range: ➡️</b> [`678f5c4...v0.2.0`](https://github.com/Nick2bad4u/github-badge-layouts/compare/678f5c43e2cef4e8176163caefe0086b01cce6f8...v0.2.0 "View full commit range on GitHub")

### ✨ Features

- [`d50b6d0`](https://github.com/Nick2bad4u/github-badge-layouts/commit/d50b6d0be0ba6ec208ce49aafba2fbd175195ba8 "Diff: 13 files, +1114 | -241") — _(gallery)_ Add sortable list and grid views&nbsp;<sub><em>(13&nbsp;files,&nbsp;+1114,&nbsp;-241)</em></sub>
  - ✨ [feat] Add persisted grid/list controls, badge-count and alphabetical sorting, compact inline copy actions, and shareable URL state.
  - 💄 [style] Recompose the responsive hero, tighten mobile artwork, and improve the sticky discovery toolbar.
  - ✨ [feat] Expand the catalog to 72 layouts and 447 badges with seven live-verified CI, quality, package, community, and funding combinations.
  - 🐛 [fix] Parse composite placeholders without emitting nested phantom fields and safely decode hash targets.
  - 🧪 [test] Cover gallery filtering, sorting, pagination, preferences, hash parsing, catalog placeholders, and version-independent CLI output.

- [`471b313`](https://github.com/Nick2bad4u/github-badge-layouts/commit/471b3139c3713395e019f799143d4157909cac64 "Diff: 41 files, +8020 | -1650") — _(platform)_ Add the badge gallery and CLI&nbsp;<sub><em>(41&nbsp;files,&nbsp;+8020,&nbsp;-1650)</em></sub>
  - ✨ [feat] Build a typed, dependency-free catalog API and CLI for listing, searching, inspecting, rendering, converting, and safely updating README badge layouts.
  - 💄 [feat] Replace the starter page with a responsive personalized gallery featuring URL-backed filters, pagination, repository context, style conversion, preview validation, and copy-ready Markdown or CLI commands.
  - ✨ [feat] Expand the canonical library to 65 layouts and 410 badges across 10 categories, including broad language-first repository coverage, and generate synchronized browser and TypeScript catalogs.
  - 🧪 [test] Cover catalog queries, rendering and style conversion, placeholder handling, CLI integration, package exports, and production builds with strict lint and coverage gates.
  - 📝 [docs] Document the package API, CLI workflows, contribution contract, project structure, catalog ownership, and initial changelog.

- [`678f5c4`](https://github.com/Nick2bad4u/github-badge-layouts/commit/678f5c43e2cef4e8176163caefe0086b01cce6f8 "Diff: 17 files, +2803 | -0") — Add interactive badge layout library&nbsp;<sub><em>(17&nbsp;files,&nbsp;+2803,&nbsp;-0)</em></sub>

### 🛠️ Bug Fixes

- [`5cd3679`](https://github.com/Nick2bad4u/github-badge-layouts/commit/5cd3679ac0d6747cab38c23cd82bdbb5cc8c0621 "Diff: 1 file, +1 | -0") — _(sonar)_ Separate source and test scopes&nbsp;<sub><em>(1&nbsp;file,&nbsp;+1,&nbsp;-0)</em></sub>
  - 🐛 [fix] Declare the Automatic Analysis source roots explicitly so the test directory no longer overlaps Sonar's default source scope while workflow analysis remains enabled.

- [`55f5965`](https://github.com/Nick2bad4u/github-badge-layouts/commit/55f59658a21d4f5d09144fe275b53fb7822bc920 "Diff: 11 files, +191 | -146") — _(quality)_ Resolve Sonar automatic analysis findings&nbsp;<sub><em>(11&nbsp;files,&nbsp;+191,&nbsp;-146)</em></sub>
  - 🐛 [fix] Refactor the catalog parser, clipboard handling, badge parsing, placeholder selection, and native clipboard command lookup to resolve the reported reliability and maintainability findings.
  - 🔒️ [fix] Stop persisting URL-derived repository identifiers, use the native output element for toast status, and disable dependency lifecycle scripts in every install workflow.
  - 👷 [ci] Replace the ignored CI scanner properties with supported Automatic Analysis settings, remove the dormant SONAR_TOKEN path, and document Codecov as the coverage authority.

### 🚜 Refactor

- [`26264c9`](https://github.com/Nick2bad4u/github-badge-layouts/commit/26264c96458b30afae5edd9fa0a360545dc00d30 "Diff: 1 file, +5 | -3") — _(catalog)_ Stop mutating the loop counter&nbsp;<sub><em>(1&nbsp;file,&nbsp;+5,&nbsp;-3)</em></sub>
  - 🚜 [refactor] Track the last consumed Markdown-fence line separately while iterating immutable line indexes, resolving Sonar S2310 without changing generated output.

### 📝 Documentation

- [`ef3abea`](https://github.com/Nick2bad4u/github-badge-layouts/commit/ef3abeaec788da03bc8b672357e8354d5fbbf272 "Diff: 1 file, +5 | -2") — _(changelog)_ Document v0.2.0&nbsp;<sub><em>(1&nbsp;file,&nbsp;+5,&nbsp;-2)</em></sub>

- [`fd19254`](https://github.com/Nick2bad4u/github-badge-layouts/commit/fd192543b8cbb137de4afd2c406a10ccbeddbeeb "Diff: 3 files, +21 | -45") — _(release)_ Document gallery and trusted publishing&nbsp;<sub><em>(3&nbsp;files,&nbsp;+21,&nbsp;-45)</em></sub>
  - 📝 [docs] Describe the sortable list experience, expanded catalog totals, and stored display preferences.
  - 📝 [docs] Record the unreleased feature set and replace obsolete first-publish instructions with the active OIDC release flow.

- [`31c6f42`](https://github.com/Nick2bad4u/github-badge-layouts/commit/31c6f42fb646bdb9953bfe633108e6518f19d13b "Diff: 1 file, +1 | -0") — _(catalog)_ Explain fenced-line skipping&nbsp;<sub><em>(1&nbsp;file,&nbsp;+1,&nbsp;-0)</em></sub>
  - 💡 [docs] Clarify why the parser ignores line entries already consumed as part of a fenced layout block.

- [`58b4f75`](https://github.com/Nick2bad4u/github-badge-layouts/commit/58b4f7575c18bf5b90f37f64666c4a4eda27a738 "Diff: 1 file, +4 | -1") — _(sonar)_ Explain explicit source roots&nbsp;<sub><em>(1&nbsp;file,&nbsp;+4,&nbsp;-1)</em></sub>
  - 📝 [docs] Record why Automatic Analysis needs an explicit source scope and why GitHub workflows remain included.

- [`b5066e0`](https://github.com/Nick2bad4u/github-badge-layouts/commit/b5066e0899f0eb13e3c42eb07e9f86587bb3d769 "Diff: 1 file, +1 | -1") — _(sonar)_ Link Automatic Analysis guidance&nbsp;<sub><em>(1&nbsp;file,&nbsp;+1,&nbsp;-1)</em></sub>
  - 📝 [docs] Link the release guidance directly to SonarQube Cloud's current Automatic Analysis documentation.

### 🧹 Chores

- [`6863d44`](https://github.com/Nick2bad4u/github-badge-layouts/commit/6863d4482138dcb932a9f68b97c8ef866ff9afc2 "Diff: 2 files, +3 | -3") — _(release)_ Prepare v0.2.0&nbsp;<sub><em>(2&nbsp;files,&nbsp;+3,&nbsp;-3)</em></sub>
  - 🔖 [chore] Raise the package and lockfile version to 0.2.0 after the backwards-compatible gallery and catalog expansion.

- [`280ad1a`](https://github.com/Nick2bad4u/github-badge-layouts/commit/280ad1a2a5b7ddfa95fcfd0c02739b79a36ae389 "Diff: 19 files, +27976 | -1828") — _(repo)_ Adopt shared repository standards&nbsp;<sub><em>(19&nbsp;files,&nbsp;+27976,&nbsp;-1828)</em></sub>
  - 🔧 [chore] Wire the shared ESLint, Prettier, Remark, Stylelint, TSDoc, package-manifest, secret-scanning, link-checking, and duplication-analysis presets into the repository.
  - 🎨 [style] Normalize the existing catalog builder and Pages sources under the adopted formatting rules while preserving generated catalog output.
  - 📦️ [build] Add the resolved npm tooling lockfile and package scripts needed to run the imported quality suite reproducibly.

### 👷 CI/CD

- [`92d0f01`](https://github.com/Nick2bad4u/github-badge-layouts/commit/92d0f01f28e23ac8c4337235879595db2a180218 "Diff: 2 files, +64 | -0") — _(release)_ Install verifier toolchain&nbsp;<sub><em>(2&nbsp;files,&nbsp;+64,&nbsp;-0)</em></sub>

- [`f75f60d`](https://github.com/Nick2bad4u/github-badge-layouts/commit/f75f60d9f06403d55ea7534ba69ef1fa442352c2 "Diff: 1 file, +9 | -0") — _(release)_ Install actionlint before verification&nbsp;<sub><em>(1&nbsp;file,&nbsp;+9,&nbsp;-0)</em></sub>

### 🛡️ Security

- [`74154b9`](https://github.com/Nick2bad4u/github-badge-layouts/commit/74154b9a38276d5c1fe71c6de7fb580a3c160f4f "Diff: 4 files, +75 | -8") — 🐛 [fix] (security) Harden badge preview URL handling&nbsp;<sub><em>(4&nbsp;files,&nbsp;+75,&nbsp;-8)</em></sub>
  - 🔒️ [fix] Encode every interactive placeholder value and require HTTPS preview targets, credential-free URLs, and exact Badgen image hosts before assigning DOM URLs.
  - 🐛 [fix] Restrict style conversion to Markdown image prefixes so Badgen-like text inside arbitrary URLs is never rewritten.
  - 🧪 [test] Cover the host-boundary regression and retain the complete 20-test validation suite.
  - 🚨 [fix] Disable only Tombi's cross-platform formatting rule for the Gitleaks config while retaining actual Gitleaks parsing in every release gate.

- [`1a3bc1b`](https://github.com/Nick2bad4u/github-badge-layouts/commit/1a3bc1bb2c71e91d0f550cbd5887b7f6524967a2 "Diff: 18 files, +1100 | -0") — 👷 [build] (automation) Add quality, security, Pages, and release workflows&nbsp;<sub><em>(18&nbsp;files,&nbsp;+1100,&nbsp;-0)</em></sub>
  - 👷 [build] Run pinned, least-privilege validation, coverage, Codecov OIDC upload, CodeQL analysis, and artifact diagnostics on pull requests and main.
  - 🚀 [build] Build and deploy the Vite gallery through the GitHub Pages artifact workflow with a protected deployment environment.
  - 🔒️ [build] Adopt shared dependency, label, stale, secret-scan, dependency-review, and Dependabot automation with explicit repository ownership.
  - 📦️ [build] Add a guarded npm trusted-publishing workflow that verifies exact versions, a clean release source, provenance, tags, and GitHub release recovery without storing an npm token.
  - 📝 [docs] Record the manual first-publish bootstrap and the remaining SonarQube Cloud token handoff.

### New Contributors

- @Nick2bad4u made their first contribution in [#9](https://github.com/Nick2bad4u/github-badge-layouts/pull/9)

## ⭐ Contributors

Thanks to anyone who has 🧑‍💻 [contributed](https://github.com/Nick2bad4u/github-badge-layouts/graphs/contributors).

_This changelog was automatically generated with ⛰️ [git-cliff](https://github.com/orhun/git-cliff)._
