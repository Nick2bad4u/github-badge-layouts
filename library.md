# Multi-provider badge-combo library

Copy a row, replace its uppercase placeholders, and remove any badge whose service you do not actually use. Every badge image comes from a registered HTTPS service, and every click target goes to the underlying project, registry, report, or workflow rather than to the badge image.

The original Badgen library was refreshed against Badgen's official [`llms.txt`](https://flat.badgen.net/llms.txt) and [generator reference](https://badgen.net/badges.md). The provider-native additions use the services' current first-party documentation and representative live SVG responses.

## Service guide

| Service         | Best use                                      | Notes                                                                                     |
| --------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Badgen          | Lightweight general-purpose badges            | Canonical legacy layouts; the gallery can switch these between flat and classic hosts.    |
| Shields.io      | Broad GitHub, package, CI, and custom data    | The most flexible general-purpose alternative; provider-native `style` parameters remain. |
| Badge Fury      | Package versions                              | Supports npm, RubyGems, PyPI, Go, GitHub, NuGet, PHP, CocoaPods, CPAN, and PGXN families. |
| Codecov         | Coverage                                      | Use only after the public repository is configured in Codecov.                            |
| Snyk            | Dependency vulnerability status               | Use only when the public repository resolves correctly in Snyk.                           |
| BadgeSize       | Public file and compressed file sizes         | `FILE_PATH` must exist on `BRANCH`; results may redirect through Shields.io.              |
| dependents.info | GitHub dependency-network reach               | Works with limited data by default; its optional Action improves refreshes.               |
| shieldcn        | Modern shadcn-inspired GitHub and npm badges  | Provider-native appearance is intentionally not converted into a Badgen style.            |
| NodeICO         | Dense npm package summaries                   | One SVG can combine package name, version, downloads, stars, and update age.              |
| PlayBadges      | Public Google Play downloads, rating, version | Use a public Android `APP_ID`; the compact badges fit rows better than the full app card. |

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

| Placeholder                                      | Replace with                                                                   |
| ------------------------------------------------ | ------------------------------------------------------------------------------ |
| `OWNER` / `REPO`                                 | GitHub owner and repository                                                    |
| `BRANCH`                                         | Default branch, usually `main`                                                 |
| `WORKFLOW_FILE`                                  | GitHub Actions workflow filename, such as `quality.yml`                        |
| `FILE_PATH`                                      | Public repository file path, such as `dist/index.js`                           |
| `PACKAGE`                                        | Registry package name; scoped npm names such as `@scope/package` are supported |
| `DOCKER_SCOPE` / `IMAGE` / `TAG` / `ARCH`        | Docker Hub coordinates, such as `library/ubuntu/latest/amd64`                  |
| `CRATE`, `GEM`, `POD`, `FORMULA`, and similar    | The package's registry identifier                                              |
| `PUBLISHER.EXTENSION`                            | Visual Studio Marketplace identifier                                           |
| `NAMESPACE` / `EXTENSION`                        | Open VSX namespace and extension                                               |
| `EXTENSION_ID`                                   | Chrome or Edge store extension ID                                              |
| `ADDON_SLUG`                                     | Firefox Add-ons slug                                                           |
| `UPTIME_ROBOT_MONITOR_KEY`                       | A monitor-specific read-only key, never the account-wide API key               |
| `AZURE_ORG` / `AZURE_PROJECT` / `AZURE_PIPELINE` | Azure DevOps organization, project, and pipeline definition ID                 |
| `CI_OWNER` / `CI_REPO` / `CI_BRANCH`             | Repository coordinates as configured in an external CI provider                |
| `APPVEYOR_ACCOUNT` / `APPVEYOR_PROJECT`          | AppVeyor account and project slug                                              |
| `CODECLIMATE_ORG` / `CODECLIMATE_REPO`           | Code Climate organization and repository slug                                  |
| `MATRIX_ROOM` / `MATRIX_SERVER`                  | Public Matrix room alias and homeserver, without the leading `#`               |
| `LIBERAPAY_ACCOUNT`                              | Liberapay account slug                                                         |
| `MASTODON_USER` / `MASTODON_SERVER`              | Mastodon username and instance hostname, without `@` or `https://`             |

URL-encode spaces and special characters in path segments. If your default branch is not `main`, replace it everywhere—including badge URLs and destination links.

## GitHub-hosted projects

### Balanced public repository

<!-- languages: Language agnostic -->

