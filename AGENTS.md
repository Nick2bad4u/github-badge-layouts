# Repository guidance

## Project shape

- `library.md` is the canonical layout source. `data/providers.json` is the canonical badge-service registry.
- `scripts/build-site.mjs` deterministically generates `docs/catalog.js` and `src/generated/catalog.ts`. Never hand-edit generated catalogs.
- `src/` contains the dependency-free TypeScript API and CLI. `docs/` is the dependency-free GitHub Pages app.
- Preserve uppercase placeholders exactly. A reusable layout must not contain personal tokens, secrets, or credentials.

## Change rules

- Register every badge image host before using it. Accept only exact HTTPS hosts; do not weaken checks to suffix, substring, wildcard, or arbitrary redirect matching.
- Keep service IDs stable and lowercase. User-facing controls call providers “services.” Badgen flat/classic conversion applies only to Badgen URLs.
- When adding layouts, include the language annotation, sentence-style alt text, and a short caveat for account-configured or potentially unavailable services.
- Keep changes focused and follow existing ESM, strict TypeScript, native browser, and accessible-markup conventions. Do not add a runtime or site dependency without a concrete requirement.
- Use branches named `type/description` and focused conventional commits. Do not publish, release, merge, or deploy without explicit authorization for that action.

## Validation

- Catalog or provider change: `npm run build:catalog`, then inspect generated totals and diffs.
- Code or site change: `npm run typecheck` and the focused Vitest files while iterating.
- Finished change: `npm run validate`. For release-candidate work, also run `npm run lint:package-surface` and `npm run pack:check`.
- Do not “fix” failures by reducing lint, type, coverage, CSP, or preview-security gates.

More specific instructions apply under `docs/` and `scripts/`.
