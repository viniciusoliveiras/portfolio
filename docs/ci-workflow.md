# CI workflow

Resolves [Specify the CI workflow](https://github.com/viniciusoliveiras/portfolio/issues/18). Decided 2026-07-28.

Every version, SHA and runner-image fact below was **read from the registry or the image manifest**, not from an example. Three of the ticket's own premises turned out to be wrong, and pnpm's officially documented workflow is stale on all three of its action versions.

---

## 1. The workflow

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    name: Lint and typecheck
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v7

      # pnpm MUST come before setup-node: `cache: pnpm` resolves the store
      # path by invoking pnpm, so the binary has to exist already.
      # `version` is REQUIRED — this action reads the `packageManager` field
      # and never `devEngines.packageManager`, which is the one this repo uses.
      # Installing "any pnpm 11" is deliberate: devEngines + pmOnFail:download
      # then corrects to the pinned 11.17.0, keeping one source of truth.
      - name: Install pnpm
        uses: pnpm/action-setup@0ebf47130e4866e96fce0953f49152a61190b271 # v6.0.9
        with:
          version: 11

      - name: Install Node
        uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc
          cache: pnpm

      # No --ignore-scripts, deliberately: this is the fresh-clone install canary.
      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm exec biome ci

      # !cancelled() so a lint failure cannot mask a type error.
      - name: Typecheck
        if: ${{ !cancelled() }}
        run: pnpm typecheck
```

**No `package.json` and no `pnpm-workspace.yaml` changes are forced.** `biome ci` is invoked through `pnpm exec` rather than added as a script, because it is a CI-only command — locally the useful entry points are `check` and `check:write`, and a script alias would imply otherwise. ADR-0003's scripts object stands unchanged.

---

## 2. Decisions

| Question | Decision |
| --- | --- |
| pnpm bootstrap | **`pnpm/action-setup`, SHA-pinned, explicit `version: 11`** |
| Route-tree drift guard | **None.** Accepted, per ADR-0004's scope |
| Triggers | **`pull_request` + `push` to `main`**, no path filters |
| Job shape | **One job**, sequential named steps, typecheck guarded by `!cancelled()` |
| Install | **Real install**, scripts allowed to run |
| Build / deploy | **Neither.** Settled by ADR-0004 |

---

## 3. The premise that was wrong: pnpm does not bootstrap itself

The ticket asserted that CI needs **no** `pnpm/action-setup` and **no** `corepack enable`, because `devEngines.packageManager` with `pmOnFail: download` makes any pnpm 11 fetch the pinned version. It asked for that to be confirmed on a clean runner rather than inherited. It does not hold.

**pnpm is not on the runner image.** The `ubuntu-24.04` manifest lists `Node.js 22.23.1`, `Npm 10.9.8` and `Yarn 1.22.22`. No pnpm. So the `devEngines` mechanism has nothing to run it — **it needs a pnpm in order to read the field that says which pnpm to use.** The bootstrap problem ADR-0003 identified for the dev machine, and solved with the standalone installer, exists identically here.

What the mechanism *does* still do is the pinning. `pmOnFail` defaults to `download` and, per pnpm's settings reference, *"overrides the `onFail` behavior of both the `packageManager` field and `devEngines.packageManager` when the running pnpm version does not match the declared one"*. So `version: 11` supplies a bootstrap and `devEngines` corrects to `11.17.0`.

That division is not invented here — **ADR-0004 already made the identical call for Vercel**, installing "any pnpm 11" via `installCommand` and letting `devEngines` correct it, expressly to preserve a single source of truth. CI matching Vercel is the point.

### `version:` is mandatory, and this is the trap

`pnpm/action-setup` documents `version` as *"**Optional** when there is a `packageManager` field in the `package.json`. otherwise, this field is **required**"* — and it says nothing about `devEngines.packageManager`.

**ADR-0003 deliberately chose `devEngines.packageManager` over `packageManager`** because it is range-capable and resolved into the lockfile. The consequence is that this action can read *nothing* from this repo's manifest. Omit `version:` expecting the pin to be honoured and the step fails outright.

### Why not Corepack

Corepack would work today and expire. From its own README: *"Corepack is distributed with Node.js from version 14.19.0 up to (but not including) 25.0.0."* The `.nvmrc` pin of `24.18.0` therefore bundles it — but it is gone at Node 25, hence gone from Node 26 LTS. Building CI on it means CI breaks at a routine Node bump, which is precisely the reasoning ADR-0003 used to drop Corepack in the first place.

### The SHA pin is not the SHA the tag ref returns

Third-party actions are pinned by commit SHA; first-party `actions/*` ride their major tag. Getting that SHA has a trap:

```
GET /repos/pnpm/action-setup/git/refs/tags/v6.0.9
  → { "type": "tag", "sha": "008330803749db0355799c700092d9a85fd074e9" }   ← annotated TAG object

GET /repos/pnpm/action-setup/commits/v6.0.9
  → { "sha": "0ebf47130e4866e96fce0953f49152a61190b271" }                  ← the COMMIT
```

`v6.0.9` is an **annotated tag**, so the ref points at a tag object, not a commit. `uses:` resolves against commits, so pinning the first value fails. The workflow above uses `0ebf4713…`.

### pnpm's own documented workflow is stale

Checked against the registry on 2026-07-28:

| pnpm's example | Actual latest |
| --- | --- |
| `actions/checkout@v6` | **v7.0.1** (2026-07-20) |
| `actions/setup-node@v6` | **v7.0.0** (2026-07-14) |
| `pnpm/action-setup` v6.0.5 | **v6.0.9** (2026-06-15) |

Two things it gets right and are kept: **pnpm is installed before `setup-node`**, and `cache: pnpm` is set on `setup-node`. The ordering is load-bearing rather than stylistic — `cache: pnpm` resolves the store path by invoking pnpm, so a reversed order fails on a runner that has no pnpm.

---

## 4. Why there is no route-tree guard

`routeTree.gen.ts` is committed, sits inside `include`, and **is** typechecked — that is how route type-safety works. ADR-0002 stated the requirement as *"It must therefore be committed, or generated before `tsc` runs in CI."* It is committed, so the requirement is met. But CI runs `tsc --noEmit` without building, so it typechecks whatever tree is committed: edit route files, commit without regenerating, and CI passes against a stale tree that is internally consistent.

Accepted, on two counts that shrink the exposure to near nothing:

- **The plugin generates on dev, not only build.** The routing docs say it generates *"through your bundler's dev and build processes"*, so the file self-heals for anyone who so much as starts the app.
- **Vercel rebuilds every push** with `vite build && tsc --noEmit` in that order, so the deployed artifact is always built from a freshly generated tree. ADR-0004 already designated that build the authoritative typecheck.

Drift therefore requires editing routes, never once running the app, and pushing. The available guard — `tsr generate` (the `tsr` binary ships in `@tanstack/router-cli@1.167.21`) followed by `git diff --exit-code` — costs a devDependency nothing else in the stack needs, against a map that has been deliberately stingy about dependencies. **Trigger to reopen:** the repo gains contributors who might edit routes without running the app, or `routeTree.gen.ts` is ever found stale on `main`.

---

## 5. Triggers, job shape, install

### `pull_request` + `push` to `main`, no path filters

Direct pushes to `main` are this repo's actual pattern, so PR-only would leave `main` unverified.

**No path filter, despite this repo's history being almost entirely `docs:` commits.** A path filter is *structural*: GitHub keeps a skipped workflow's checks in a **Pending** state, which blocks merging when the check is required. There is no branch protection today — verified, `/branches/main/protection` returns 404 and `/rulesets` is empty — so nothing breaks now, but a filter would become a silent merge-blocker the day protection is added.

`[skip ci]` carries the *identical* pending-check caveat (it applies to `push` and `pull_request` only), so it is not a safer mechanism — but it is **per-commit and opt-in**, so the risk is visible when invoked instead of lying in the config. That is the whole reason to prefer it over a filter for the occasional docs-only commit.

### One job, and the typecheck always reports

Both checks need the same install, and on a project this size the **install dominates the runtime**, not the checks. Two parallel jobs would duplicate checkout, Node setup and install to parallelise the cheap part.

ADR-0002's requirement is that a lint failure and a type failure be *"distinguishable at a glance"*, which two separately-named **steps** already satisfy. The one real cost of sequencing — a lint failure stopping the run before typecheck, so you fix lint, push, and only then meet the type error — is removed by `if: ${{ !cancelled() }}`. Both always report, off one install.

`biome ci` runs **without `--error-on-warnings`**, per ADR-0002: collapsing warn into error would make the per-rule severity design decorative.

### The install is CI's most valuable step

**No `--ignore-scripts`.** ADR-0003 found a hard failure: `lefthook@2.1.10` has a binary-fetching `postinstall`, `strictDepBuilds` defaults to `true`, and omitting `allowBuilds: { lefthook: true }` makes `pnpm install` **fail outright** on a fresh clone. Suppressing scripts in CI would mean CI never exercises that path, leaving a fresh-clone contributor or Vercel to discover it.

So a real install makes CI a **fresh-clone install canary**, which is arguably worth more here than the lint — Lefthook's pre-commit hook already catches lint before a commit exists, whereas nothing else checks that a clean clone installs. Cost is a few megabytes of lefthook binary and a `prepare: lefthook install` writing hooks into a throwaway container.

`--frozen-lockfile` is explicit for documentation; pnpm already defaults it to true when `CI` is set.

**`lefthook run pre-commit --all-files` is not a CI step.** Its pre-commit command is `biome check --write`, so it duplicates `biome ci` *and* writes files, which is the wrong shape for a verification step.

### `runs-on: ubuntu-24.04`, pinned

Not `ubuntu-latest`. The image contents are load-bearing here — the absence of pnpm is what forces the whole bootstrap decision above — and `ubuntu-latest` moves under you. Revisit when 24.04 approaches runner EOL.

`permissions: contents: read` is least-privilege; the workflow only reads code. `concurrency` with `cancel-in-progress` stops superseded pushes from queuing.

### CI does not build and does not deploy

Both settled by ADR-0004: Vercel's git integration deploys on push, production from `main` and a preview per branch, and its build is the authoritative typecheck. CI is the fast pre-check and the net for anything that bypassed the pre-commit hook.

---

## 6. What this hands to other tickets

- **[Decide the migration strategy and cutover order](https://github.com/viniciusoliveiras/portfolio/issues/19)** — **a precondition in ADR-0003 has expired.** That ADR justified its `git filter-repo` history purge as *"safe here at 0 forks / 0 stars / 1 branch"*. The repo now has **1 fork** — `mirkosalvato1-ctrl/portfolio`, created 2026-07-28, one day after the ADR was written. A history rewrite with a fork in the network does not fully purge: the fork retains the old `.yarn/cache` objects and GitHub keeps them reachable through the fork network. The *"~71 MB → ~2 MB fresh clone"* outcome still holds for the canonical repo; "purge" in the sense of removing the blobs from GitHub does not. That ticket owns the irreversible step and should re-decide it against the new fact.
- Also inherits one new file, `.github/workflows/ci.yml`, and **no** `package.json` or `pnpm-workspace.yaml` change.
- **[ADR-0002](adr/0002-typescript-and-biome-baseline.md) and [ADR-0004](adr/0004-deployment-target-and-rendering-mode.md) disagree on the CI lint command** — ADR-0002 §"Where it runs" says `biome ci`, ADR-0004 §"CI lints and typechecks" says `biome check`. Resolved to **`biome ci`**: ADR-0002 is the toolchain ADR and specifies the flag policy alongside it. ADR-0004's wording should be read as loose, and corrected if it is ever promoted.
