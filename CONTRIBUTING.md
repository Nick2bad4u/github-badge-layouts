# Contributing

Thanks for improving the badge library.

## Add or update a layout

1. Edit `library.md`, the source of truth.
2. Put each copyable row in a fenced `md` block beneath a level-three heading.
3. Add exactly one `<!-- languages: ... -->` annotation between the heading and its fenced layout. Use comma-separated language names or `Language agnostic`; multi-language layouts are indexed under every value.
4. Keep reusable values as descriptive uppercase placeholders such as `OWNER`, `REPO`, and `PACKAGE`.
5. Keep status, security, uptime, and coverage colors dynamic so failures cannot appear successful.
6. Run `npm run build` to regenerate the Pages and package catalogs.
7. Add or update focused tests when parser, renderer, CLI, or browser behavior changes.
8. Run the full validation suite and preview the Vite-powered site locally.

   ```powershell
   npm run build
   npm run validate
   npm run test:coverage
   npm run site:dev
   ```

Then open the URL printed by Vite.

## Badge requirements

- Every image must use an exact HTTPS host registered in `data/providers.json`. Add provider metadata and delivery hosts there before adding a new service.
- Use flat Badgen URLs for Badgen layouts and do not add duplicate classic rows. The gallery and CLI convert Badgen hosts on demand; other providers remain unchanged.
- Every badge must link to the exact project, registry, report, workflow, issue list, or license it describes.
- Use sentence-style alternative text ending with a period.
- Preview upstream-dependent badges before keeping them; an HTTP 200 response can still contain an error badge.
- Reject live SVG titles containing `429`, `500`, `error`, `unknown`, `undefined`, `timeout`, or `discontinued` unless the layout is explicitly documenting a conditional endpoint.
- Never publish an account-wide monitoring key, access token, or other secret. UptimeRobot layouts accept only monitor-specific read-only keys.

## Generated files

`library.md` and `data/providers.json` are the catalog sources. `docs/catalog.js` and `src/generated/catalog.ts` are generated together by `npm run build:catalog`; do not hand-edit either file. The check gate fails when generated output is stale.

## Package and site changes

- Keep the browser application dependency-free unless a concrete requirement justifies a runtime dependency.
- Preserve pagination's request boundary: only layouts on the current page may create badge-image elements.
- Keep the public API ESM-only and run `npm run lint:package-surface` after changing exports or declarations.
- Preview README writes before using `--write`, and keep all mutations inside the managed markers.
- Follow [RELEASING.md](docs/RELEASING.md) for npm bootstrap and trusted releases.
