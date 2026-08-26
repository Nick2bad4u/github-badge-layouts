# GitHub Pages app guidance

- Keep this a dependency-free, progressively enhanced static app. Prefer semantic HTML, CSS, and small browser-native modules over frameworks or runtime packages.
- `catalog.js` is generated. Change `library.md`, `data/providers.json`, or the generator instead.
- When a service host changes, update the exact-host CSP in `index.html` and the registry-driven preview checks together. Badge images must remain HTTPS, lazy-loaded, asynchronously decoded, low priority, and `no-referrer`.
- Preserve query-string state for shareable filters. New facets must work in combination, reset correctly, and have a focused `gallery-state` test.
- Use text plus color for service identity; never make color or a Nerd Font glyph the only label. Glyphs require a readable Unicode/text fallback.
- Check responsive layouts at desktop and mobile widths. Respect reduced motion, keyboard focus, labels, and live-region behavior.
- Validate with `npm run site:build`, `npm run lint:stylelint`, and `npm run typecheck`; use a real browser for material visual changes.
