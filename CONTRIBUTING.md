# Contributing

Thanks for improving the badge library.

## Add or update a layout

1. Edit `library.md`, the source of truth.
2. Put each copyable row in a fenced `md` block beneath a level-three heading.
3. Keep reusable values as descriptive uppercase placeholders such as `OWNER`, `REPO`, and `PACKAGE`.
4. Keep status, security, uptime, and coverage colors dynamic so failures cannot appear successful.
5. Run `npm run build` to regenerate the Pages catalog.
6. Run `npm run check` and preview `docs/` through a local HTTP server.

```powershell
npm run build
npm run check
python -m http.server 4173 --directory docs
```

Then open <http://localhost:4173>.

## Badge requirements

- Every image must use `https://flat.badgen.net`.
- Every badge must link to the exact project, registry, report, workflow, issue list, or license it describes.
- Use sentence-style alternative text ending with a period.
- Preview upstream-dependent badges before keeping them; an HTTP 200 response can still contain an error badge.
- Never publish an account-wide monitoring key, access token, or other secret. UptimeRobot layouts accept only monitor-specific read-only keys.
