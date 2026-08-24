# Releasing

`github-badge-layouts` is published on npm and uses the `release.yml` trusted publisher. Releases run through GitHub OIDC with `id-token: write`; do not create an `NPM_TOKEN` repository secret.

## Prepare a release

Prepare the version as a normal reviewed source change:

```powershell
npm version minor --no-git-tag-version
npm run release:verify
git add -- package.json package-lock.json
git commit -m "🔖 [chore] (release) prepare vX.Y.Z"
git push
```

Replace `minor` with `patch` or `major` and replace `X.Y.Z` according to the reviewed public contract. Merge the version change to `main`, wait for Quality, CodeQL, Pages, and SonarQube Cloud checks, then dispatch **Release** with the exact `package.json` version.

The workflow:

1. Refuses non-`main` dispatches and malformed or mismatched versions.
2. Runs `npm run release:verify` and requires a clean before/after worktree.
3. Checks whether the exact version is already on npm so an interrupted run can recover.
4. Publishes through npm trusted publishing with provenance when needed.
5. Creates or verifies the matching annotated `vX.Y.Z` tag.
6. Creates the GitHub release with generated notes when missing.

Do not dispatch a second version merely because an infrastructure step failed. Inspect the exact npm version, tag, and GitHub release first; the workflow is designed to finish missing artifacts for the same version on rerun.

## SonarQube Cloud analysis

The `Nick2bad4u_github-badge-layouts` project uses SonarQube Cloud Automatic Analysis through the installed GitHub App. Do not add a `SONAR_TOKEN` or a CI scanner while Automatic Analysis is enabled; SonarQube Cloud treats the two analysis methods as conflicting.

[Automatic Analysis](https://docs.sonarsource.com/sonarqube-cloud/analyzing-source-code/automatic-analysis) reads its supported repository settings from `.sonarcloud.properties`. It does not read `sonar-project.properties` and cannot import coverage reports. Codecov remains the coverage authority and uploads through GitHub OIDC without a repository token.
