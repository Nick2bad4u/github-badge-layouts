# CLI reference

`github-badge-layouts` ships two equivalent executable names:

```sh
badge-layouts --help
github-badge-layouts --help
```

Use `npx github-badge-layouts` when you do not want a global installation.

## Repository defaults

Commands that render a layout default to:

| Value       | Default           |
| ----------- | ----------------- |
| Owner       | `Nick2bad4u`      |
| Repository  | `gh-runs-cleanup` |
| Branch      | `main`            |
| Badge style | `flat`            |

Override them with `--owner`, `--repo`, `--branch`, and `--style`.

## Discovery commands

### `list`

List layout IDs, categories, and titles.

```sh
badge-layouts list
badge-layouts list --category "Language-first repositories"
badge-layouts list --query release --limit 10
badge-layouts list --json
```

### `search <query>`

Search layout IDs, titles, categories, descriptions, placeholders, and template Markdown.

```sh
badge-layouts search powershell
badge-layouts search "visual studio" --json --limit 5
```

### `categories`

Print one category per line, or a JSON array with `--json`.

### `show <layout>`

Print a title, category, badge count, placeholders, and the unrendered template. A layout may be identified by exact ID, exact title, or an unambiguous partial match.

## Rendering commands

### `render <layout>`

Render a template with repository coordinates and repeated `--set NAME=VALUE` options.

```sh
badge-layouts render general-npm-package \
  --owner acme \
  --repo toolkit \
  --branch main \
  --style flat \
  --set PACKAGE=@acme/toolkit
```

Rendering fails when a known placeholder remains unresolved. Use `--allow-unresolved` only when deliberately producing a reusable template.

Values are trimmed, spaces become `%20`, and control characters plus Markdown-closing `)` and `]` delimiters are rejected. The CLI does not invent URL encoding for service-specific identifiers; supply the exact path value required by the upstream service.

Use `--copy` to invoke the native clipboard utility:

- Windows: `clip.exe`
- macOS: `pbcopy`
- Linux: `wl-copy`, `xclip`, or `xsel`

The command exits with code `1` and reports when no supported utility exists.

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

## Markdown utility commands

### `convert`

Convert all Badgen image hosts while preserving badge paths and link destinations:

```sh
badge-layouts convert --style classic --input README.md
badge-layouts convert "![Status](https://badgen.net/static/status/ok)" --style flat
```

### `inspect`

Report total badge images, flat/classic Badgen counts, other images, and known unresolved placeholders.

```sh
badge-layouts inspect --input README.md
badge-layouts inspect --input - --json
```

When `--input -` is used, or stdin is piped, the command reads UTF-8 Markdown from stdin. Positional Markdown takes precedence when supplied.

## Common options

| Option                      | Meaning                                                            |
| --------------------------- | ------------------------------------------------------------------ |
| `--allow-unresolved`        | Preserve missing known placeholders instead of failing.            |
| `--branch <name>`           | Set `BRANCH`.                                                      |
| `--copy`                    | Copy converted or rendered Markdown.                               |
| `--file <path>`             | Select a README for the `readme` command.                          |
| `--input <path or ->`       | Read Markdown from a UTF-8 file or stdin.                          |
| `--json`, `-j`              | Emit machine-readable JSON.                                        |
| `--limit <count>`           | Limit `list` or `search` results to a positive integer.            |
| `--owner <name>`            | Set `OWNER`.                                                       |
| `--repo <name>`             | Set `REPO`.                                                        |
| `--set NAME=VALUE`          | Set a custom placeholder; repeat as needed.                        |
| `--style <flat or classic>` | Select the Badgen host. `non-flat` is accepted as a classic alias. |
| `--write`                   | Apply a `readme` update. Preview remains the default.              |
| `--help`, `-h`              | Print command help.                                                |
| `--version`, `-v`           | Print the package version.                                         |

Successful commands exit with code `0`. Invalid input, unresolved placeholders, unsafe values, file failures, and unavailable clipboard tools write a concise error to stderr and exit with code `1`.
