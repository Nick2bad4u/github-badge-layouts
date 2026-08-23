# Flat Badgen badge-combo library

Copy a row, replace its uppercase placeholders, and remove any badge whose service you do not actually use. Every image URL uses `flat.badgen.net`; every click target goes to the underlying project, registry, report, or workflow rather than to the badge image.

This library was built against Badgen's current official generator catalog and spot-checked against live SVG responses on 2026-08-22.

## Styling system

The rows use one stable color vocabulary. Colors are intentionally dark enough for readable white badge text and normally do not repeat within a row.

| Meaning                           | Hex      | Tone                                           |
| --------------------------------- | -------- | ---------------------------------------------- |
| Version or release                | `0E7490` | cyan                                           |
| Downloads or adoption             | `BE185D` | pink                                           |
| Stars, likes, or rating           | `B45309` | amber                                          |
| Forks, assets, or size            | `C2410C` | orange                                         |
| Health or funding                 | `047857` | emerald                                        |
| Runtime compatibility             | `4D7C0F` | lime                                           |
| Platform or bundled types         | `6D28D9` | violet                                         |
| Contributors or secondary channel | `7E22CE` | purple                                         |
| Dependents or ecosystem reach     | `0F766E` | teal                                           |
| Coverage                          | dynamic  | Badgen keeps the meaningful threshold color    |
| Checks, uptime, or security       | dynamic  | Badgen keeps success/warning/failure semantics |
| Issues or risk                    | `B91C1C` | red                                            |
| License                           | `4338CA` | indigo                                         |
| Activity or footprint             | `475569` | slate                                          |

Do not force `?color=green` onto checks, security, uptime, or coverage badges. A failed build should not remain green just because the README hard-coded it.

## Placeholder guide

| Placeholder                                   | Replace with                                                                   |
| --------------------------------------------- | ------------------------------------------------------------------------------ |
| `OWNER` / `REPO`                              | GitHub owner and repository                                                    |
| `BRANCH`                                      | Default branch, usually `main`                                                 |
| `PACKAGE`                                     | Registry package name; scoped npm names such as `@scope/package` are supported |
| `DOCKER_SCOPE` / `IMAGE` / `TAG` / `ARCH`     | Docker Hub coordinates, such as `library/ubuntu/latest/amd64`                  |
| `CRATE`, `GEM`, `POD`, `FORMULA`, and similar | The package's registry identifier                                              |
| `PUBLISHER.EXTENSION`                         | Visual Studio Marketplace identifier                                           |
| `NAMESPACE` / `EXTENSION`                     | Open VSX namespace and extension                                               |
| `EXTENSION_ID`                                | Chrome or Edge store extension ID                                              |
| `ADDON_SLUG`                                  | Firefox Add-ons slug                                                           |
| `UPTIME_ROBOT_MONITOR_KEY`                    | A monitor-specific read-only key, never the account-wide API key               |

URL-encode spaces and special characters in path segments. If your default branch is not `main`, replace it everywhere—including badge URLs and destination links.

## Personalized upgrades

### `Nick2bad4u/gh-runs-cleanup`

This fixes the status-color problem in the original row and adds release-asset adoption without turning the row into a wall of counters.

