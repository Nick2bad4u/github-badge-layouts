# Repository guidance

- Treat `library.md` as the canonical badge-layout source.
- Run `npm run build` after changing the library. Do not edit `docs/catalog.js` by hand.
- Run `npm run check` before committing.
- Keep the site dependency-free unless a concrete requirement justifies a dependency.
- Preserve uppercase placeholders in reusable layouts and never commit account-wide API keys or other secrets.
- Use branch names in the form `type/description` and focused conventional commits.
