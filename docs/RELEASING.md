# Releasing

The package name `github-badge-layouts` was unclaimed when this repository was prepared. The maintainer must perform the first npm publication and configure trusted publishing; repository automation intentionally does not attempt that bootstrap.

## One-time npm bootstrap

1. Confirm npm authentication and account-level two-factor policy:

   ```powershell
   npm whoami
   npm profile get "two-factor auth"
   ```

2. From a clean `main` checkout, run the immutable release gate:

   ```powershell
   npm ci
   npm run release:verify
   npm pack --dry-run
   ```

3. Publish `0.1.0` manually:

   ```powershell
   npm publish --access public
   ```

   Supply an OTP when npm requests one. The local bootstrap publish does not request provenance because npm provenance is designed for supported cloud CI environments.

4. On npm, open the package's trusted-publisher settings and add this GitHub Actions publisher exactly:

   | Setting              | Value                  |
   | -------------------- | ---------------------- |
   | Organization or user | `Nick2bad4u`           |
   | Repository           | `github-badge-layouts` |
   | Workflow filename    | `release.yml`          |
   | Environment          | `npm`                  |

5. In GitHub repository settings, review the `npm` environment created for the release job. Add required reviewers or branch restrictions if desired. Do not create an `NPM_TOKEN` secret; the release job uses GitHub OIDC with `id-token: write`.

## Subsequent releases

Prepare the version as a normal reviewed source change:

```powershell
npm version patch --no-git-tag-version
npm run release:verify
git add -- package.json package-lock.json
git commit -m "🔖 [chore] (release) prepare v0.1.1"
git push
```

Use `minor` or `major` instead of `patch` when the public API contract requires it. Merge the version change to `main`, wait for Quality, CodeQL, and Pages checks, then dispatch **Release** with the exact `package.json` version.

The workflow:

1. Refuses non-`main` dispatches and malformed or mismatched versions.
2. Runs `npm run release:verify` and requires a clean before/after worktree.
3. Checks whether the exact version is already on npm so an interrupted run can recover.
4. Publishes through npm trusted publishing with provenance when needed.
5. Creates or verifies the matching annotated `vX.Y.Z` tag.
6. Creates the GitHub release with generated notes when missing.

Do not dispatch a second version merely because an infrastructure step failed. Inspect the exact npm version, tag, and GitHub release first; the workflow is designed to finish missing artifacts for the same version on rerun.

## SonarQube Cloud handoff

The repository already declares project key `Nick2bad4u_github-badge-layouts`. Import the GitHub repository into the `nick2bad4u` SonarQube Cloud organization, create a scoped analysis token, and store it as the GitHub Actions secret `SONAR_TOKEN`. Quality runs warn and skip Sonar analysis until that secret exists; Codecov uses OIDC and does not require a repository token in the workflow.
