# Contributing

Thanks for improving the badge library.

## Add or update a layout

1. Edit `library.md`, the source of truth.
2. Put each copyable row in a fenced `md` block beneath a level-three heading.
3. Keep reusable values as descriptive uppercase placeholders such as `OWNER`, `REPO`, and `PACKAGE`.
4. Keep status, security, uptime, and coverage colors dynamic so failures cannot appear successful.
5. Run `npm run build` to regenerate the Pages catalog.
6. Add or update focused tests when parser, renderer, CLI, or browser behavior changes.
7. Run the full validation suite and preview the Vite-powered site locally.

   ```powershell
   npm run build
   npm run validate
   npm run test:coverage
   npm run site:dev
   ```

Then open the URL printed by Vite.

## Badge requirements

- Every image must use `https://flat.badgen.net`.
- Do not add duplicate classic rows. The gallery and CLI convert the canonical flat URL to classic Badgen on demand.
- Every badge must link to the exact project, registry, report, workflow, issue list, or license it describes.
- Use sentence-style alternative text ending with a period.
- Preview upstream-dependent badges before keeping them; an HTTP 200 response can still contain an error badge.
- Never publish an account-wide monitoring key, access token, or other secret. UptimeRobot layouts accept only monitor-specific read-only keys.

## Generated files

`library.md` is the only catalog source. `docs/catalog.js` and `src/generated/catalog.ts` are generated together by `npm run build:catalog`; do not hand-edit either file. The check gate fails when generated output is stale.

## Package and site changes

- Keep the browser application dependency-free unless a concrete requirement justifies a runtime dependency.
- Preserve pagination's request boundary: only layouts on the current page may create badge-image elements.
- Keep the public API ESM-only and run `npm run lint:package-surface` after changing exports or declarations.
- Preview README writes before using `--write`, and keep all mutations inside the managed markers.
- Follow [RELEASING.md](docs/RELEASING.md) for npm bootstrap and trusted releases.
