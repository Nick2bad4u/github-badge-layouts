# CLI reference

`github-badge-layouts` ships two equivalent executable names:

```sh
badge-layouts --help
github-badge-layouts --help
```

Use `npx github-badge-layouts` when you do not want a global installation. The CLI has no runtime package dependencies and requires Node.js 22.14 or newer.

## Start with discovery

The default human-readable output uses aligned tables, headings, hints, and ANSI styling when stdout is an interactive terminal. Redirected output stays plain. Use `--color always`, `--color never`, `--no-color`, or the standard `NO_COLOR` environment variable to override detection.

### `list`

Browse layout IDs, titles, language facets, services, categories, and badge counts.

```sh
badge-layouts list
badge-layouts list --category "Language-first repositories"
badge-layouts list --language Rust
badge-layouts list --service Shields.io
badge-layouts list --query release --limit 10
badge-layouts list --json
```

`--category`, `--language`, and `--service` are exact, case-insensitive facets. A service accepts its ID or display name. `--query` also searches service metadata.

### `search <query>`

`search` is the query-first form of `list` and accepts the same filters.

```sh
badge-layouts search powershell
badge-layouts search package --language TypeScript --limit 5
badge-layouts search "visual studio" --json
```

`find` is an alias for `search`; `ls` is an alias for `list`.

### `categories`, `languages`, and `services`

Print facets with layout counts. `--json` preserves the simple string-array interface for scripts.

```sh
badge-layouts categories
badge-layouts languages
badge-layouts languages --json
badge-layouts services
badge-layouts services --json
```

`Language agnostic` identifies reusable layouts that do not assume an implementation language. Multi-language layouts appear under every applicable language filter.

### `show <layout>`

Print the canonical ID, category, languages, services, badge count, placeholders, source line, description, and unresolved template. A layout may be identified by exact ID, exact title, or an unambiguous partial match.

```sh
badge-layouts show rust-crate
badge-layouts show general-npm-package --json
```

## Terminal previews

### `preview <layout>`

The default ANSI renderer creates readable colored terminal badges without making network requests. It represents each SVG as a compact text badge and therefore works in terminals that cannot display remote SVG images.

```sh
badge-layouts preview balanced-public-repository
badge-layouts preview general-npm-package --set PACKAGE=eslint
badge-layouts preview general-npm-package --set PACKAGE=eslint --color always
```

Add `--live` to fetch each rendered SVG from its registered service and use its accessible title or label. This shows current versions, download totals, build states, coverage, licenses, and upstream error text instead of trusting HTTP status alone.

```sh
badge-layouts preview bundle-conscious-npm-library \
  --set PACKAGE=react \
  --live
```

Live requests use exact registered HTTPS hosts, validate redirect destinations against the same service, require bounded SVG responses, run concurrently, and have per-request timeouts. Failed or suspicious labels such as `unknown`, `error`, `429`, `500`, `timeout`, or `discontinued` are rendered as warnings.

### Glow integration