[![Latest stable GitHub release.](https://flat.badgen.net/github/release/Nick2bad4u/gh-runs-cleanup/stable?color=0E7490)](https://github.com/Nick2bad4u/gh-runs-cleanup/releases/latest) [![GitHub Actions checks on main.](https://flat.badgen.net/github/checks/Nick2bad4u/gh-runs-cleanup/main)](https://github.com/Nick2bad4u/gh-runs-cleanup/actions) [![Downloads of assets from the latest release.](https://flat.badgen.net/github/assets-dl/Nick2bad4u/gh-runs-cleanup?color=7E22CE)](https://github.com/Nick2bad4u/gh-runs-cleanup/releases/latest) [![GitHub stars.](https://flat.badgen.net/github/stars/Nick2bad4u/gh-runs-cleanup?color=B45309)](https://github.com/Nick2bad4u/gh-runs-cleanup/stargazers) [![GitHub forks.](https://flat.badgen.net/github/forks/Nick2bad4u/gh-runs-cleanup?color=C2410C)](https://github.com/Nick2bad4u/gh-runs-cleanup/forks) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/Nick2bad4u/gh-runs-cleanup?color=B91C1C)](https://github.com/Nick2bad4u/gh-runs-cleanup/issues) [![GitHub license.](https://flat.badgen.net/github/license/Nick2bad4u/gh-runs-cleanup?color=4338CA)](https://github.com/Nick2bad4u/gh-runs-cleanup/blob/main/LICENSE)

```md
[![Latest stable GitHub release.](https://flat.badgen.net/github/release/Nick2bad4u/gh-runs-cleanup/stable?color=0E7490)](https://github.com/Nick2bad4u/gh-runs-cleanup/releases/latest) [![GitHub Actions checks on main.](https://flat.badgen.net/github/checks/Nick2bad4u/gh-runs-cleanup/main)](https://github.com/Nick2bad4u/gh-runs-cleanup/actions) [![Downloads of assets from the latest release.](https://flat.badgen.net/github/assets-dl/Nick2bad4u/gh-runs-cleanup?color=7E22CE)](https://github.com/Nick2bad4u/gh-runs-cleanup/releases/latest) [![GitHub stars.](https://flat.badgen.net/github/stars/Nick2bad4u/gh-runs-cleanup?color=B45309)](https://github.com/Nick2bad4u/gh-runs-cleanup/stargazers) [![GitHub forks.](https://flat.badgen.net/github/forks/Nick2bad4u/gh-runs-cleanup?color=C2410C)](https://github.com/Nick2bad4u/gh-runs-cleanup/forks) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/Nick2bad4u/gh-runs-cleanup?color=B91C1C)](https://github.com/Nick2bad4u/gh-runs-cleanup/issues) [![GitHub license.](https://flat.badgen.net/github/license/Nick2bad4u/gh-runs-cleanup?color=4338CA)](https://github.com/Nick2bad4u/gh-runs-cleanup/blob/main/LICENSE)
```

### `Nick2bad4u/eslint-plugin-typefest`

This fixes the copied `Repo Checks` URL, which pointed at `codex-terminal-themes`, and adds package compatibility signals that are more useful than forks alone.

[![Latest npm version.](https://flat.badgen.net/npm/v/eslint-plugin-typefest?color=0E7490)](https://www.npmjs.com/package/eslint-plugin-typefest) [![Monthly npm downloads.](https://flat.badgen.net/npm/dm/eslint-plugin-typefest?color=BE185D)](https://www.npmjs.com/package/eslint-plugin-typefest) [![Supported Node.js versions.](https://flat.badgen.net/npm/node/eslint-plugin-typefest?color=4D7C0F)](https://www.npmjs.com/package/eslint-plugin-typefest) [![Bundled TypeScript declarations.](https://flat.badgen.net/npm/types/eslint-plugin-typefest?color=6D28D9)](https://www.npmjs.com/package/eslint-plugin-typefest) [![Package dependents.](https://flat.badgen.net/github/dependents-pkg/Nick2bad4u/eslint-plugin-typefest?color=0F766E)](https://github.com/Nick2bad4u/eslint-plugin-typefest/network/dependents) [![Codecov coverage.](https://flat.badgen.net/codecov/github/Nick2bad4u/eslint-plugin-typefest)](https://codecov.io/gh/Nick2bad4u/eslint-plugin-typefest) [![GitHub Actions checks on main.](https://flat.badgen.net/github/checks/Nick2bad4u/eslint-plugin-typefest/main)](https://github.com/Nick2bad4u/eslint-plugin-typefest/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/Nick2bad4u/eslint-plugin-typefest?color=B45309)](https://github.com/Nick2bad4u/eslint-plugin-typefest/stargazers) [![NPM license.](https://flat.badgen.net/npm/license/eslint-plugin-typefest?color=4338CA)](https://github.com/Nick2bad4u/eslint-plugin-typefest/blob/main/LICENSE)

```md
[![Latest npm version.](https://flat.badgen.net/npm/v/eslint-plugin-typefest?color=0E7490)](https://www.npmjs.com/package/eslint-plugin-typefest) [![Monthly npm downloads.](https://flat.badgen.net/npm/dm/eslint-plugin-typefest?color=BE185D)](https://www.npmjs.com/package/eslint-plugin-typefest) [![Supported Node.js versions.](https://flat.badgen.net/npm/node/eslint-plugin-typefest?color=4D7C0F)](https://www.npmjs.com/package/eslint-plugin-typefest) [![Bundled TypeScript declarations.](https://flat.badgen.net/npm/types/eslint-plugin-typefest?color=6D28D9)](https://www.npmjs.com/package/eslint-plugin-typefest) [![Package dependents.](https://flat.badgen.net/github/dependents-pkg/Nick2bad4u/eslint-plugin-typefest?color=0F766E)](https://github.com/Nick2bad4u/eslint-plugin-typefest/network/dependents) [![Codecov coverage.](https://flat.badgen.net/codecov/github/Nick2bad4u/eslint-plugin-typefest)](https://codecov.io/gh/Nick2bad4u/eslint-plugin-typefest) [![GitHub Actions checks on main.](https://flat.badgen.net/github/checks/Nick2bad4u/eslint-plugin-typefest/main)](https://github.com/Nick2bad4u/eslint-plugin-typefest/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/Nick2bad4u/eslint-plugin-typefest?color=B45309)](https://github.com/Nick2bad4u/eslint-plugin-typefest/stargazers) [![NPM license.](https://flat.badgen.net/npm/license/eslint-plugin-typefest?color=4338CA)](https://github.com/Nick2bad4u/eslint-plugin-typefest/blob/main/LICENSE)
```

## GitHub-hosted projects

### Balanced public repository

```md
[![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub forks.](https://flat.badgen.net/github/forks/OWNER/REPO?color=C2410C)](https://github.com/OWNER/REPO/forks) [![GitHub contributors.](https://flat.badgen.net/github/contributors/OWNER/REPO?color=7E22CE)](https://github.com/OWNER/REPO/graphs/contributors) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Release-driven binary or desktop app

```md
[![Latest stable release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Latest release asset downloads.](https://flat.badgen.net/github/assets-dl/OWNER/REPO?color=BE185D)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Last GitHub commit.](https://flat.badgen.net/github/last-commit/OWNER/REPO/BRANCH?color=475569)](https://github.com/OWNER/REPO/commits/BRANCH) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### GitHub Action

Replace `ACTION_SLUG` with the Marketplace action slug. Keep the checks badge dynamic so a broken action does not advertise itself as passing.

```md
[![Project type: GitHub Action.](https://flat.badgen.net/static/type/GitHub%20Action/6D28D9)](https://github.com/marketplace/actions/ACTION_SLUG) [![Latest stable release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Documentation site or static site

```md
[![Site deployment checks.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Last content update.](https://flat.badgen.net/github/last-commit/OWNER/REPO/BRANCH?color=475569)](https://github.com/OWNER/REPO/commits/BRANCH) [![Documentation contributors.](https://flat.badgen.net/github/contributors/OWNER/REPO?color=7E22CE)](https://github.com/OWNER/REPO/graphs/contributors) [![Open documentation issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![Documentation license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Monorepo

```md
[![Latest stable monorepo release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Monorepo checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub contributors.](https://flat.badgen.net/github/contributors/OWNER/REPO?color=7E22CE)](https://github.com/OWNER/REPO/graphs/contributors) [![GitHub open pull requests.](https://flat.badgen.net/github/open-prs/OWNER/REPO?color=0369A1)](https://github.com/OWNER/REPO/pulls) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![Repository dependents.](https://flat.badgen.net/github/dependents-repo/OWNER/REPO?color=0F766E)](https://github.com/OWNER/REPO/network/dependents) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### API, bot, or hosted service

UptimeRobot badges require a monitor-specific read-only key. The key is meant to identify that public monitor; never put an account-wide API key in a README.

```md
[![Latest stable service release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Service checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Current service status.](https://flat.badgen.net/uptime-robot/status/UPTIME_ROBOT_MONITOR_KEY)](https://status.example.com) [![Service uptime over the past month.](https://flat.badgen.net/uptime-robot/month/UPTIME_ROBOT_MONITOR_KEY)](https://status.example.com) [![Latest service response time.](https://flat.badgen.net/uptime-robot/response/UPTIME_ROBOT_MONITOR_KEY)](https://status.example.com) [![Open service issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Community-funded open source

```md
[![Latest stable release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub contributors.](https://flat.badgen.net/github/contributors/OWNER/REPO?color=7E22CE)](https://github.com/OWNER/REPO/graphs/contributors) [![Open Collective backers.](https://flat.badgen.net/opencollective/backers/COLLECTIVE?color=BE185D)](https://opencollective.com/COLLECTIVE) [![Open Collective balance.](https://flat.badgen.net/opencollective/balance/COLLECTIVE?color=047857)](https://opencollective.com/COLLECTIVE) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Security- and quality-focused project

Use the Snyk badge only if the project is actually monitored by Snyk. Replace `SNYK_ORG` and `SNYK_PROJECT_ID` so the click opens the exact report rather than a generic security landing page.

```md
[![Latest stable release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Codecov coverage.](https://flat.badgen.net/codecov/github/OWNER/REPO/BRANCH)](https://codecov.io/gh/OWNER/REPO/branch/BRANCH) [![Snyk vulnerability status.](https://flat.badgen.net/snyk/OWNER/REPO/BRANCH)](https://app.snyk.io/org/SNYK_ORG/project/SNYK_PROJECT_ID) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### GitLab project

Badgen's GitLab release and license integrations currently return upstream errors for some live projects, so this row deliberately uses the healthy social and contribution endpoints.

```md
[![GitLab stars.](https://flat.badgen.net/gitlab/stars/GITLAB_NAMESPACE/REPO?color=B45309)](https://gitlab.com/GITLAB_NAMESPACE/REPO/-/starrers) [![GitLab forks.](https://flat.badgen.net/gitlab/forks/GITLAB_NAMESPACE/REPO?color=C2410C)](https://gitlab.com/GITLAB_NAMESPACE/REPO/-/forks) [![GitLab open issues.](https://flat.badgen.net/gitlab/open-issues/GITLAB_NAMESPACE/REPO?color=B91C1C)](https://gitlab.com/GITLAB_NAMESPACE/REPO/-/issues) [![GitLab merged merge requests.](https://flat.badgen.net/gitlab/merged-mrs/GITLAB_NAMESPACE/REPO?color=0F766E)](https://gitlab.com/GITLAB_NAMESPACE/REPO/-/merge_requests?scope=all&state=merged) [![GitLab contributors.](https://flat.badgen.net/gitlab/contributors/GITLAB_NAMESPACE/REPO?color=7E22CE)](https://gitlab.com/GITLAB_NAMESPACE/REPO/-/graphs/BRANCH)
```

## JavaScript and TypeScript

### General npm package

```md
[![Latest npm version.](https://flat.badgen.net/npm/v/PACKAGE?color=0E7490)](https://www.npmjs.com/package/PACKAGE) [![Monthly npm downloads.](https://flat.badgen.net/npm/dm/PACKAGE?color=BE185D)](https://www.npmjs.com/package/PACKAGE) [![Supported Node.js versions.](https://flat.badgen.net/npm/node/PACKAGE?color=4D7C0F)](https://www.npmjs.com/package/PACKAGE) [![TypeScript declaration status.](https://flat.badgen.net/npm/types/PACKAGE?color=6D28D9)](https://www.npmjs.com/package/PACKAGE) [![Package dependents.](https://flat.badgen.net/github/dependents-pkg/OWNER/REPO?color=0F766E)](https://github.com/OWNER/REPO/network/dependents) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![NPM license.](https://flat.badgen.net/npm/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### TypeScript library with coverage

```md
[![Latest npm version.](https://flat.badgen.net/npm/v/PACKAGE?color=0E7490)](https://www.npmjs.com/package/PACKAGE) [![Monthly npm downloads.](https://flat.badgen.net/npm/dm/PACKAGE?color=BE185D)](https://www.npmjs.com/package/PACKAGE) [![Supported Node.js versions.](https://flat.badgen.net/npm/node/PACKAGE?color=4D7C0F)](https://www.npmjs.com/package/PACKAGE) [![Bundled TypeScript declarations.](https://flat.badgen.net/npm/types/PACKAGE?color=6D28D9)](https://www.npmjs.com/package/PACKAGE) [![Codecov coverage.](https://flat.badgen.net/codecov/github/OWNER/REPO/BRANCH)](https://codecov.io/gh/OWNER/REPO/branch/BRANCH) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![NPM license.](https://flat.badgen.net/npm/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Browser-first npm library or CDN package

BundleJS and Packagephobia depend on successfully analyzing the package. Preview both badges before committing them.

```md
[![Latest npm version.](https://flat.badgen.net/npm/v/PACKAGE?color=0E7490)](https://www.npmjs.com/package/PACKAGE) [![Monthly jsDelivr hits.](https://flat.badgen.net/jsdelivr/hits/npm/PACKAGE?color=BE185D)](https://www.jsdelivr.com/package/npm/PACKAGE) [![Minified and gzipped bundle size.](https://flat.badgen.net/bundlejs/minzip/PACKAGE?color=C2410C)](https://bundlejs.com/?q=PACKAGE) [![Published package size.](https://flat.badgen.net/packagephobia/publish/PACKAGE?color=475569)](https://packagephobia.com/result?p=PACKAGE) [![Bundled TypeScript declarations.](https://flat.badgen.net/npm/types/PACKAGE?color=6D28D9)](https://www.npmjs.com/package/PACKAGE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![NPM license.](https://flat.badgen.net/npm/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### npm CLI

```md
[![Latest npm CLI version.](https://flat.badgen.net/npm/v/PACKAGE?color=0E7490)](https://www.npmjs.com/package/PACKAGE) [![Monthly npm downloads.](https://flat.badgen.net/npm/dm/PACKAGE?color=BE185D)](https://www.npmjs.com/package/PACKAGE) [![Supported Node.js versions.](https://flat.badgen.net/npm/node/PACKAGE?color=4D7C0F)](https://www.npmjs.com/package/PACKAGE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=7E22CE)](https://github.com/OWNER/REPO/releases/latest) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![NPM license.](https://flat.badgen.net/npm/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### ESLint, Prettier, Stylelint, remark, or TypeDoc plugin

Use the same strong signal order for tooling plugins. If the package is JavaScript-only, remove the TypeScript declarations badge. `TOOL_NAME` is display text such as `ESLint plugin` or `TypeDoc plugin`.

```md
[![Project type: TOOL_NAME.](https://flat.badgen.net/static/type/TOOL_NAME/A21CAF)](https://github.com/OWNER/REPO) [![Latest npm version.](https://flat.badgen.net/npm/v/PACKAGE?color=0E7490)](https://www.npmjs.com/package/PACKAGE) [![Monthly npm downloads.](https://flat.badgen.net/npm/dm/PACKAGE?color=BE185D)](https://www.npmjs.com/package/PACKAGE) [![Supported Node.js versions.](https://flat.badgen.net/npm/node/PACKAGE?color=4D7C0F)](https://www.npmjs.com/package/PACKAGE) [![TypeScript declaration status.](https://flat.badgen.net/npm/types/PACKAGE?color=6D28D9)](https://www.npmjs.com/package/PACKAGE) [![Codecov coverage.](https://flat.badgen.net/codecov/github/OWNER/REPO/BRANCH)](https://codecov.io/gh/OWNER/REPO/branch/BRANCH) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![NPM license.](https://flat.badgen.net/npm/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

## Containers, infrastructure, and unsupported registries

### Docker image

```md
[![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Docker Hub pulls.](https://flat.badgen.net/docker/pulls/DOCKER_SCOPE/IMAGE?color=BE185D)](https://hub.docker.com/r/DOCKER_SCOPE/IMAGE) [![Docker Hub stars.](https://flat.badgen.net/docker/stars/DOCKER_SCOPE/IMAGE?color=B45309)](https://hub.docker.com/r/DOCKER_SCOPE/IMAGE) [![Docker image size for TAG on ARCH.](https://flat.badgen.net/docker/size/DOCKER_SCOPE/IMAGE/TAG/ARCH?color=C2410C)](https://hub.docker.com/r/DOCKER_SCOPE/IMAGE/tags) [![Docker image layers for TAG on ARCH.](https://flat.badgen.net/docker/layers/DOCKER_SCOPE/IMAGE/TAG/ARCH?color=7E22CE)](https://hub.docker.com/r/DOCKER_SCOPE/IMAGE/tags) [![Container checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Go module

Badgen has no first-party Go module proxy generator, so use dynamic GitHub signals and one honest static identity badge.

```md
[![Language: Go.](https://flat.badgen.net/static/language/Go/1D4ED8)](https://go.dev) [![Latest stable release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Codecov coverage.](https://flat.badgen.net/codecov/github/OWNER/REPO/BRANCH)](https://codecov.io/gh/OWNER/REPO/branch/BRANCH) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### PowerShell module

Badgen has no PowerShell Gallery generator, so do not fake a dynamic PSGallery version. Use the GitHub release as the live version signal.

```md
[![Runtime: PowerShell.](https://flat.badgen.net/static/runtime/PowerShell/1D4ED8)](https://www.powershellgallery.com/packages/MODULE) [![Latest stable release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Terraform provider or module

```md
[![Ecosystem: Terraform.](https://flat.badgen.net/static/ecosystem/Terraform/6D28D9)](https://registry.terraform.io/providers/OWNER/PACKAGE/latest) [![Latest stable release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Helm chart or Kubernetes add-on

```md
[![Package type: Helm chart.](https://flat.badgen.net/static/package/Helm%20chart/0369A1)](https://artifacthub.io/packages/search?ts_query_web=PACKAGE) [![Latest stable release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

## Language package registries

### Python package on PyPI

PyPI download-count badges currently receive an upstream `429` through Badgen, so this row omits that misleading error badge.

```md
[![Latest PyPI version.](https://flat.badgen.net/pypi/v/PACKAGE?color=0E7490)](https://pypi.org/project/PACKAGE/) [![Supported Python versions.](https://flat.badgen.net/pypi/python/PACKAGE?color=4D7C0F)](https://pypi.org/project/PACKAGE/) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=7E22CE)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Codecov coverage.](https://flat.badgen.net/codecov/github/OWNER/REPO/BRANCH)](https://codecov.io/gh/OWNER/REPO/branch/BRANCH) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Rust crate

```md
[![Latest crates.io version.](https://flat.badgen.net/crates/v/CRATE?color=0E7490)](https://crates.io/crates/CRATE) [![Total crates.io downloads.](https://flat.badgen.net/crates/d/CRATE?color=BE185D)](https://crates.io/crates/CRATE) [![Downloads of the latest crate version.](https://flat.badgen.net/crates/dl/CRATE?color=C2410C)](https://crates.io/crates/CRATE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Ruby gem

```md
[![Latest stable RubyGems version.](https://flat.badgen.net/rubygems/v/GEM?color=0E7490)](https://rubygems.org/gems/GEM) [![Total RubyGems downloads.](https://flat.badgen.net/rubygems/dt/GEM?color=BE185D)](https://rubygems.org/gems/GEM) [![Downloads of the latest gem version.](https://flat.badgen.net/rubygems/dv/GEM?color=C2410C)](https://rubygems.org/gems/GEM) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### PHP package on Packagist

```md
[![Latest Packagist version.](https://flat.badgen.net/packagist/v/VENDOR/PACKAGE?color=0E7490)](https://packagist.org/packages/VENDOR/PACKAGE) [![Total Packagist downloads.](https://flat.badgen.net/packagist/dt/VENDOR/PACKAGE?color=BE185D)](https://packagist.org/packages/VENDOR/PACKAGE) [![Supported PHP version.](https://flat.badgen.net/packagist/php/VENDOR/PACKAGE?color=4D7C0F)](https://packagist.org/packages/VENDOR/PACKAGE) [![Packagist dependents.](https://flat.badgen.net/packagist/dependents/VENDOR/PACKAGE?color=0F766E)](https://packagist.org/packages/VENDOR/PACKAGE/dependents) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![Packagist license.](https://flat.badgen.net/packagist/license/VENDOR/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### .NET package on NuGet

```md
[![Latest stable NuGet version.](https://flat.badgen.net/nuget/v/PACKAGE?color=0E7490)](https://www.nuget.org/packages/PACKAGE) [![Total NuGet downloads.](https://flat.badgen.net/nuget/dt/PACKAGE?color=BE185D)](https://www.nuget.org/packages/PACKAGE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Codecov coverage.](https://flat.badgen.net/codecov/github/OWNER/REPO/BRANCH)](https://codecov.io/gh/OWNER/REPO/branch/BRANCH) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### JVM library on Maven Central

```md
[![Latest Maven Central version.](https://flat.badgen.net/maven/v/maven-central/GROUP_ID/ARTIFACT_ID?color=0E7490)](https://central.sonatype.com/artifact/GROUP_ID/ARTIFACT_ID) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Codecov coverage.](https://flat.badgen.net/codecov/github/OWNER/REPO/BRANCH)](https://codecov.io/gh/OWNER/REPO/branch/BRANCH) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=7E22CE)](https://github.com/OWNER/REPO/releases/latest) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Dart or Flutter package

Use either the Dart-platform or Flutter-platform badge, not both, unless the package genuinely spans both metadata models.

```md
[![Latest pub.dev version.](https://flat.badgen.net/pub/v/PACKAGE?color=0E7490)](https://pub.dev/packages/PACKAGE) [![Monthly pub.dev downloads.](https://flat.badgen.net/pub/dm/PACKAGE?color=BE185D)](https://pub.dev/packages/PACKAGE) [![Supported Dart SDK.](https://flat.badgen.net/pub/sdk-version/PACKAGE?color=4D7C0F)](https://pub.dev/packages/PACKAGE) [![Pub points.](https://flat.badgen.net/pub/points/PACKAGE?color=6D28D9)](https://pub.dev/packages/PACKAGE/score) [![Pub likes.](https://flat.badgen.net/pub/likes/PACKAGE?color=B45309)](https://pub.dev/packages/PACKAGE/score) [![Supported Flutter platforms.](https://flat.badgen.net/pub/flutter-platform/PACKAGE?color=C2410C)](https://pub.dev/packages/PACKAGE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Pub license.](https://flat.badgen.net/pub/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Haskell package on Hackage

```md
[![Latest Hackage version.](https://flat.badgen.net/hackage/v/PACKAGE?color=0E7490)](https://hackage.haskell.org/package/PACKAGE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![Hackage license.](https://flat.badgen.net/hackage/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### R package on CRAN

```md
[![Latest CRAN version.](https://flat.badgen.net/cran/v/PACKAGE?color=0E7490)](https://cran.r-project.org/package=PACKAGE) [![Total CRAN downloads.](https://flat.badgen.net/cran/dt/PACKAGE?color=BE185D)](https://cran.r-project.org/package=PACKAGE) [![Required R version.](https://flat.badgen.net/cran/r/PACKAGE?color=4D7C0F)](https://cran.r-project.org/package=PACKAGE) [![CRAN dependents.](https://flat.badgen.net/cran/dependents/PACKAGE?color=0F766E)](https://cran.r-project.org/package=PACKAGE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![CRAN license.](https://flat.badgen.net/cran/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### LaTeX package on CTAN

```md
[![Latest CTAN version.](https://flat.badgen.net/ctan/v/PACKAGE?color=0E7490)](https://ctan.org/pkg/PACKAGE) [![CTAN rating.](https://flat.badgen.net/ctan/rating/PACKAGE?color=B45309)](https://ctan.org/pkg/PACKAGE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![CTAN license.](https://flat.badgen.net/ctan/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### D package on DUB

```md
[![Latest DUB version.](https://flat.badgen.net/dub/v/PACKAGE?color=0E7490)](https://code.dlang.org/packages/PACKAGE) [![Total DUB downloads.](https://flat.badgen.net/dub/dt/PACKAGE?color=BE185D)](https://code.dlang.org/packages/PACKAGE) [![DUB rating.](https://flat.badgen.net/dub/rating/PACKAGE?color=B45309)](https://code.dlang.org/packages/PACKAGE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![DUB license.](https://flat.badgen.net/dub/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Elm package

```md
[![Latest Elm package version.](https://flat.badgen.net/elm-package/v/OWNER/PACKAGE?color=0E7490)](https://package.elm-lang.org/packages/OWNER/PACKAGE/latest/) [![Supported Elm version.](https://flat.badgen.net/elm-package/elm/OWNER/PACKAGE?color=4D7C0F)](https://package.elm-lang.org/packages/OWNER/PACKAGE/latest/) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![Elm package license.](https://flat.badgen.net/elm-package/license/OWNER/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Haxe package on haxelib

```md
[![Latest haxelib version.](https://flat.badgen.net/haxelib/v/PACKAGE?color=0E7490)](https://lib.haxe.org/p/PACKAGE/) [![Total haxelib downloads.](https://flat.badgen.net/haxelib/d/PACKAGE?color=BE185D)](https://lib.haxe.org/p/PACKAGE/) [![Downloads of the latest haxelib version.](https://flat.badgen.net/haxelib/dl/PACKAGE?color=C2410C)](https://lib.haxe.org/p/PACKAGE/) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![haxelib license.](https://flat.badgen.net/haxelib/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### OCaml package on opam

```md
[![Latest opam version.](https://flat.badgen.net/opam/v/PACKAGE?color=0E7490)](https://opam.ocaml.org/packages/PACKAGE/) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![opam license.](https://flat.badgen.net/opam/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Perl distribution on CPAN

Use the CPAN distribution name in `DISTRIBUTION`; Badgen also accepts module-style identifiers where the registry does.

```md
[![Latest CPAN version.](https://flat.badgen.net/cpan/v/DISTRIBUTION?color=0E7490)](https://metacpan.org/dist/DISTRIBUTION) [![Required Perl version.](https://flat.badgen.net/cpan/perl/DISTRIBUTION?color=4D7C0F)](https://metacpan.org/dist/DISTRIBUTION) [![CPAN dependents.](https://flat.badgen.net/cpan/dependents/DISTRIBUTION?color=0F766E)](https://metacpan.org/dist/DISTRIBUTION) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![CPAN license.](https://flat.badgen.net/cpan/license/DISTRIBUTION?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Crystal shard

```md
[![Latest shard version.](https://flat.badgen.net/shards/v/PACKAGE?color=0E7490)](https://github.com/OWNER/REPO/releases) [![Required Crystal version.](https://flat.badgen.net/shards/crystal/PACKAGE?color=4D7C0F)](https://github.com/OWNER/REPO) [![Shard dependents.](https://flat.badgen.net/shards/dependents/PACKAGE?color=0F766E)](https://github.com/OWNER/REPO/network/dependents) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Shard license.](https://flat.badgen.net/shards/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Swift or Objective-C library on CocoaPods

```md
[![Latest CocoaPods version.](https://flat.badgen.net/cocoapods/v/POD?color=0E7490)](https://cocoapods.org/pods/POD) [![Supported Apple platforms.](https://flat.badgen.net/cocoapods/p/POD?color=6D28D9)](https://cocoapods.org/pods/POD) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Codecov coverage.](https://flat.badgen.net/codecov/github/OWNER/REPO/BRANCH)](https://codecov.io/gh/OWNER/REPO/branch/BRANCH) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

## Editor and browser extensions

### Visual Studio Marketplace extension

```md
[![Latest Visual Studio Marketplace version.](https://flat.badgen.net/vs-marketplace/v/PUBLISHER.EXTENSION?color=0E7490)](https://marketplace.visualstudio.com/items?itemName=PUBLISHER.EXTENSION) [![Visual Studio Marketplace installs.](https://flat.badgen.net/vs-marketplace/i/PUBLISHER.EXTENSION?color=BE185D)](https://marketplace.visualstudio.com/items?itemName=PUBLISHER.EXTENSION) [![Visual Studio Marketplace downloads.](https://flat.badgen.net/vs-marketplace/d/PUBLISHER.EXTENSION?color=C2410C)](https://marketplace.visualstudio.com/items?itemName=PUBLISHER.EXTENSION) [![Visual Studio Marketplace rating.](https://flat.badgen.net/vs-marketplace/rating/PUBLISHER.EXTENSION?color=B45309)](https://marketplace.visualstudio.com/items?itemName=PUBLISHER.EXTENSION&ssr=false#review-details) [![Extension checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Dual-published VS Code and Open VSX extension

```md
[![Latest Visual Studio Marketplace version.](https://flat.badgen.net/vs-marketplace/v/PUBLISHER.EXTENSION?color=0E7490)](https://marketplace.visualstudio.com/items?itemName=PUBLISHER.EXTENSION) [![Visual Studio Marketplace installs.](https://flat.badgen.net/vs-marketplace/i/PUBLISHER.EXTENSION?color=BE185D)](https://marketplace.visualstudio.com/items?itemName=PUBLISHER.EXTENSION) [![Latest Open VSX version.](https://flat.badgen.net/open-vsx/version/NAMESPACE/EXTENSION?color=7E22CE)](https://open-vsx.org/extension/NAMESPACE/EXTENSION) [![Open VSX downloads.](https://flat.badgen.net/open-vsx/d/NAMESPACE/EXTENSION?color=C2410C)](https://open-vsx.org/extension/NAMESPACE/EXTENSION) [![Extension checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Chrome extension

```md
[![Latest Chrome Web Store version.](https://flat.badgen.net/chrome-web-store/v/EXTENSION_ID?color=0E7490)](https://chromewebstore.google.com/detail/EXTENSION_ID) [![Chrome Web Store users.](https://flat.badgen.net/chrome-web-store/users/EXTENSION_ID?color=BE185D)](https://chromewebstore.google.com/detail/EXTENSION_ID) [![Chrome Web Store rating.](https://flat.badgen.net/chrome-web-store/rating/EXTENSION_ID?color=B45309)](https://chromewebstore.google.com/detail/EXTENSION_ID/reviews) [![Chrome Web Store rating count.](https://flat.badgen.net/chrome-web-store/rating-count/EXTENSION_ID?color=7E22CE)](https://chromewebstore.google.com/detail/EXTENSION_ID/reviews) [![Extension checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Firefox add-on

```md
[![Latest Firefox Add-ons version.](https://flat.badgen.net/amo/v/ADDON_SLUG?color=0E7490)](https://addons.mozilla.org/firefox/addon/ADDON_SLUG/) [![Firefox Add-ons users.](https://flat.badgen.net/amo/users/ADDON_SLUG?color=BE185D)](https://addons.mozilla.org/firefox/addon/ADDON_SLUG/) [![Firefox Add-ons rating.](https://flat.badgen.net/amo/rating/ADDON_SLUG?color=B45309)](https://addons.mozilla.org/firefox/addon/ADDON_SLUG/reviews/) [![Firefox Add-ons reviews.](https://flat.badgen.net/amo/reviews/ADDON_SLUG?color=7E22CE)](https://addons.mozilla.org/firefox/addon/ADDON_SLUG/reviews/) [![Extension checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Microsoft Edge add-on

```md
[![Latest Microsoft Edge Add-ons version.](https://flat.badgen.net/edge-addons/v/EXTENSION_ID?color=0E7490)](https://microsoftedge.microsoft.com/addons/detail/EXTENSION_ID) [![Microsoft Edge Add-ons users.](https://flat.badgen.net/edge-addons/users/EXTENSION_ID?color=BE185D)](https://microsoftedge.microsoft.com/addons/detail/EXTENSION_ID) [![Microsoft Edge Add-ons rating.](https://flat.badgen.net/edge-addons/rating/EXTENSION_ID?color=B45309)](https://microsoftedge.microsoft.com/addons/detail/EXTENSION_ID) [![Microsoft Edge Add-ons rating count.](https://flat.badgen.net/edge-addons/rating-count/EXTENSION_ID?color=7E22CE)](https://microsoftedge.microsoft.com/addons/detail/EXTENSION_ID) [![Extension checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

## Operating-system distribution

### Windows CLI distributed through winget and Scoop

```md
[![Latest winget version.](https://flat.badgen.net/winget/v/WINGET_PACKAGE_ID?color=0E7490)](https://github.com/microsoft/winget-pkgs) [![Latest Scoop version.](https://flat.badgen.net/scoop/v/SCOOP_PACKAGE?color=7E22CE)](https://scoop.sh/#/apps?q=SCOOP_PACKAGE) [![Latest release asset downloads.](https://flat.badgen.net/github/assets-dl/OWNER/REPO?color=C2410C)](https://github.com/OWNER/REPO/releases/latest) [![Release checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Homebrew formula

```md
[![Latest Homebrew formula version.](https://flat.badgen.net/homebrew/v/FORMULA?color=0E7490)](https://formulae.brew.sh/formula/FORMULA) [![Monthly Homebrew downloads.](https://flat.badgen.net/homebrew/dm/FORMULA?color=BE185D)](https://formulae.brew.sh/formula/FORMULA) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=7E22CE)](https://github.com/OWNER/REPO/releases/latest) [![Release checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Homebrew cask

```md
[![Latest Homebrew cask version.](https://flat.badgen.net/homebrew/cask/v/CASK?color=0E7490)](https://formulae.brew.sh/cask/CASK) [![Monthly Homebrew cask downloads.](https://flat.badgen.net/homebrew/cask/dm/CASK?color=BE185D)](https://formulae.brew.sh/cask/CASK) [![Latest release asset downloads.](https://flat.badgen.net/github/assets-dl/OWNER/REPO?color=C2410C)](https://github.com/OWNER/REPO/releases/latest) [![Release checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Snap package

```md
[![Latest Snap version.](https://flat.badgen.net/snapcraft/v/SNAP?color=0E7490)](https://snapcraft.io/SNAP) [![Snap distribution size.](https://flat.badgen.net/snapcraft/size/SNAP?color=C2410C)](https://snapcraft.io/SNAP) [![Supported Snap architectures.](https://flat.badgen.net/snapcraft/architecture/SNAP?color=6D28D9)](https://snapcraft.io/SNAP) [![Release checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![Snap license.](https://flat.badgen.net/snapcraft/license/SNAP?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Android app on F-Droid

```md
[![Latest F-Droid version.](https://flat.badgen.net/f-droid/v/APP_ID?color=0E7490)](https://f-droid.org/packages/APP_ID/) [![Release checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![F-Droid license.](https://flat.badgen.net/f-droid/license/APP_ID?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

## Community and custom metadata

### Open Collective project

The Open Collective contributors endpoint currently produces `undefined`; use GitHub's contributors count instead.

```md
[![Open Collective backers.](https://flat.badgen.net/opencollective/backers/COLLECTIVE?color=BE185D)](https://opencollective.com/COLLECTIVE) [![Open Collective yearly income.](https://flat.badgen.net/opencollective/yearly/COLLECTIVE?color=0F766E)](https://opencollective.com/COLLECTIVE) [![Open Collective balance.](https://flat.badgen.net/opencollective/balance/COLLECTIVE?color=047857)](https://opencollective.com/COLLECTIVE) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub contributors.](https://flat.badgen.net/github/contributors/OWNER/REPO?color=7E22CE)](https://github.com/OWNER/REPO/graphs/contributors) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Project with a Discord community

`DISCORD_ID_OR_SLUG` can be a supported public server identifier. Verify the preview before publishing.

```md
[![Latest stable release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Discord community members.](https://flat.badgen.net/discord/members/DISCORD_ID_OR_SLUG?color=6D28D9)](https://discord.gg/INVITE_CODE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Honest static project metadata

Static badges are appropriate for facts that change only when the repository changes. Do not use them to claim live build, coverage, security, or uptime status.

```md
[![API stability: stable.](https://flat.badgen.net/static/API/stable/047857)](https://github.com/OWNER/REPO/blob/BRANCH/docs/api.md) [![Module format: ESM.](https://flat.badgen.net/static/module/ESM/0E7490)](https://github.com/OWNER/REPO#usage) [![Platform: cross-platform.](https://flat.badgen.net/static/platform/cross-platform/6D28D9)](https://github.com/OWNER/REPO#compatibility) [![Code style: Prettier.](https://flat.badgen.net/static/code%20style/Prettier/A21CAF)](https://prettier.io) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

## Conditional badges: preview before keeping

These endpoints are official, but their upstream services or package analyzers can fail for an otherwise valid project. Add them one at a time and delete any badge that renders `429`, `500`, `error`, `unknown`, `undefined`, `timeout`, or `discontinued`.

```md
[![Minified and gzipped bundle size.](https://flat.badgen.net/bundlejs/minzip/PACKAGE?color=C2410C)](https://bundlejs.com/?q=PACKAGE)
[![Published package size.](https://flat.badgen.net/packagephobia/publish/PACKAGE?color=475569)](https://packagephobia.com/result?p=PACKAGE)
[![Installed package size.](https://flat.badgen.net/packagephobia/install/PACKAGE?color=7E22CE)](https://packagephobia.com/result?p=PACKAGE)
[![Monthly PyPI downloads.](https://flat.badgen.net/pypi/dm/PACKAGE?color=BE185D)](https://pypi.org/project/PACKAGE/)
```

Avoid these currently poor choices unless Badgen or the upstream integration is repaired:

- Bundlephobia badges can render an upstream `429`; prefer BundleJS after previewing it.
- Code Climate badges currently render `discontinued`.
- WAPM badges currently time out.
- The Matrix members endpoint currently renders an undefined count for known public rooms.
- The Open Collective contributors endpoint currently renders `undefined`; use GitHub contributors.
- Some GitLab release and license calls currently render `500`; the GitLab social row above avoids them.
- The legacy Dependabot badge documents Dependabot's old standalone service and should not be treated as a modern GitHub Dependabot status signal.

## Final README quality check

Before committing a row:

1. Replace every uppercase placeholder and search the rendered README for leftovers.
2. Open every badge image once and reject badges that show an error as their text even when the HTTP response is `200`.
3. Click every badge and confirm it lands on the exact package, workflow, report, issue list, or license.
4. Keep checks, uptime, coverage, and vulnerability colors dynamic.
5. Prefer five to eight strong signals. A registry version, compatibility, checks, adoption, issues, and license usually beat fifteen vanity counters.
6. Use concise sentence-style alt text with a final period, as in this library.
7. Keep the most actionable order: release or package, compatibility, quality, adoption, maintenance, license.
