# GitHub badge layouts

[![Open the interactive badge gallery.](https://flat.badgen.net/static/preview/GitHub%20Pages/0E7490)](https://nick2bad4u.github.io/github-badge-layouts/) [![Library license: MIT.](https://flat.badgen.net/static/license/MIT/4338CA)](LICENSE)

A curated library of copy-ready [Badgen](https://badgen.net/) badge combinations for GitHub projects, package registries, editor extensions, containers, apps, and community metadata.

## [Open the interactive gallery](https://nick2bad4u.github.io/github-badge-layouts/)

The gallery makes the library easier to use:

- Search and filter all 52 layouts by project type or ecosystem.
- Preview every badge row with safe example identifiers.
- Replace a layout's placeholders in place without changing the source template.
- Copy the resulting Markdown with one click.
- Jump from any card to its canonical source in [`library.md`](library.md).

Example previews use public projects and packages. Copied Markdown keeps uppercase placeholders until you replace them, so example identifiers are not accidentally pasted into another project.

## Use a layout

1. Open the gallery and find the closest project type.
2. Expand **Customize placeholders**.
3. Fill in values such as `OWNER`, `REPO`, `BRANCH`, or `PACKAGE`.
4. Check that every preview is meaningful for the target project.
5. Select **Copy Markdown** and paste the row into the project's README.
6. Remove badges for services the project does not actually use.

The customizer trims values and encodes spaces as `%20`. Encode any other special path characters required by the target service.

The complete prose guide, color system, placeholder reference, personalized layouts, conditional-badge warnings, and final quality checklist remain in [`library.md`](library.md).

## Maintain the catalog

The site has no runtime dependencies or framework. A small Node.js script parses every fenced `md` layout in the library and generates the checked-in Pages data file.

```powershell
npm run build
npm run check
python -m http.server 4173 --directory docs
```

Then open <http://localhost:4173>. See [CONTRIBUTING.md](CONTRIBUTING.md) for the layout contract and badge-quality rules.

## Project structure

```text
library.md             Canonical Markdown library
scripts/build-site.mjs Parser, validator, and catalog generator
docs/                  Dependency-free GitHub Pages site
```

## Third-party services

Badge images are requested from `flat.badgen.net`; clicking a badge opens the relevant third-party project or service. Badgen and the upstream services are not affiliated with this repository. Review their availability and privacy policies before using them in a project.

## License

[MIT](LICENSE)
