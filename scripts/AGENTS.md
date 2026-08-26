# Generator guidance

- `build-site.mjs` is the single deterministic compiler for `library.md` and `data/providers.json`.
- Fail closed on malformed Markdown, duplicate service IDs or hosts, unregistered image hosts, insecure URLs, missing annotations, count drift, and generated-output drift.
- Match service hosts exactly after URL parsing. Canonical image hosts identify a service; delivery hosts are allowed only for that service's validated redirects or rendered assets.
- Keep the generated browser and TypeScript catalogs semantically identical and stable across repeated runs. Do not include timestamps or machine-specific paths.
- Add or update generator/catalog tests when parser behavior changes. Run `npm run build:catalog`, `node scripts/build-site.mjs --check`, and `npm run typecheck` before handoff.
