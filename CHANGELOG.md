# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2026-08-24

### Added

- Language facets for all 75 layouts, including language-aware filtering in the gallery, CLI, generated catalog, and package API.
- Rich terminal output with ANSI styling, color controls, responsive badge previews, Git-context detection, structured help, command aliases, output files, clipboard support, and actionable error suggestions.
- Optional live Badgen SVG-title previews and Glow-powered Markdown rendering.
- Three live-validated badge combinations covering Travis CI with Coveralls, bundle-conscious npm libraries, and Mastodon communities.
- Focused terminal and preview tests covering color policy, constrained widths, XML entities, HTTP and network failures, and suspicious live badge values.

### Changed

- Expanded the canonical catalog to 75 layouts and 470 badges across 11 categories and 45 language facets.
- Improved CLI discovery with readable tables, language and category counts, JSON modes, option validation, and command-specific guidance.

### Fixed

- Decode SVG XML entities in a single pass so nested encodings cannot become unintended markup.
- Simplified CLI argument handling and layout-count formatting to resolve Sonar maintainability findings.

## [0.2.0] - 2026-08-23

### Added

- Grid and compact list gallery views with inline copy actions, persisted view preferences, and sorting by badge count, title, or category.
- Seven copy-ready layouts for Azure Pipelines, CircleCI, AppVeyor, Code Climate, MELPA, Matrix, and Liberapay.
- Unit coverage for gallery filtering, sorting, pagination, and preference parsing.

### Changed

- Reworked the responsive hero so its CSS artwork stays adjacent to the introduction instead of falling below the complete call-to-action block.
- Expanded the canonical catalog to 72 layouts and 447 badges across 11 categories.

## [0.1.0] - 2026-08-23

### Added

- A canonical catalog of 65 copy-ready layouts and 410 Badgen badges across 10 project categories.
- A personalized, paginated GitHub Pages gallery with flat/classic style conversion and copy-ready CLI commands.
- An ESM npm API and dependency-free CLI for searching, rendering, converting, inspecting, and maintaining README badge blocks.
- Strict shared lint, formatting, secret, duplication, link, package-surface, TypeScript, and Vitest coverage gates.
- Pinned GitHub Pages, CodeQL, Codecov, SonarQube Cloud, security, maintenance, and OIDC trusted-release workflows.

[Unreleased]: https://github.com/Nick2bad4u/github-badge-layouts/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/Nick2bad4u/github-badge-layouts/releases/tag/v0.3.0
[0.2.0]: https://github.com/Nick2bad4u/github-badge-layouts/releases/tag/v0.2.0
[0.1.0]: https://www.npmjs.com/package/github-badge-layouts/v/0.1.0