[Glow](https://github.com/charmbracelet/glow) is optional. The CLI converts a layout into a clean linked Markdown summary and passes it to Glow over stdin:

```sh
badge-layouts preview balanced-public-repository --glow
badge-layouts preview general-npm-package --set PACKAGE=eslint --glow --live
badge-layouts preview rust-crate --renderer glow --width 80
```

Glow formats Markdown; it does not rasterize remote SVG badge pixels. The generated summary therefore uses badge labels as links rather than exposing noisy image URLs. If Glow is missing, the CLI reports the Windows `winget` installation command and points back to the built-in ANSI renderer.

`view` is an alias for `preview`.

## Repository context

Rendering commands detect `OWNER` and `REPO` from the current GitHub `remote.origin.url`. The branch comes from `origin/HEAD`, then the current branch, then `main`. Explicit `--owner`, `--repo`, and `--branch` values always win.

```sh
badge-layouts context
badge-layouts context --json
```

Outside a GitHub checkout, pass the missing coordinates explicitly. The CLI no longer silently renders another maintainer's repository defaults.

## Rendering commands

### `render <layout>`

Render a template with detected or explicit repository coordinates and repeated `--set NAME=VALUE` options.

```sh
badge-layouts render general-npm-package \
  --owner acme \
  --repo toolkit \
  --branch main \
  --style flat \
  --set PACKAGE=@acme/toolkit
```

Rendering fails when a known placeholder remains unresolved. Use `--allow-unresolved` only when deliberately producing a reusable template.

Values are trimmed, spaces become `%20`, and control characters plus Markdown-closing `)` and `]` delimiters are rejected. Supply the exact path value required by each upstream service.

Write to a file or the native clipboard without contaminating stdout:

```sh
badge-layouts render rust-crate --set CRATE=serde --output badges.md
badge-layouts render general-npm-package --set PACKAGE=eslint --copy
```

Clipboard utilities are `clip.exe` on Windows, `pbcopy` on macOS, and `wl-copy`, `xclip`, or `xsel` on Linux. A missing utility produces a nonzero exit.

### `readme <layout>`

Preview a managed badge block by default:

```sh
badge-layouts readme balanced-public-repository --file README.md
```

Apply it only after review:

```sh
badge-layouts readme balanced-public-repository --file README.md --write
```

The writer inserts a block after the first level-one heading or replaces the existing block. It rejects missing, reversed, or incomplete marker pairs and does not modify content outside:

```md
<!-- github-badge-layouts:start -->
<!-- github-badge-layouts:end -->
```

## Markdown utilities

### `convert`

Convert all Badgen image hosts while preserving badge paths and destinations:

```sh
badge-layouts convert --style classic --input README.md
badge-layouts convert --style flat --input badges.md --output flat-badges.md
badge-layouts convert "![Status](https://badgen.net/static/status/ok)" --style flat
```

### `inspect`

Report total badge images, per-service counts, flat/classic Badgen counts, unknown images, and known unresolved placeholders.

```sh
badge-layouts inspect --input README.md
badge-layouts inspect --input - --json
```

When `--input -` is used, or stdin is piped, the command reads UTF-8 Markdown from stdin. Positional Markdown takes precedence when supplied. Use `--` before positional Markdown that begins with dashes.

## Common options

| Option                      | Meaning                                                     |
| --------------------------- | ----------------------------------------------------------- |
| `--allow-unresolved`        | Preserve missing known placeholders instead of failing.     |
| `--branch <name>`           | Override the detected `BRANCH`.                             |
| `--category <name>`         | Filter `list` or `search` by exact category.                |
| `--color <mode>`            | Set ANSI policy to `auto`, `always`, or `never`.            |
| `--no-color`                | Alias for `--color never`.                                  |
| `--copy`                    | Copy converted or rendered Markdown.                        |
| `--file <path>`             | Select a README for `readme`.                               |
| `--input <path or ->`       | Read Markdown from a UTF-8 file or stdin.                   |
| `--json`, `-j`              | Emit machine-readable JSON without ANSI sequences.          |
| `--language <name>`         | Filter `list` or `search` by exact language facet.          |
| `--limit <count>`           | Limit `list` or `search` results to a positive integer.     |
| `--output <path>`           | Write `render` or `convert` text to a file.                 |
| `--owner <name>`            | Override the Git-detected `OWNER`.                          |
| `--repo <name>`             | Override the Git-detected `REPO`.                           |
| `--service <name>`          | Filter `list` or `search` by service ID or display name.    |
| `--set NAME=VALUE`          | Set a custom placeholder; repeat as needed.                 |
| `--style <flat or classic>` | Select the Badgen host; `non-flat` remains a classic alias. |
| `--write`                   | Apply a `readme` update; preview remains the default.       |
| `--help`, `-h`              | Print general or command-specific help.                     |
| `--version`, `-v`           | Print the package version.                                  |

The parser rejects options that do not apply to the selected command. Successful commands exit with code `0`. Invalid input, unresolved placeholders, unsafe values, file failures, and unavailable clipboard or Glow tools produce concise diagnostics and a nonzero status. Individual live-preview request failures remain visible as per-badge warnings so one unavailable provider does not hide the rest of the layout.