```md
[![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub forks.](https://flat.badgen.net/github/forks/OWNER/REPO?color=C2410C)](https://github.com/OWNER/REPO/forks) [![GitHub contributors.](https://flat.badgen.net/github/contributors/OWNER/REPO?color=7E22CE)](https://github.com/OWNER/REPO/graphs/contributors) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Release-driven binary or desktop app

<!-- languages: Language agnostic -->

```md
[![Latest stable release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Latest release asset downloads.](https://flat.badgen.net/github/assets-dl/OWNER/REPO?color=BE185D)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Last GitHub commit.](https://flat.badgen.net/github/last-commit/OWNER/REPO/BRANCH?color=475569)](https://github.com/OWNER/REPO/commits/BRANCH) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### GitHub Action

<!-- languages: Language agnostic -->

Replace `ACTION_SLUG` with the Marketplace action slug. Keep the checks badge dynamic so a broken action does not advertise itself as passing.

```md
[![Project type: GitHub Action.](https://flat.badgen.net/static/type/GitHub%20Action/6D28D9)](https://github.com/marketplace/actions/ACTION_SLUG) [![Latest stable release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Documentation site or static site

<!-- languages: Language agnostic -->

```md
[![Site deployment checks.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Last content update.](https://flat.badgen.net/github/last-commit/OWNER/REPO/BRANCH?color=475569)](https://github.com/OWNER/REPO/commits/BRANCH) [![Documentation contributors.](https://flat.badgen.net/github/contributors/OWNER/REPO?color=7E22CE)](https://github.com/OWNER/REPO/graphs/contributors) [![Open documentation issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![Documentation license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Monorepo

<!-- languages: Language agnostic -->

```md
[![Latest stable monorepo release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Monorepo checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub contributors.](https://flat.badgen.net/github/contributors/OWNER/REPO?color=7E22CE)](https://github.com/OWNER/REPO/graphs/contributors) [![GitHub open pull requests.](https://flat.badgen.net/github/open-prs/OWNER/REPO?color=0369A1)](https://github.com/OWNER/REPO/pulls) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![Repository dependents.](https://flat.badgen.net/github/dependents-repo/OWNER/REPO?color=0F766E)](https://github.com/OWNER/REPO/network/dependents) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### API, bot, or hosted service

<!-- languages: Language agnostic -->

UptimeRobot badges require a monitor-specific read-only key. The key is meant to identify that public monitor; never put an account-wide API key in a README.

```md
[![Latest stable service release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Service checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Current service status.](https://flat.badgen.net/uptime-robot/status/UPTIME_ROBOT_MONITOR_KEY)](https://status.example.com) [![Service uptime over the past month.](https://flat.badgen.net/uptime-robot/month/UPTIME_ROBOT_MONITOR_KEY)](https://status.example.com) [![Latest service response time.](https://flat.badgen.net/uptime-robot/response/UPTIME_ROBOT_MONITOR_KEY)](https://status.example.com) [![Open service issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Community-funded open source

<!-- languages: Language agnostic -->

```md
[![Latest stable release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub contributors.](https://flat.badgen.net/github/contributors/OWNER/REPO?color=7E22CE)](https://github.com/OWNER/REPO/graphs/contributors) [![Open Collective backers.](https://flat.badgen.net/opencollective/backers/COLLECTIVE?color=BE185D)](https://opencollective.com/COLLECTIVE) [![Open Collective balance.](https://flat.badgen.net/opencollective/balance/COLLECTIVE?color=047857)](https://opencollective.com/COLLECTIVE) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Security- and quality-focused project

<!-- languages: Language agnostic -->

Use the Snyk badge only if the project is actually monitored by Snyk. Replace `SNYK_ORG` and `SNYK_PROJECT_ID` so the click opens the exact report rather than a generic security landing page.

```md
[![Latest stable release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Codecov coverage.](https://flat.badgen.net/codecov/github/OWNER/REPO/BRANCH)](https://codecov.io/gh/OWNER/REPO/branch/BRANCH) [![Snyk vulnerability status.](https://flat.badgen.net/snyk/OWNER/REPO/BRANCH)](https://app.snyk.io/org/SNYK_ORG/project/SNYK_PROJECT_ID) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### GitLab project

<!-- languages: Language agnostic -->

Badgen's GitLab release and license integrations currently return upstream errors for some live projects, so this row deliberately uses the healthy social and contribution endpoints.

```md
[![GitLab stars.](https://flat.badgen.net/gitlab/stars/GITLAB_NAMESPACE/REPO?color=B45309)](https://gitlab.com/GITLAB_NAMESPACE/REPO/-/starrers) [![GitLab forks.](https://flat.badgen.net/gitlab/forks/GITLAB_NAMESPACE/REPO?color=C2410C)](https://gitlab.com/GITLAB_NAMESPACE/REPO/-/forks) [![GitLab open issues.](https://flat.badgen.net/gitlab/open-issues/GITLAB_NAMESPACE/REPO?color=B91C1C)](https://gitlab.com/GITLAB_NAMESPACE/REPO/-/issues) [![GitLab merged merge requests.](https://flat.badgen.net/gitlab/merged-mrs/GITLAB_NAMESPACE/REPO?color=0F766E)](https://gitlab.com/GITLAB_NAMESPACE/REPO/-/merge_requests?scope=all&state=merged) [![GitLab contributors.](https://flat.badgen.net/gitlab/contributors/GITLAB_NAMESPACE/REPO?color=7E22CE)](https://gitlab.com/GITLAB_NAMESPACE/REPO/-/graphs/BRANCH)
```

## External CI and code quality

Use these rows only when the named service is actively configured for the project. Provider-specific placeholders are separate from `OWNER` and `REPO` because CI organizations and project slugs do not always match the GitHub repository.

### Azure Pipelines project

<!-- languages: Language agnostic -->

`AZURE_PIPELINE` is the numeric pipeline definition ID or a definition name accepted by Badgen. The click targets open the exact build definition rather than a generic Azure DevOps landing page.

```md
[![Continuous integration: Azure Pipelines.](https://flat.badgen.net/static/CI/Azure%20Pipelines/2560E0)](https://dev.azure.com/AZURE_ORG/AZURE_PROJECT/_build?definitionId=AZURE_PIPELINE) [![Azure Pipelines status.](https://flat.badgen.net/azure-pipelines/AZURE_ORG/AZURE_PROJECT/AZURE_PIPELINE)](https://dev.azure.com/AZURE_ORG/AZURE_PROJECT/_build?definitionId=AZURE_PIPELINE) [![Latest Azure Pipelines build version.](https://flat.badgen.net/azure-pipelines/build/version/AZURE_ORG/AZURE_PROJECT/AZURE_PIPELINE?color=0E7490)](https://dev.azure.com/AZURE_ORG/AZURE_PROJECT/_build?definitionId=AZURE_PIPELINE) [![Latest Azure Pipelines test results.](https://flat.badgen.net/azure-pipelines/build/test/AZURE_ORG/AZURE_PROJECT/AZURE_PIPELINE)](https://dev.azure.com/AZURE_ORG/AZURE_PROJECT/_build?definitionId=AZURE_PIPELINE)
```

### CircleCI project

<!-- languages: Language agnostic -->

This row pairs the external build result with a small set of GitHub maintenance signals. Remove the GitHub badges when the source is hosted elsewhere.

```md
[![CircleCI build on CI_BRANCH.](https://flat.badgen.net/circleci/github/CI_OWNER/CI_REPO/CI_BRANCH)](https://app.circleci.com/pipelines/github/CI_OWNER/CI_REPO) [![Last GitHub commit on CI_BRANCH.](https://flat.badgen.net/github/last-commit/CI_OWNER/CI_REPO/CI_BRANCH?color=475569)](https://github.com/CI_OWNER/CI_REPO/commits/CI_BRANCH) [![GitHub stars.](https://flat.badgen.net/github/stars/CI_OWNER/CI_REPO?color=B45309)](https://github.com/CI_OWNER/CI_REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/CI_OWNER/CI_REPO?color=B91C1C)](https://github.com/CI_OWNER/CI_REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/CI_OWNER/CI_REPO?color=4338CA)](https://github.com/CI_OWNER/CI_REPO/blob/CI_BRANCH/LICENSE)
```

### Travis CI project with Coveralls

<!-- languages: Language agnostic -->

Use this only for a public GitHub repository that still runs on Travis CI and publishes coverage to Coveralls. The branch is explicit in both status badges so the row does not silently mix results from different refs.

```md
[![Travis CI build on CI_BRANCH.](https://flat.badgen.net/travis/CI_OWNER/CI_REPO/CI_BRANCH)](https://app.travis-ci.com/github/CI_OWNER/CI_REPO) [![Coveralls coverage on CI_BRANCH.](https://flat.badgen.net/coveralls/c/github/CI_OWNER/CI_REPO/CI_BRANCH)](https://coveralls.io/github/CI_OWNER/CI_REPO?branch=CI_BRANCH) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/CI_OWNER/CI_REPO/stable?color=0E7490)](https://github.com/CI_OWNER/CI_REPO/releases/latest) [![Last GitHub commit on CI_BRANCH.](https://flat.badgen.net/github/last-commit/CI_OWNER/CI_REPO/CI_BRANCH?color=475569)](https://github.com/CI_OWNER/CI_REPO/commits/CI_BRANCH) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/CI_OWNER/CI_REPO?color=B91C1C)](https://github.com/CI_OWNER/CI_REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/CI_OWNER/CI_REPO?color=4338CA)](https://github.com/CI_OWNER/CI_REPO/blob/CI_BRANCH/LICENSE)
```

### AppVeyor Windows project

<!-- languages: Language agnostic -->

Keep this row for projects whose Windows build is actually public in AppVeyor. `APPVEYOR_ACCOUNT` may be a user or organization slug.

```md
[![AppVeyor Windows build.](https://flat.badgen.net/appveyor/ci/APPVEYOR_ACCOUNT/APPVEYOR_PROJECT)](https://ci.appveyor.com/project/APPVEYOR_ACCOUNT/APPVEYOR_PROJECT) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Latest release asset downloads.](https://flat.badgen.net/github/assets-dl/OWNER/REPO?color=C2410C)](https://github.com/OWNER/REPO/releases/latest) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Code Climate quality report

<!-- languages: Language agnostic -->

Code Climate analysis must be public for these badges to resolve. Coverage can legitimately differ from another provider, so keep only the report your project treats as authoritative.

```md
[![Code Climate maintainability.](https://flat.badgen.net/codeclimate/maintainability/CODECLIMATE_ORG/CODECLIMATE_REPO)](https://codeclimate.com/github/CODECLIMATE_ORG/CODECLIMATE_REPO) [![Code Climate technical debt.](https://flat.badgen.net/codeclimate/tech-debt/CODECLIMATE_ORG/CODECLIMATE_REPO?color=C2410C)](https://codeclimate.com/github/CODECLIMATE_ORG/CODECLIMATE_REPO) [![Code Climate issues.](https://flat.badgen.net/codeclimate/issues/CODECLIMATE_ORG/CODECLIMATE_REPO?color=B91C1C)](https://codeclimate.com/github/CODECLIMATE_ORG/CODECLIMATE_REPO/issues) [![Code Climate coverage.](https://flat.badgen.net/codeclimate/coverage/CODECLIMATE_ORG/CODECLIMATE_REPO)](https://codeclimate.com/github/CODECLIMATE_ORG/CODECLIMATE_REPO/test_coverage) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

## JavaScript and TypeScript

### General npm package

<!-- languages: JavaScript, TypeScript -->

```md
[![Latest npm version.](https://flat.badgen.net/npm/v/PACKAGE?color=0E7490)](https://www.npmjs.com/package/PACKAGE) [![Monthly npm downloads.](https://flat.badgen.net/npm/dm/PACKAGE?color=BE185D)](https://www.npmjs.com/package/PACKAGE) [![Supported Node.js versions.](https://flat.badgen.net/npm/node/PACKAGE?color=4D7C0F)](https://www.npmjs.com/package/PACKAGE) [![TypeScript declaration status.](https://flat.badgen.net/npm/types/PACKAGE?color=6D28D9)](https://www.npmjs.com/package/PACKAGE) [![Package dependents.](https://flat.badgen.net/github/dependents-pkg/OWNER/REPO?color=0F766E)](https://github.com/OWNER/REPO/network/dependents) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![NPM license.](https://flat.badgen.net/npm/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### TypeScript library with coverage

<!-- languages: TypeScript -->

```md
[![Latest npm version.](https://flat.badgen.net/npm/v/PACKAGE?color=0E7490)](https://www.npmjs.com/package/PACKAGE) [![Monthly npm downloads.](https://flat.badgen.net/npm/dm/PACKAGE?color=BE185D)](https://www.npmjs.com/package/PACKAGE) [![Supported Node.js versions.](https://flat.badgen.net/npm/node/PACKAGE?color=4D7C0F)](https://www.npmjs.com/package/PACKAGE) [![Bundled TypeScript declarations.](https://flat.badgen.net/npm/types/PACKAGE?color=6D28D9)](https://www.npmjs.com/package/PACKAGE) [![Codecov coverage.](https://flat.badgen.net/codecov/github/OWNER/REPO/BRANCH)](https://codecov.io/gh/OWNER/REPO/branch/BRANCH) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![NPM license.](https://flat.badgen.net/npm/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Browser-first npm library or CDN package

<!-- languages: JavaScript, TypeScript -->

BundleJS and Packagephobia depend on successfully analyzing the package. Preview both badges before committing them.

```md
[![Latest npm version.](https://flat.badgen.net/npm/v/PACKAGE?color=0E7490)](https://www.npmjs.com/package/PACKAGE) [![Monthly jsDelivr hits.](https://flat.badgen.net/jsdelivr/hits/npm/PACKAGE?color=BE185D)](https://www.jsdelivr.com/package/npm/PACKAGE) [![Minified and gzipped bundle size.](https://flat.badgen.net/bundlejs/minzip/PACKAGE?color=C2410C)](https://bundlejs.com/?q=PACKAGE) [![Published package size.](https://flat.badgen.net/packagephobia/publish/PACKAGE?color=475569)](https://packagephobia.com/result?p=PACKAGE) [![Bundled TypeScript declarations.](https://flat.badgen.net/npm/types/PACKAGE?color=6D28D9)](https://www.npmjs.com/package/PACKAGE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![NPM license.](https://flat.badgen.net/npm/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Bundle-conscious npm library

<!-- languages: JavaScript, TypeScript -->

Bundlephobia can report compressed size, dependency count, and tree-shaking support from the same published package. These are analyzer results rather than package guarantees, so preview the row after every packaging change.

```md
[![Latest npm version.](https://flat.badgen.net/npm/v/PACKAGE?color=0E7490)](https://www.npmjs.com/package/PACKAGE) [![Minified and gzipped Bundlephobia size.](https://flat.badgen.net/bundlephobia/minzip/PACKAGE?color=C2410C)](https://bundlephobia.com/package/PACKAGE) [![Runtime dependency count.](https://flat.badgen.net/bundlephobia/dependency-count/PACKAGE?color=475569)](https://bundlephobia.com/package/PACKAGE) [![Tree-shaking support.](https://flat.badgen.net/bundlephobia/tree-shaking/PACKAGE?color=4D7C0F)](https://bundlephobia.com/package/PACKAGE) [![Monthly jsDelivr hits.](https://flat.badgen.net/jsdelivr/hits/npm/PACKAGE?color=BE185D)](https://www.jsdelivr.com/package/npm/PACKAGE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![NPM license.](https://flat.badgen.net/npm/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### npm CLI

<!-- languages: JavaScript, TypeScript -->

```md
[![Latest npm CLI version.](https://flat.badgen.net/npm/v/PACKAGE?color=0E7490)](https://www.npmjs.com/package/PACKAGE) [![Monthly npm downloads.](https://flat.badgen.net/npm/dm/PACKAGE?color=BE185D)](https://www.npmjs.com/package/PACKAGE) [![Supported Node.js versions.](https://flat.badgen.net/npm/node/PACKAGE?color=4D7C0F)](https://www.npmjs.com/package/PACKAGE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=7E22CE)](https://github.com/OWNER/REPO/releases/latest) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![NPM license.](https://flat.badgen.net/npm/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### ESLint, Prettier, Stylelint, remark, or TypeDoc plugin

<!-- languages: JavaScript, TypeScript -->

Use the same strong signal order for tooling plugins. If the package is JavaScript-only, remove the TypeScript declarations badge. `TOOL_NAME` is display text such as `ESLint plugin` or `TypeDoc plugin`.

```md
[![Project type: TOOL_NAME.](https://flat.badgen.net/static/type/TOOL_NAME/A21CAF)](https://github.com/OWNER/REPO) [![Latest npm version.](https://flat.badgen.net/npm/v/PACKAGE?color=0E7490)](https://www.npmjs.com/package/PACKAGE) [![Monthly npm downloads.](https://flat.badgen.net/npm/dm/PACKAGE?color=BE185D)](https://www.npmjs.com/package/PACKAGE) [![Supported Node.js versions.](https://flat.badgen.net/npm/node/PACKAGE?color=4D7C0F)](https://www.npmjs.com/package/PACKAGE) [![TypeScript declaration status.](https://flat.badgen.net/npm/types/PACKAGE?color=6D28D9)](https://www.npmjs.com/package/PACKAGE) [![Codecov coverage.](https://flat.badgen.net/codecov/github/OWNER/REPO/BRANCH)](https://codecov.io/gh/OWNER/REPO/branch/BRANCH) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![NPM license.](https://flat.badgen.net/npm/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

## Language-first repositories

Use these rows when the repository itself is the product and a language registry badge would be misleading. The language badge is deliberately static; checks, releases, adoption, maintenance, and licensing remain live. Remove the release badge when the project has not published GitHub Releases.

### C or C++ library and native application

<!-- languages: C, C++ -->

```md
[![Primary language: C or C++.](https://flat.badgen.net/static/language/C%20or%20C%2B%2B/00599C)](https://github.com/OWNER/REPO) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Native build checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Java, Kotlin, Groovy, Scala, or Clojure project

<!-- languages: Java, Kotlin, Groovy, Scala, Clojure -->

```md
[![Platform: JVM.](https://flat.badgen.net/static/platform/JVM/EA2D2E)](https://github.com/OWNER/REPO) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![JVM build checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### C#, F#, or Visual Basic .NET project

<!-- languages: C#, F#, Visual Basic .NET -->

```md
[![Platform: .NET.](https://flat.badgen.net/static/platform/.NET/512BD4)](https://github.com/OWNER/REPO) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![.NET build checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Python application, service, or tool

<!-- languages: Python -->

```md
[![Primary language: Python.](https://flat.badgen.net/static/language/Python/3776AB)](https://github.com/OWNER/REPO) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Python checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Go command, service, or library

<!-- languages: Go -->

```md
[![Primary language: Go.](https://flat.badgen.net/static/language/Go/00ADD8)](https://github.com/OWNER/REPO) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Go checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Rust application or command-line tool

<!-- languages: Rust -->

```md
[![Primary language: Rust.](https://flat.badgen.net/static/language/Rust/CE412B)](https://github.com/OWNER/REPO) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Rust checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Ruby or PHP application

<!-- languages: Ruby, PHP -->

```md
[![Primary language: Ruby or PHP.](https://flat.badgen.net/static/language/Ruby%20or%20PHP/CC342D)](https://github.com/OWNER/REPO) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Application checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Swift, Objective-C, Dart, or Flutter application

<!-- languages: Swift, Objective-C, Dart -->

```md
[![Platform: Apple or Flutter.](https://flat.badgen.net/static/platform/Apple%20or%20Flutter/F05138)](https://github.com/OWNER/REPO) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Application checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Bash, Zsh, Fish, or POSIX shell project

<!-- languages: Bash, Zsh, Fish, Shell -->

```md
[![Primary language: Shell.](https://flat.badgen.net/static/language/Shell/4EAA25)](https://github.com/OWNER/REPO) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Shell checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### PowerShell automation repository

<!-- languages: PowerShell -->

```md
[![Primary language: PowerShell.](https://flat.badgen.net/static/language/PowerShell/5391FE)](https://github.com/OWNER/REPO) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![PowerShell checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Lua, Elixir, or Erlang project

<!-- languages: Lua, Elixir, Erlang -->

```md
[![Runtime: Lua or BEAM.](https://flat.badgen.net/static/runtime/Lua%20or%20BEAM/5849BE)](https://github.com/OWNER/REPO) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Runtime checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Julia scientific-computing project

<!-- languages: Julia -->

```md
[![Primary language: Julia.](https://flat.badgen.net/static/language/Julia/9558B2)](https://github.com/OWNER/REPO) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Julia checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Zig, Nim, or emerging systems-language project

<!-- languages: Zig, Nim -->

```md
[![Language family: Zig or Nim.](https://flat.badgen.net/static/language/Zig%20or%20Nim/F7A41D)](https://github.com/OWNER/REPO) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Systems build checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

## Containers, infrastructure, and unsupported registries

### Docker image

<!-- languages: Dockerfile -->

```md
[![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Docker Hub pulls.](https://flat.badgen.net/docker/pulls/DOCKER_SCOPE/IMAGE?color=BE185D)](https://hub.docker.com/r/DOCKER_SCOPE/IMAGE) [![Docker Hub stars.](https://flat.badgen.net/docker/stars/DOCKER_SCOPE/IMAGE?color=B45309)](https://hub.docker.com/r/DOCKER_SCOPE/IMAGE) [![Docker image size for TAG on ARCH.](https://flat.badgen.net/docker/size/DOCKER_SCOPE/IMAGE/TAG/ARCH?color=C2410C)](https://hub.docker.com/r/DOCKER_SCOPE/IMAGE/tags) [![Docker image layers for TAG on ARCH.](https://flat.badgen.net/docker/layers/DOCKER_SCOPE/IMAGE/TAG/ARCH?color=7E22CE)](https://hub.docker.com/r/DOCKER_SCOPE/IMAGE/tags) [![Container checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Go module

<!-- languages: Go -->

Badgen has no first-party Go module proxy generator, so use dynamic GitHub signals and one honest static identity badge.

```md
[![Language: Go.](https://flat.badgen.net/static/language/Go/1D4ED8)](https://go.dev) [![Latest stable release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Codecov coverage.](https://flat.badgen.net/codecov/github/OWNER/REPO/BRANCH)](https://codecov.io/gh/OWNER/REPO/branch/BRANCH) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### PowerShell module

<!-- languages: PowerShell -->

Badgen has no PowerShell Gallery generator, so do not fake a dynamic PSGallery version. Use the GitHub release as the live version signal.

```md
[![Runtime: PowerShell.](https://flat.badgen.net/static/runtime/PowerShell/1D4ED8)](https://www.powershellgallery.com/packages/MODULE) [![Latest stable release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Terraform provider or module

<!-- languages: HCL -->

```md
[![Ecosystem: Terraform.](https://flat.badgen.net/static/ecosystem/Terraform/6D28D9)](https://registry.terraform.io/providers/OWNER/PACKAGE/latest) [![Latest stable release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Helm chart or Kubernetes add-on

<!-- languages: YAML -->

```md
[![Package type: Helm chart.](https://flat.badgen.net/static/package/Helm%20chart/0369A1)](https://artifacthub.io/packages/search?ts_query_web=PACKAGE) [![Latest stable release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

## Language package registries

### Python package on PyPI

<!-- languages: Python -->

PyPI download-count badges currently receive an upstream `429` through Badgen, so this row omits that misleading error badge.

```md
[![Latest PyPI version.](https://flat.badgen.net/pypi/v/PACKAGE?color=0E7490)](https://pypi.org/project/PACKAGE/) [![Supported Python versions.](https://flat.badgen.net/pypi/python/PACKAGE?color=4D7C0F)](https://pypi.org/project/PACKAGE/) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=7E22CE)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Codecov coverage.](https://flat.badgen.net/codecov/github/OWNER/REPO/BRANCH)](https://codecov.io/gh/OWNER/REPO/branch/BRANCH) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Rust crate

<!-- languages: Rust -->

```md
[![Latest crates.io version.](https://flat.badgen.net/crates/v/CRATE?color=0E7490)](https://crates.io/crates/CRATE) [![Total crates.io downloads.](https://flat.badgen.net/crates/d/CRATE?color=BE185D)](https://crates.io/crates/CRATE) [![Downloads of the latest crate version.](https://flat.badgen.net/crates/dl/CRATE?color=C2410C)](https://crates.io/crates/CRATE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Ruby gem

<!-- languages: Ruby -->

```md
[![Latest stable RubyGems version.](https://flat.badgen.net/rubygems/v/GEM?color=0E7490)](https://rubygems.org/gems/GEM) [![Total RubyGems downloads.](https://flat.badgen.net/rubygems/dt/GEM?color=BE185D)](https://rubygems.org/gems/GEM) [![Downloads of the latest gem version.](https://flat.badgen.net/rubygems/dv/GEM?color=C2410C)](https://rubygems.org/gems/GEM) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### PHP package on Packagist

<!-- languages: PHP -->

```md
[![Latest Packagist version.](https://flat.badgen.net/packagist/v/VENDOR/PACKAGE?color=0E7490)](https://packagist.org/packages/VENDOR/PACKAGE) [![Total Packagist downloads.](https://flat.badgen.net/packagist/dt/VENDOR/PACKAGE?color=BE185D)](https://packagist.org/packages/VENDOR/PACKAGE) [![Supported PHP version.](https://flat.badgen.net/packagist/php/VENDOR/PACKAGE?color=4D7C0F)](https://packagist.org/packages/VENDOR/PACKAGE) [![Packagist dependents.](https://flat.badgen.net/packagist/dependents/VENDOR/PACKAGE?color=0F766E)](https://packagist.org/packages/VENDOR/PACKAGE/dependents) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![Packagist license.](https://flat.badgen.net/packagist/license/VENDOR/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### .NET package on NuGet

<!-- languages: C#, F#, Visual Basic .NET -->

```md
[![Latest stable NuGet version.](https://flat.badgen.net/nuget/v/PACKAGE?color=0E7490)](https://www.nuget.org/packages/PACKAGE) [![Total NuGet downloads.](https://flat.badgen.net/nuget/dt/PACKAGE?color=BE185D)](https://www.nuget.org/packages/PACKAGE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Codecov coverage.](https://flat.badgen.net/codecov/github/OWNER/REPO/BRANCH)](https://codecov.io/gh/OWNER/REPO/branch/BRANCH) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### JVM library on Maven Central

<!-- languages: Java, Kotlin, Groovy, Scala, Clojure -->

```md
[![Latest Maven Central version.](https://flat.badgen.net/maven/v/maven-central/GROUP_ID/ARTIFACT_ID?color=0E7490)](https://central.sonatype.com/artifact/GROUP_ID/ARTIFACT_ID) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Codecov coverage.](https://flat.badgen.net/codecov/github/OWNER/REPO/BRANCH)](https://codecov.io/gh/OWNER/REPO/branch/BRANCH) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=7E22CE)](https://github.com/OWNER/REPO/releases/latest) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Dart or Flutter package

<!-- languages: Dart -->

Use either the Dart-platform or Flutter-platform badge, not both, unless the package genuinely spans both metadata models.

```md
[![Latest pub.dev version.](https://flat.badgen.net/pub/v/PACKAGE?color=0E7490)](https://pub.dev/packages/PACKAGE) [![Monthly pub.dev downloads.](https://flat.badgen.net/pub/dm/PACKAGE?color=BE185D)](https://pub.dev/packages/PACKAGE) [![Supported Dart SDK.](https://flat.badgen.net/pub/sdk-version/PACKAGE?color=4D7C0F)](https://pub.dev/packages/PACKAGE) [![Pub points.](https://flat.badgen.net/pub/points/PACKAGE?color=6D28D9)](https://pub.dev/packages/PACKAGE/score) [![Pub likes.](https://flat.badgen.net/pub/likes/PACKAGE?color=B45309)](https://pub.dev/packages/PACKAGE/score) [![Supported Flutter platforms.](https://flat.badgen.net/pub/flutter-platform/PACKAGE?color=C2410C)](https://pub.dev/packages/PACKAGE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Pub license.](https://flat.badgen.net/pub/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Haskell package on Hackage

<!-- languages: Haskell -->

```md
[![Latest Hackage version.](https://flat.badgen.net/hackage/v/PACKAGE?color=0E7490)](https://hackage.haskell.org/package/PACKAGE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![Hackage license.](https://flat.badgen.net/hackage/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### R package on CRAN

<!-- languages: R -->

```md
[![Latest CRAN version.](https://flat.badgen.net/cran/v/PACKAGE?color=0E7490)](https://cran.r-project.org/package=PACKAGE) [![Total CRAN downloads.](https://flat.badgen.net/cran/dt/PACKAGE?color=BE185D)](https://cran.r-project.org/package=PACKAGE) [![Required R version.](https://flat.badgen.net/cran/r/PACKAGE?color=4D7C0F)](https://cran.r-project.org/package=PACKAGE) [![CRAN dependents.](https://flat.badgen.net/cran/dependents/PACKAGE?color=0F766E)](https://cran.r-project.org/package=PACKAGE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![CRAN license.](https://flat.badgen.net/cran/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### LaTeX package on CTAN

<!-- languages: TeX -->

```md
[![Latest CTAN version.](https://flat.badgen.net/ctan/v/PACKAGE?color=0E7490)](https://ctan.org/pkg/PACKAGE) [![CTAN rating.](https://flat.badgen.net/ctan/rating/PACKAGE?color=B45309)](https://ctan.org/pkg/PACKAGE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![CTAN license.](https://flat.badgen.net/ctan/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### D package on DUB

<!-- languages: D -->

```md
[![Latest DUB version.](https://flat.badgen.net/dub/v/PACKAGE?color=0E7490)](https://code.dlang.org/packages/PACKAGE) [![Total DUB downloads.](https://flat.badgen.net/dub/dt/PACKAGE?color=BE185D)](https://code.dlang.org/packages/PACKAGE) [![DUB rating.](https://flat.badgen.net/dub/rating/PACKAGE?color=B45309)](https://code.dlang.org/packages/PACKAGE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![DUB license.](https://flat.badgen.net/dub/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Elm package

<!-- languages: Elm -->

```md
[![Latest Elm package version.](https://flat.badgen.net/elm-package/v/OWNER/PACKAGE?color=0E7490)](https://package.elm-lang.org/packages/OWNER/PACKAGE/latest/) [![Supported Elm version.](https://flat.badgen.net/elm-package/elm/OWNER/PACKAGE?color=4D7C0F)](https://package.elm-lang.org/packages/OWNER/PACKAGE/latest/) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![Elm package license.](https://flat.badgen.net/elm-package/license/OWNER/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Haxe package on haxelib

<!-- languages: Haxe -->

```md
[![Latest haxelib version.](https://flat.badgen.net/haxelib/v/PACKAGE?color=0E7490)](https://lib.haxe.org/p/PACKAGE/) [![Total haxelib downloads.](https://flat.badgen.net/haxelib/d/PACKAGE?color=BE185D)](https://lib.haxe.org/p/PACKAGE/) [![Downloads of the latest haxelib version.](https://flat.badgen.net/haxelib/dl/PACKAGE?color=C2410C)](https://lib.haxe.org/p/PACKAGE/) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![haxelib license.](https://flat.badgen.net/haxelib/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### OCaml package on opam

<!-- languages: OCaml -->

```md
[![Latest opam version.](https://flat.badgen.net/opam/v/PACKAGE?color=0E7490)](https://opam.ocaml.org/packages/PACKAGE/) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![opam license.](https://flat.badgen.net/opam/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Perl distribution on CPAN

<!-- languages: Perl -->

Use the CPAN distribution name in `DISTRIBUTION`; Badgen also accepts module-style identifiers where the registry does.

```md
[![Latest CPAN version.](https://flat.badgen.net/cpan/v/DISTRIBUTION?color=0E7490)](https://metacpan.org/dist/DISTRIBUTION) [![Required Perl version.](https://flat.badgen.net/cpan/perl/DISTRIBUTION?color=4D7C0F)](https://metacpan.org/dist/DISTRIBUTION) [![CPAN dependents.](https://flat.badgen.net/cpan/dependents/DISTRIBUTION?color=0F766E)](https://metacpan.org/dist/DISTRIBUTION) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![CPAN license.](https://flat.badgen.net/cpan/license/DISTRIBUTION?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Crystal shard

<!-- languages: Crystal -->

```md
[![Latest shard version.](https://flat.badgen.net/shards/v/PACKAGE?color=0E7490)](https://github.com/OWNER/REPO/releases) [![Required Crystal version.](https://flat.badgen.net/shards/crystal/PACKAGE?color=4D7C0F)](https://github.com/OWNER/REPO) [![Shard dependents.](https://flat.badgen.net/shards/dependents/PACKAGE?color=0F766E)](https://github.com/OWNER/REPO/network/dependents) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Shard license.](https://flat.badgen.net/shards/license/PACKAGE?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Swift or Objective-C library on CocoaPods

<!-- languages: Swift, Objective-C -->

```md
[![Latest CocoaPods version.](https://flat.badgen.net/cocoapods/v/POD?color=0E7490)](https://cocoapods.org/pods/POD) [![Supported Apple platforms.](https://flat.badgen.net/cocoapods/p/POD?color=6D28D9)](https://cocoapods.org/pods/POD) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![Codecov coverage.](https://flat.badgen.net/codecov/github/OWNER/REPO/BRANCH)](https://codecov.io/gh/OWNER/REPO/branch/BRANCH) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Emacs package on MELPA

<!-- languages: Emacs Lisp -->

MELPA exposes a live version badge but not adoption or licensing metadata through Badgen, so the rest of the row uses repository signals.

```md
[![Latest MELPA version.](https://flat.badgen.net/melpa/v/PACKAGE?color=0E7490)](https://melpa.org/#/PACKAGE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

## Editor and browser extensions

### Visual Studio Marketplace extension

<!-- languages: Language agnostic -->

```md
[![Latest Visual Studio Marketplace version.](https://flat.badgen.net/vs-marketplace/v/PUBLISHER.EXTENSION?color=0E7490)](https://marketplace.visualstudio.com/items?itemName=PUBLISHER.EXTENSION) [![Visual Studio Marketplace installs.](https://flat.badgen.net/vs-marketplace/i/PUBLISHER.EXTENSION?color=BE185D)](https://marketplace.visualstudio.com/items?itemName=PUBLISHER.EXTENSION) [![Visual Studio Marketplace downloads.](https://flat.badgen.net/vs-marketplace/d/PUBLISHER.EXTENSION?color=C2410C)](https://marketplace.visualstudio.com/items?itemName=PUBLISHER.EXTENSION) [![Visual Studio Marketplace rating.](https://flat.badgen.net/vs-marketplace/rating/PUBLISHER.EXTENSION?color=B45309)](https://marketplace.visualstudio.com/items?itemName=PUBLISHER.EXTENSION&ssr=false#review-details) [![Extension checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Dual-published VS Code and Open VSX extension

<!-- languages: JavaScript, TypeScript -->

```md
[![Latest Visual Studio Marketplace version.](https://flat.badgen.net/vs-marketplace/v/PUBLISHER.EXTENSION?color=0E7490)](https://marketplace.visualstudio.com/items?itemName=PUBLISHER.EXTENSION) [![Visual Studio Marketplace installs.](https://flat.badgen.net/vs-marketplace/i/PUBLISHER.EXTENSION?color=BE185D)](https://marketplace.visualstudio.com/items?itemName=PUBLISHER.EXTENSION) [![Latest Open VSX version.](https://flat.badgen.net/open-vsx/version/NAMESPACE/EXTENSION?color=7E22CE)](https://open-vsx.org/extension/NAMESPACE/EXTENSION) [![Open VSX downloads.](https://flat.badgen.net/open-vsx/d/NAMESPACE/EXTENSION?color=C2410C)](https://open-vsx.org/extension/NAMESPACE/EXTENSION) [![Extension checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Chrome extension

<!-- languages: JavaScript, TypeScript -->

```md
[![Latest Chrome Web Store version.](https://flat.badgen.net/chrome-web-store/v/EXTENSION_ID?color=0E7490)](https://chromewebstore.google.com/detail/EXTENSION_ID) [![Chrome Web Store users.](https://flat.badgen.net/chrome-web-store/users/EXTENSION_ID?color=BE185D)](https://chromewebstore.google.com/detail/EXTENSION_ID) [![Chrome Web Store rating.](https://flat.badgen.net/chrome-web-store/rating/EXTENSION_ID?color=B45309)](https://chromewebstore.google.com/detail/EXTENSION_ID/reviews) [![Chrome Web Store rating count.](https://flat.badgen.net/chrome-web-store/rating-count/EXTENSION_ID?color=7E22CE)](https://chromewebstore.google.com/detail/EXTENSION_ID/reviews) [![Extension checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Firefox add-on

<!-- languages: JavaScript, TypeScript -->

```md
[![Latest Firefox Add-ons version.](https://flat.badgen.net/amo/v/ADDON_SLUG?color=0E7490)](https://addons.mozilla.org/firefox/addon/ADDON_SLUG/) [![Firefox Add-ons users.](https://flat.badgen.net/amo/users/ADDON_SLUG?color=BE185D)](https://addons.mozilla.org/firefox/addon/ADDON_SLUG/) [![Firefox Add-ons rating.](https://flat.badgen.net/amo/rating/ADDON_SLUG?color=B45309)](https://addons.mozilla.org/firefox/addon/ADDON_SLUG/reviews/) [![Firefox Add-ons reviews.](https://flat.badgen.net/amo/reviews/ADDON_SLUG?color=7E22CE)](https://addons.mozilla.org/firefox/addon/ADDON_SLUG/reviews/) [![Extension checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Microsoft Edge add-on

<!-- languages: JavaScript, TypeScript -->

```md
[![Latest Microsoft Edge Add-ons version.](https://flat.badgen.net/edge-addons/v/EXTENSION_ID?color=0E7490)](https://microsoftedge.microsoft.com/addons/detail/EXTENSION_ID) [![Microsoft Edge Add-ons users.](https://flat.badgen.net/edge-addons/users/EXTENSION_ID?color=BE185D)](https://microsoftedge.microsoft.com/addons/detail/EXTENSION_ID) [![Microsoft Edge Add-ons rating.](https://flat.badgen.net/edge-addons/rating/EXTENSION_ID?color=B45309)](https://microsoftedge.microsoft.com/addons/detail/EXTENSION_ID) [![Microsoft Edge Add-ons rating count.](https://flat.badgen.net/edge-addons/rating-count/EXTENSION_ID?color=7E22CE)](https://microsoftedge.microsoft.com/addons/detail/EXTENSION_ID) [![Extension checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

## Operating-system distribution

### Windows CLI distributed through winget and Scoop

<!-- languages: Language agnostic -->

```md
[![Latest winget version.](https://flat.badgen.net/winget/v/WINGET_PACKAGE_ID?color=0E7490)](https://github.com/microsoft/winget-pkgs) [![Latest Scoop version.](https://flat.badgen.net/scoop/v/SCOOP_PACKAGE?color=7E22CE)](https://scoop.sh/#/apps?q=SCOOP_PACKAGE) [![Latest release asset downloads.](https://flat.badgen.net/github/assets-dl/OWNER/REPO?color=C2410C)](https://github.com/OWNER/REPO/releases/latest) [![Release checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Homebrew formula

<!-- languages: Language agnostic -->

```md
[![Latest Homebrew formula version.](https://flat.badgen.net/homebrew/v/FORMULA?color=0E7490)](https://formulae.brew.sh/formula/FORMULA) [![Monthly Homebrew downloads.](https://flat.badgen.net/homebrew/dm/FORMULA?color=BE185D)](https://formulae.brew.sh/formula/FORMULA) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=7E22CE)](https://github.com/OWNER/REPO/releases/latest) [![Release checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Homebrew cask

<!-- languages: Language agnostic -->

```md
[![Latest Homebrew cask version.](https://flat.badgen.net/homebrew/cask/v/CASK?color=0E7490)](https://formulae.brew.sh/cask/CASK) [![Monthly Homebrew cask downloads.](https://flat.badgen.net/homebrew/cask/dm/CASK?color=BE185D)](https://formulae.brew.sh/cask/CASK) [![Latest release asset downloads.](https://flat.badgen.net/github/assets-dl/OWNER/REPO?color=C2410C)](https://github.com/OWNER/REPO/releases/latest) [![Release checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Snap package

<!-- languages: Language agnostic -->

```md
[![Latest Snap version.](https://flat.badgen.net/snapcraft/v/SNAP?color=0E7490)](https://snapcraft.io/SNAP) [![Snap distribution size.](https://flat.badgen.net/snapcraft/size/SNAP?color=C2410C)](https://snapcraft.io/SNAP) [![Supported Snap architectures.](https://flat.badgen.net/snapcraft/architecture/SNAP?color=6D28D9)](https://snapcraft.io/SNAP) [![Release checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![Snap license.](https://flat.badgen.net/snapcraft/license/SNAP?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Android app on F-Droid

<!-- languages: Java, Kotlin -->

```md
[![Latest F-Droid version.](https://flat.badgen.net/f-droid/v/APP_ID?color=0E7490)](https://f-droid.org/packages/APP_ID/) [![Release checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![F-Droid license.](https://flat.badgen.net/f-droid/license/APP_ID?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

## Community and custom metadata

### Open Collective project

<!-- languages: Language agnostic -->

The Open Collective contributors endpoint currently produces `undefined`; use GitHub's contributors count instead.

```md
[![Open Collective backers.](https://flat.badgen.net/opencollective/backers/COLLECTIVE?color=BE185D)](https://opencollective.com/COLLECTIVE) [![Open Collective yearly income.](https://flat.badgen.net/opencollective/yearly/COLLECTIVE?color=0F766E)](https://opencollective.com/COLLECTIVE) [![Open Collective balance.](https://flat.badgen.net/opencollective/balance/COLLECTIVE?color=047857)](https://opencollective.com/COLLECTIVE) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub contributors.](https://flat.badgen.net/github/contributors/OWNER/REPO?color=7E22CE)](https://github.com/OWNER/REPO/graphs/contributors) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Project with a Discord community

<!-- languages: Language agnostic -->

`DISCORD_ID_OR_SLUG` can be a supported public server identifier. Verify the preview before publishing.

```md
[![Latest stable release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![Discord community members.](https://flat.badgen.net/discord/members/DISCORD_ID_OR_SLUG?color=6D28D9)](https://discord.gg/INVITE_CODE) [![GitHub Actions checks on BRANCH.](https://flat.badgen.net/github/checks/OWNER/REPO/BRANCH)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Project with a Matrix community

<!-- languages: Language agnostic -->

Use the public room alias without the leading `#`. Matrix membership is the community signal; repository activity and licensing remain separate.

```md
[![Matrix room members.](https://flat.badgen.net/matrix/members/MATRIX_ROOM/MATRIX_SERVER?color=7E22CE)](https://matrix.to/#/#MATRIX_ROOM:MATRIX_SERVER) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub contributors.](https://flat.badgen.net/github/contributors/OWNER/REPO?color=0F766E)](https://github.com/OWNER/REPO/graphs/contributors) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Project with a Mastodon community

<!-- languages: Language agnostic -->

Keep the username and instance separate so the badge endpoint and profile destination both remain valid. This reports followers for a public profile; it is not a project-health signal.

```md
[![Mastodon followers.](https://flat.badgen.net/mastodon/follow/MASTODON_USER@MASTODON_SERVER?color=6D28D9)](https://MASTODON_SERVER/@MASTODON_USER) [![Latest stable GitHub release.](https://flat.badgen.net/github/release/OWNER/REPO/stable?color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![GitHub stars.](https://flat.badgen.net/github/stars/OWNER/REPO?color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub contributors.](https://flat.badgen.net/github/contributors/OWNER/REPO?color=0F766E)](https://github.com/OWNER/REPO/graphs/contributors) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Liberapay-funded open source

<!-- languages: Language agnostic -->

Liberapay exposes receiving, patron-count, and goal-progress signals. Keep only metrics the project intentionally makes part of its funding story.

```md
[![Liberapay receiving.](https://flat.badgen.net/liberapay/receives/LIBERAPAY_ACCOUNT?color=047857)](https://liberapay.com/LIBERAPAY_ACCOUNT/) [![Liberapay patrons.](https://flat.badgen.net/liberapay/patrons/LIBERAPAY_ACCOUNT?color=BE185D)](https://liberapay.com/LIBERAPAY_ACCOUNT/) [![Liberapay goal progress.](https://flat.badgen.net/liberapay/goal/LIBERAPAY_ACCOUNT?color=0F766E)](https://liberapay.com/LIBERAPAY_ACCOUNT/) [![GitHub contributors.](https://flat.badgen.net/github/contributors/OWNER/REPO?color=7E22CE)](https://github.com/OWNER/REPO/graphs/contributors) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/OWNER/REPO?color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Honest static project metadata

<!-- languages: Language agnostic -->

Static badges are appropriate for facts that change only when the repository changes. Do not use them to claim live build, coverage, security, or uptime status.

```md
[![API stability: stable.](https://flat.badgen.net/static/API/stable/047857)](https://github.com/OWNER/REPO/blob/BRANCH/docs/api.md) [![Module format: ESM.](https://flat.badgen.net/static/module/ESM/0E7490)](https://github.com/OWNER/REPO#usage) [![Platform: cross-platform.](https://flat.badgen.net/static/platform/cross-platform/6D28D9)](https://github.com/OWNER/REPO#compatibility) [![Code style: Prettier.](https://flat.badgen.net/static/code%20style/Prettier/A21CAF)](https://prettier.io) [![GitHub license.](https://flat.badgen.net/github/license/OWNER/REPO?color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

## Alternative and provider-native services

### Shields.io GitHub repository

<!-- languages: Language agnostic -->

Use `WORKFLOW_FILE` as a workflow filename such as `quality.yml`. Status colors remain dynamic.

```md
[![Latest GitHub release.](https://img.shields.io/github/v/release/OWNER/REPO?style=flat&color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions workflow status.](https://img.shields.io/github/actions/workflow/status/OWNER/REPO/WORKFLOW_FILE?branch=BRANCH&style=flat)](https://github.com/OWNER/REPO/actions/workflows/WORKFLOW_FILE) [![GitHub stars.](https://img.shields.io/github/stars/OWNER/REPO?style=flat&color=B45309)](https://github.com/OWNER/REPO/stargazers) [![GitHub forks.](https://img.shields.io/github/forks/OWNER/REPO?style=flat&color=C2410C)](https://github.com/OWNER/REPO/forks) [![GitHub open issues.](https://img.shields.io/github/issues/OWNER/REPO?style=flat&color=B91C1C)](https://github.com/OWNER/REPO/issues) [![GitHub contributors.](https://img.shields.io/github/contributors/OWNER/REPO?style=flat&color=7E22CE)](https://github.com/OWNER/REPO/graphs/contributors) [![GitHub license.](https://img.shields.io/github/license/OWNER/REPO?style=flat&color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Shields.io npm package

<!-- languages: JavaScript, TypeScript -->

```md
[![Latest npm version.](https://img.shields.io/npm/v/PACKAGE?style=flat&color=0E7490)](https://www.npmjs.com/package/PACKAGE) [![Monthly npm downloads.](https://img.shields.io/npm/dm/PACKAGE?style=flat&color=BE185D)](https://www.npmjs.com/package/PACKAGE) [![Supported Node.js versions.](https://img.shields.io/node/v/PACKAGE?style=flat&color=4D7C0F)](https://www.npmjs.com/package/PACKAGE) [![Bundled TypeScript declarations.](https://img.shields.io/npm/types/PACKAGE?style=flat&color=6D28D9)](https://www.npmjs.com/package/PACKAGE) [![Minified and gzipped package size.](https://img.shields.io/bundlephobia/minzip/PACKAGE?style=flat&color=C2410C)](https://bundlephobia.com/package/PACKAGE) [![GitHub Actions workflow status.](https://img.shields.io/github/actions/workflow/status/OWNER/REPO/WORKFLOW_FILE?branch=BRANCH&style=flat)](https://github.com/OWNER/REPO/actions/workflows/WORKFLOW_FILE) [![NPM license.](https://img.shields.io/npm/l/PACKAGE?style=flat&color=4338CA)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### shieldcn GitHub repository

<!-- languages: Language agnostic -->

```md
[![Latest GitHub release.](https://shieldcn.dev/github/OWNER/REPO/release.svg?size=xs)](https://github.com/OWNER/REPO/releases/latest) [![GitHub CI status.](https://shieldcn.dev/github/OWNER/REPO/ci.svg?size=xs)](https://github.com/OWNER/REPO/actions) [![GitHub stars.](https://shieldcn.dev/github/OWNER/REPO/stars.svg?size=xs)](https://github.com/OWNER/REPO/stargazers) [![GitHub forks.](https://shieldcn.dev/github/OWNER/REPO/forks.svg?size=xs)](https://github.com/OWNER/REPO/forks) [![GitHub open issues.](https://shieldcn.dev/github/OWNER/REPO/issues.svg?size=xs)](https://github.com/OWNER/REPO/issues) [![GitHub license.](https://shieldcn.dev/github/OWNER/REPO/license.svg?size=xs)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### shieldcn npm package

<!-- languages: JavaScript, TypeScript -->

```md
[![Latest npm version.](https://shieldcn.dev/npm/PACKAGE.svg?size=xs)](https://www.npmjs.com/package/PACKAGE) [![Weekly npm downloads.](https://shieldcn.dev/npm/PACKAGE/downloads.svg?size=xs)](https://www.npmjs.com/package/PACKAGE) [![Bundled TypeScript declarations.](https://shieldcn.dev/npm/types/PACKAGE.svg?size=xs)](https://www.npmjs.com/package/PACKAGE) [![NPM license.](https://shieldcn.dev/npm/license/PACKAGE.svg?size=xs)](https://github.com/OWNER/REPO/blob/BRANCH/LICENSE)
```

### Multi-provider npm package

<!-- languages: JavaScript, TypeScript -->

Keep only services configured for the project. `FILE_PATH` should identify the published build file whose gzip size matters.

```md
[![Latest npm version.](https://badge.fury.io/js/PACKAGE.svg)](https://www.npmjs.com/package/PACKAGE) [![NPM package summary.](https://nodei.co/npm/PACKAGE.svg?style=flat&data=n,d,u,s)](https://nodei.co/npm/PACKAGE/) [![Codecov coverage.](https://codecov.io/gh/OWNER/REPO/branch/BRANCH/graph/badge.svg)](https://codecov.io/gh/OWNER/REPO/branch/BRANCH) [![Known vulnerabilities.](https://snyk.io/test/github/OWNER/REPO/badge.svg)](https://snyk.io/test/github/OWNER/REPO) [![Gzipped build size.](https://img.badgesize.com/OWNER/REPO/BRANCH/FILE_PATH?compression=gzip)](https://github.com/OWNER/REPO/blob/BRANCH/FILE_PATH) [![GitHub network dependents.](https://dependents.info/OWNER/REPO/badge)](https://dependents.info/OWNER/REPO)
```

### Multi-provider Python package

<!-- languages: Python -->

Keep only services configured for the project; Codecov and Snyk must recognize the public repository.

```md
[![Latest PyPI version.](https://badge.fury.io/py/PACKAGE.svg)](https://pypi.org/project/PACKAGE/) [![Monthly PyPI downloads.](https://img.shields.io/pypi/dm/PACKAGE?style=flat&color=BE185D)](https://pypi.org/project/PACKAGE/) [![Supported Python versions.](https://img.shields.io/pypi/pyversions/PACKAGE?style=flat&color=4D7C0F)](https://pypi.org/project/PACKAGE/) [![Codecov coverage.](https://codecov.io/gh/OWNER/REPO/branch/BRANCH/graph/badge.svg)](https://codecov.io/gh/OWNER/REPO/branch/BRANCH) [![Known vulnerabilities.](https://snyk.io/test/github/OWNER/REPO/badge.svg)](https://snyk.io/test/github/OWNER/REPO) [![GitHub network dependents.](https://dependents.info/OWNER/REPO/badge)](https://dependents.info/OWNER/REPO)
```

### PlayBadges Android application

<!-- languages: Java, Kotlin -->

`APP_ID` must be a public Google Play package identifier. Compact PlayBadges rows are more README-friendly than the full app card.

```md
[![Google Play downloads.](https://playbadges.pavi2410.com/badge/downloads?id=APP_ID&pretty)](https://play.google.com/store/apps/details?id=APP_ID) [![Google Play rating.](https://playbadges.pavi2410.com/badge/ratings?id=APP_ID&pretty)](https://play.google.com/store/apps/details?id=APP_ID) [![Google Play version.](https://playbadges.pavi2410.com/badge/version?id=APP_ID)](https://play.google.com/store/apps/details?id=APP_ID) [![Latest GitHub release.](https://img.shields.io/github/v/release/OWNER/REPO?style=flat&color=0E7490)](https://github.com/OWNER/REPO/releases/latest) [![GitHub Actions workflow status.](https://img.shields.io/github/actions/workflow/status/OWNER/REPO/WORKFLOW_FILE?branch=BRANCH&style=flat)](https://github.com/OWNER/REPO/actions/workflows/WORKFLOW_FILE)
```

### Provider-native project health add-ons

<!-- languages: Language agnostic -->

These badges are intentionally conditional. Use them only when the public service or file is configured and the live preview is meaningful.

```md
[![Codecov coverage.](https://codecov.io/gh/OWNER/REPO/branch/BRANCH/graph/badge.svg)](https://codecov.io/gh/OWNER/REPO/branch/BRANCH) [![Known vulnerabilities.](https://snyk.io/test/github/OWNER/REPO/badge.svg)](https://snyk.io/test/github/OWNER/REPO) [![Public file size.](https://img.badgesize.com/OWNER/REPO/BRANCH/FILE_PATH)](https://github.com/OWNER/REPO/blob/BRANCH/FILE_PATH) [![Gzipped public file size.](https://img.badgesize.com/OWNER/REPO/BRANCH/FILE_PATH?compression=gzip)](https://github.com/OWNER/REPO/blob/BRANCH/FILE_PATH) [![GitHub network dependents.](https://dependents.info/OWNER/REPO/badge)](https://dependents.info/OWNER/REPO)
```

## Conditional badges: preview before keeping

<!-- languages: JavaScript, TypeScript, Python -->

These endpoints are official, but their upstream services or package analyzers can fail for an otherwise valid project. Add them one at a time and delete any badge that renders `429`, `500`, `error`, `unknown`, `undefined`, `timeout`, or `discontinued`.

```md
[![Minified and gzipped bundle size.](https://flat.badgen.net/bundlejs/minzip/PACKAGE?color=C2410C)](https://bundlejs.com/?q=PACKAGE)
[![Published package size.](https://flat.badgen.net/packagephobia/publish/PACKAGE?color=475569)](https://packagephobia.com/result?p=PACKAGE)
[![Installed package size.](https://flat.badgen.net/packagephobia/install/PACKAGE?color=7E22CE)](https://packagephobia.com/result?p=PACKAGE)
[![Monthly PyPI downloads.](https://flat.badgen.net/pypi/dm/PACKAGE?color=BE185D)](https://pypi.org/project/PACKAGE/)
[![Coveralls coverage.](https://flat.badgen.net/coveralls/c/github/OWNER/REPO/BRANCH)](https://coveralls.io/github/OWNER/REPO?branch=BRANCH)
[![DeepScan grade.](https://flat.badgen.net/deepscan/grade/team/DEEPSCAN_TEAM/project/DEEPSCAN_PROJECT/branch/DEEPSCAN_BRANCH)](https://deepscan.io/dashboard/#view=project&tid=DEEPSCAN_TEAM&pid=DEEPSCAN_PROJECT&bid=DEEPSCAN_BRANCH)
[![XO code style.](https://flat.badgen.net/xo/status/PACKAGE)](https://github.com/xojs/xo)
[![Tidelift subscription status.](https://flat.badgen.net/tidelift/npm/PACKAGE)](https://www.sonarsource.com/solutions/security/)
```

Avoid these currently poor choices unless Badgen or the upstream integration is repaired:

- Bundlephobia worked during this catalog refresh, but its analyzer can still return `429` or fail on unsupported packages; keep BundleJS as a fallback.
- Code Climate badges currently render `discontinued`.
- WAPM badges currently time out.
- The Matrix members endpoint currently renders an undefined count for known public rooms.
- The Open Collective contributors endpoint currently renders `undefined`; use GitHub contributors.
- Some GitLab release and license calls currently render `500`; the GitLab social row above avoids them.
- The legacy Dependabot badge documents Dependabot's old standalone service and should not be treated as a modern GitHub Dependabot status signal.
- The documented Jenkins, Badgesize, Reddit, and legacy Dependabot examples returned upstream `500` responses during this refresh.
- The documented WAPM example timed out, and the documented Codacy project rendered `unknown` despite returning HTTP `200`.

## Final README quality check

Before committing a row:

1. Replace every uppercase placeholder and search the rendered README for leftovers.
2. Open every badge image once and reject badges that show an error as their text even when the HTTP response is `200`.
3. Click every badge and confirm it lands on the exact package, workflow, report, issue list, or license.
4. Keep checks, uptime, coverage, and vulnerability colors dynamic.
5. Prefer five to eight strong signals. A registry version, compatibility, checks, adoption, issues, and license usually beat fifteen vanity counters.
6. Use concise sentence-style alt text with a final period, as in this library.
7. Keep the most actionable order: release or package, compatibility, quality, adoption, maintenance, license.
