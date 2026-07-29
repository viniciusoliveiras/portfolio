# ADR-0003: Package manager and Node baseline

- **Status**: Accepted
- **Date**: 2026-07-27
- **Resolves**: [Plan the move from Yarn Berry to pnpm, and fix the Node baseline](https://github.com/viniciusoliveiras/portfolio/issues/8), on [the migration map](https://github.com/viniciusoliveiras/portfolio/issues/1)

## Context

The repo runs Yarn Berry: `yarnPath: .yarn/releases/yarn-berry.cjs`, `nodeLinker: node-modules`, the `@yarnpkg/plugin-interactive-tools` plugin, and a 247 KB `yarn.lock`. It declares **no Node version at all** — no `engines`, no `.nvmrc`, no `.node-version`.

Four measurements taken on 2026-07-27 shaped every decision below.

**`.yarn/cache` is committed — 732 dependency zips, 75 MB.** So is `.yarn/install-state.gz`, which is machine-local state that was never meant to be in git. `.git` is **71 MB across 100 commits** for a project with **1,584 lines of source**: the dependency zips are roughly 95% of the repository. The ticket asked "is any of it committed?" — nearly all of it is.

**The repo has zero phantom-dependency reliance.** Every bare import across `src/` — `axios`, `@chakra-ui/icons`, `@chakra-ui/react`, `@chakra-ui/theme-tools`, `date-fns`, `next`, `react`, `react-github-calendar`, `react-icons`, `react-parallax-tilt`, `react-tooltip`, `typewriter-effect` — is a declared direct dependency. This single fact decides the hoisting question.

**The globally-installed pnpm is `10.33.2` at `~/.nvm/versions/node/v24.18.0/bin/pnpm`.** That is `npm i -g` under nvm, which makes it **per-Node-version**: it is already a major behind the pin, and it evaporates the moment Node is upgraded. The bootstrap problem is not hypothetical, it is the current state.

**Corepack is not the answer, but neither is an external tool.** [Pin the target stack versions and release status](https://github.com/viniciusoliveiras/portfolio/issues/2) established that Corepack ships only up to Node 25, therefore not in Node 26 LTS, and concluded the migration needs a standalone installer or a CI action. That conclusion is half right — see below.

Version pins come from that same ticket: `pnpm@11.17.0`, `Node 24.18.0` (Active LTS), floor **Node ≥ 22.13** set by pnpm 11's own `engines`.

## Decision

### The research's premise was overtaken: pnpm 11 does Corepack's job itself

Checked against [pnpm.io/settings](https://pnpm.io/settings) and [pnpm.io/package_json](https://pnpm.io/package_json) on 2026-07-27:

- `managePackageManagerVersions` was **removed in pnpm v11**, replaced by **`pmOnFail`**, whose **default is `download`** — _"download and run the declared pnpm version."_
- **`devEngines.packageManager` was added in v11.0.0.** Unlike the legacy `packageManager` field it **supports version ranges**, and its resolved version is written into `pnpm-lock.yaml` under `packageManagerDependencies`.

So version pinning needs no Corepack, no Volta, no `pnpm/action-setup`. pnpm manages pnpm.

```jsonc
"devEngines": {
  "packageManager": { "name": "pnpm", "version": ">=11.0.0 <12.0.0", "onFail": "download" }
},
"packageManager": "pnpm@11.17.0"
```

The range states what the project actually requires and the exact resolved version lands in the lockfile, so patch bumps are not hand-edits. ~~The legacy `packageManager` field is carried **alongside** as one line of insurance for hosts and bots that read it (Vercel, Renovate) — cheap to drop if [Choose the deployment target and rendering mode](https://github.com/viniciusoliveiras/portfolio/issues/9) finds nothing reads it.~~

> **Corrected 2026-07-29 — `packageManager` is dropped, via this section's own escape hatch.** Carrying both fields is not free: pnpm 11 compares them, finds a range against an exact version, and warns on **every install**, twice —
>
> ```
> [WARN] "packageManager" and "devEngines.packageManager" specify different versions
> of pnpm in package.json. "packageManager" will be ignored
> ```
>
> — and, as it says, ignores the field anyway. The two cannot be reconciled without giving up the range this section chose it for. The stated condition for dropping it is met on the evidence: [ADR-0004](0004-deployment-target-and-rendering-mode.md) needs an `installCommand` override *because* Vercel reads nothing usable from this manifest, and [the CI workflow](../ci-workflow.md) §3 requires `pnpm/action-setup`'s `version:` explicitly *because* that action "can read nothing from this repo's manifest". Both named consumers demonstrably do not use it.
>
> **A consequence this section could not have seen**, found in the first real Vercel build and recorded in full in ADR-0004: choosing `devEngines.packageManager` is what makes **`npm run build` fail outright** there. npm 11 enforces the field, and Vercel — unable to parse a pnpm 11 lockfile — defaults to npm as the runner. That is not an argument against the choice; it is the reason a `buildCommand` override is now mandatory.

What still needs solving is the **bootstrap** — some pnpm must exist before pnpm can manage itself. That is a one-time, per-machine step, deliberately **outside** Node so it survives the v26 upgrade:

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

This installs to `~/.local/share/pnpm`, outside nvm's per-version `bin`. Re-running `npm i -g pnpm` would reproduce exactly the failure the project has today.

### Node is declared twice, deliberately

```jsonc
"engines": { "node": ">=22.13.0" }
```
```
// .nvmrc
24.18.0
```

`engines` states the **real compatibility floor** — 22.13, from pnpm 11, intersected with Start's `>=22.12.0` and Vite's `^20.19.0 || >=22.12.0`. Because it is the true constraint rather than an aspiration, it does not lie, does not need editing when v26 lands, and does not need to know what the host runs — which keeps this ADR from being blocked on the deployment ticket.

`.nvmrc` pins the **developer's** runtime exactly, so local and CI agree. `.nvmrc` and not `.node-version` because nvm is the manager actually in use here (`~/.nvm`, sourced from `.zshrc`) and nvm is the one tool that reads only `.nvmrc`.

Splitting the two means the constraint and the convenience never fight. **v24 enters maintenance 2026-10-20**, about three months out; the bump to v26 is then a one-line change to one file, with `engines` untouched.

### Settings live in `pnpm-workspace.yaml`, and this repo gets no `.npmrc`

The single most likely thing to get wrong, because the whole ecosystem's muscle memory is `.npmrc`. From [pnpm.io/settings](https://pnpm.io/settings), checked 2026-07-27:

> _"Only auth and registry settings are read from `.npmrc` files. All other settings (like `hoistPattern`, `nodeLinker`, `shamefullyHoist`, etc.) must be configured in `pnpm-workspace.yaml` or the global `~/.config/pnpm/config.yaml`."_

Names are **camelCase** in `pnpm-workspace.yaml`, kebab-case only in `.npmrc`. This repo has no auth or registry needs, so **no `.npmrc` is created**.

```yaml
# pnpm-workspace.yaml
strictPeerDependencies: true
allowBuilds:
  lefthook: true
```

### Peer dependencies are strict; hoisting is not configured at all

pnpm 11 defaults, verified 2026-07-27:

| Setting | Default | Decision |
| --- | --- | --- |
| `nodeLinker` | `isolated` | **keep** — replaces Yarn's `node-modules` linker |
| `hoist` | `true` (to `node_modules/.pnpm/node_modules`) | **keep** |
| `publicHoistPattern` | `[]` | **keep empty** |
| `shamefullyHoist` | `false` | **keep** |
| `autoInstallPeers` | `true` | **keep** |
| `strictPeerDependencies` | `false` | **override to `true`** |

**No hoisting configuration, justified by measurement rather than optimism**: the import audit above found every bare import is a declared dependency, so the strict layout has nothing to break. The new dependency set also lacks the classic pnpm pain points — Tailwind v4 is a Vite plugin rather than PostCSS, Biome replaces 14 ESLint packages whose plugin resolution is the usual source of hoisting complaints, and Next is gone.

**`strictPeerDependencies: true` is the one override.** [Decide the fate of each non-Chakra runtime dependency](https://github.com/viniciusoliveiras/portfolio/issues/4) kept exactly three runtime dependencies on React-19 compatibility grounds. At the defaults, a package declaring `peerDependencies: react ^18` installs silently against React 19.2.8 — which is precisely how that verdict would turn out to be wrong, discovered at runtime or never. Strict peers turn it into an install-time error read once. The blast radius of being strict is two or three packages; the escape hatch is a `pnpm.overrides` entry, which has the virtue of *documenting* the override instead of hiding it. `autoInstallPeers` stays on so the common case stays frictionless.

### `allowBuilds` is load-bearing, and omitting it fails the install outright

pnpm blocks dependency lifecycle scripts by default, and **`onlyBuiltDependencies` — the setting the ecosystem knows — was removed in v11**, replaced by `allowBuilds` (a map of matcher → boolean, in `pnpm-workspace.yaml`).

This bites immediately. **`lefthook@2.1.10` ships `"postinstall": "node postinstall.js"`** to fetch its platform binary, and lefthook is the pre-commit tool [ADR-0002](0002-typescript-and-biome-baseline.md) just committed to. Worse than a broken hook: **`strictDepBuilds` defaults to `true`**, and _"the installation will exit with a non-zero exit code if any dependencies have unreviewed build scripts."_ Without `allowBuilds: { lefthook: true }`, **`pnpm install` fails on a fresh clone.**

### The lockfile is regenerated, not imported

`pnpm import` exists to preserve resolved versions from `yarn.lock`. Every dependency in this file is being replaced — React 17→19, Next→TanStack Start, Chakra→Tailwind, ESLint/Prettier→Biome, TypeScript 4.3→7. There is nothing to preserve. `yarn.lock` is deleted and `pnpm install` writes `pnpm-lock.yaml` from scratch.

### `scripts`

```jsonc
"scripts": {
  "dev": "vite dev",
  "build": "vite build && tsc --noEmit",
  "preview": "vite preview",
  "check": "biome check",
  "check:write": "biome check --write",
  "typecheck": "tsc --noEmit",
  "prepare": "lefthook install"
}
```

Shape follows TanStack Router's maintained `examples/react/start-basic` (fetched 2026-07-27), the same source [ADR-0002](0002-typescript-and-biome-baseline.md) used for the TypeScript pair. `check`, `check:write` and `typecheck` are the three that ADR requires to exist.

**`build` chains the typecheck, and the order is `vite build && tsc --noEmit`, not the reverse.** Chaining was a deliberate call — a broken type must not reach a deploy even if CI is bypassed. The *order* is not stylistic: the TanStack Router Vite plugin **regenerates `routeTree.gen.ts` during the build**, and that file is **committed, not gitignored** (confirmed against the example's own `.gitignore`). Typechecking after the build therefore checks the real route tree; typechecking first could pass against a stale one. CI still runs `biome ci` and `tsc --noEmit` as separate steps per ADR-0002, so lint and type failures stay distinguishable there.

**`prepare: lefthook install`** installs git hooks on a fresh clone with no extra step. pnpm's build blocking applies to *dependencies*; the project's own `prepare` runs normally. The command and the `lefthook.yml` filename are lefthook v2's.

**No `start` script.** [ADR-0001](0001-information-architecture.md) makes the site fully static, so `node .output/server/index.mjs` may point at a file the build never produces. [Choose the deployment target and rendering mode](https://github.com/viniciusoliveiras/portfolio/issues/9) owns whether it comes back; `preview` covers looking at a production build locally.

**`buildanalyze` dies, taking `cross-env` with it.** [The dependency ticket](https://github.com/viniciusoliveiras/portfolio/issues/4) found `@next/bundle-analyzer` already commented out, so the script has been inert.

### File-level changes

**Created** — `.nvmrc`, `pnpm-workspace.yaml`, `pnpm-lock.yaml` (generated).

**Deleted — 736 files, ~75 MB**:

| Path | Files |
| --- | --- |
| `.yarn/cache/*.zip` | 732 |
| `.yarn/install-state.gz` | 1 |
| `.yarn/releases/yarn-berry.cjs` | 1 |
| `.yarn/plugins/@yarnpkg/plugin-interactive-tools.cjs` | 1 |
| `.yarnrc.yml` | 1 |
| `yarn.lock` | 1 |

**Edited** — `package.json` (`scripts`, `engines`, `devEngines`, `packageManager`), and `.gitignore`:

```gitignore
# dependencies
node_modules

# build output
.output
.nitro
.tanstack
dist

# misc
.DS_Store
*.pem

# debug
npm-debug.log*

# local env files
.env*.local

# vercel
.vercel
```

Removed: `/.pnp` and `.pnp.js` (Yarn PnP, never used — `nodeLinker` was `node-modules`), `yarn-debug.log*`, `yarn-error.log*`, `/.next/`, `/out/`, `/build`, `/coverage`. Added: `.output`, `.nitro`, `.tanstack`, `dist`, taken from the maintained example's own `.gitignore`.

**Not created**: `.npmrc`.

### Purging `.yarn/` from git history — a flagged, separate step

Deleting the files leaves 75 MB in history forever. The purge is:

```sh
git filter-repo --path .yarn/ --invert-paths
```

followed by a force-push. **~71 MB → ~2 MB clone.**

The usual reason to refuse a history rewrite is that it breaks every clone and invalidates every commit SHA. Measured on 2026-07-27, there is no one on the other end: **0 forks, 0 stars, no open PRs, one branch (`main`), one author.** The blast radius is as small as a public repo's ever gets, and the repo's entire purpose is to be cloned and read by people evaluating the author.

It is nonetheless **irreversible and outward-facing**, which is why it is recorded here as a step an implementer performs **deliberately and separately** — never as a side effect of "migrate to pnpm."

## Consequences

**The CI fog patch is fully specifiable.** [ADR-0002](0002-typescript-and-biome-baseline.md) fixed the Biome half and left the pnpm and Node baselines open; both are now closed, along with lefthook's install path. Graduated to [Specify the CI workflow](https://github.com/viniciusoliveiras/portfolio/issues/18).

**CI inherits a simplification.** Because pnpm self-manages via `devEngines`, CI needs no `pnpm/action-setup` and no `corepack enable` — `actions/setup-node` with `node-version-file: .nvmrc`, then any pnpm 11, which fetches the pinned version itself. That is the CI ticket's to confirm, not this one's to assert.

**One known expiry.** Node 24 enters maintenance 2026-10-20 and v26 becomes LTS 2026-10-28. The bump is `.nvmrc` only. **Do not reintroduce Corepack at that point** — it does not exist in v26.

**A trap for anyone editing pnpm config later.** Reaching for `.npmrc` or `onlyBuiltDependencies` will silently do nothing: the first is read only for auth and registry, the second was removed in v11. Settings go in `pnpm-workspace.yaml`, camelCase, and build approval is `allowBuilds`.

### ADR numbering

This takes `0003`. The design brief was promoted to [ADR-0005](0005-visual-direction.md) on 2026-07-29 by [Assemble the deliverable](https://github.com/viniciusoliveiras/portfolio/issues/22) — not `0004`, as this line guessed while the question was still open.
