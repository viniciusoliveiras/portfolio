# Target stack: versions and release status

Research asset for [Pin the target stack versions and release status](https://github.com/viniciusoliveiras/portfolio/issues/2), a ticket on [Map: migrate the portfolio to TanStack Start + Tailwind, with a redesign](https://github.com/viniciusoliveiras/portfolio/issues/1).

**All rows checked 2026-07-27.** Nothing here is from model memory; every version was read from the npm registry or a primary vendor document, cited per row. Re-verify before implementation begins — these move weekly.

## Version table

| Piece | Pin | Released | Status | Source (checked 2026-07-27) |
| --- | --- | --- | --- | --- |
| TanStack Start (React) | `@tanstack/react-start@1.168.32` | 2026-07-19 | **Release Candidate — not GA** | [registry](https://registry.npmjs.org/@tanstack/react-start), [docs overview](https://tanstack.com/start/latest/docs/framework/react/overview) |
| TanStack Router | `@tanstack/react-router@1.170.18` | 2026-07-13 | Stable | [registry](https://registry.npmjs.org/@tanstack/react-router) |
| React | `react@19.2.8` / `react-dom@19.2.8` | 2026-07-21 | Stable | [registry](https://registry.npmjs.org/react) |
| Vite | `vite@8.1.5` | 2026-07-16 | Stable (`previous` tag = 7.3.6) | [registry](https://registry.npmjs.org/vite) |
| Tailwind CSS | `tailwindcss@4.3.3` | 2026-07-16 | Stable | [registry](https://registry.npmjs.org/tailwindcss) |
| Tailwind Vite plugin | `@tailwindcss/vite@4.3.3` | 2026-07-16 | Stable | [registry](https://registry.npmjs.org/@tailwindcss/vite) |
| TypeScript | `typescript@7.0.2` | 2026-07-08 (7.0 GA) | Stable, **no LTS line** | [registry](https://registry.npmjs.org/typescript), [TS 7.0 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) |
| Biome | `@biomejs/biome@2.5.5` | 2026-07-21 | Stable | [registry](https://registry.npmjs.org/@biomejs/biome) |
| pnpm | `pnpm@11.17.0` | 2026-07-23 | Stable (10.34.5 still current on `latest-10`) | [registry](https://registry.npmjs.org/pnpm) |
| Node | `24.18.0` (Krypton) | 2026-06-23 | **Active LTS** until 2026-10-20 | [nodejs/Release schedule](https://raw.githubusercontent.com/nodejs/Release/main/schedule.json), [dist index](https://nodejs.org/dist/index.json) |

## Per-piece detail

### TanStack Start — still RC, and the version number hides it

The single most important finding. `@tanstack/react-start@1.168.32` carries the `latest` npm tag and a `1.x` version, which reads as GA. It is not.

- Start's own overview page says: _"TanStack Start is currently in the **Release Candidate** stage! This means it is considered feature-complete and its API is considered stable."_ It adds: _"This does not mean it is bug-free or without issues."_ ([docs](https://tanstack.com/start/latest/docs/framework/react/overview), checked 2026-07-27)
- The React docs are served under a **`v0`** path — `tanstack.com/start/v0/docs/framework/react/...` — and `/start/latest/` aliases it. Docs versioning still says v0.
- **The `1.x` in the package version is not a v1 milestone.** `@tanstack/react-start`'s first stable publish was `1.111.10` on 2025-02-25; it inherits TanStack Router's version line. 642 stable releases to date. Do not read the major as a stability signal.
- The [v1 RC announcement](https://tanstack.com/blog/announcing-tanstack-start-v1) is dated 2025-09-22 and says _"We plan to cut 1.0 shortly after collecting RC feedback"_ — still uncut ~10 months later. It also promises _"any breaking changes will be clearly documented… only light polish remains. No major API shifts"_ and that RSC lands as a _"non-breaking v1.x addition."_

Constraints declared by the package itself ([manifest](https://registry.npmjs.org/@tanstack/react-start/latest)):

```
engines:  node >=22.12.0
peerDeps: vite >=7.0.0            (optional)
          react >=18.0.0 || >=19.0.0
          react-dom >=18.0.0 || >=19.0.0
          @rsbuild/core ^2.0.0    (optional)
```

### Nitro is no longer built in — it is an opt-in per-host Vite plugin

Worth stating plainly because the ticket asked and the answer changed. Start's server core does **not** depend on Nitro. `@tanstack/start-server-core@1.169.17` depends on `h3-v2` (`npm:h3@2.0.1-rc.20`) and `@tanstack/start-plugin-core` on `srvx@^0.11.9` ([manifest](https://registry.npmjs.org/@tanstack/start-server-core/latest)).

Nitro is instead installed separately as `nitro` and wired via the `nitro/vite` plugin, only for hosts that need it ([hosting docs](https://tanstack.com/start/v0/docs/framework/react/guide/hosting), checked 2026-07-27):

| Host | Mechanism |
| --- | --- |
| Cloudflare Workers | `@cloudflare/vite-plugin` + `wrangler` |
| Netlify | `@netlify/vite-plugin-tanstack-start` |
| **Vercel** | **`nitro/vite`** — Nitro auto-detects Vercel and applies its preset |
| Railway, Node/Docker, Bun | `nitro/vite` (Bun via `{ preset: 'bun' }`) |

Two banners on that page matter:

- _"The `nitro/vite` plugin natively integrates with Vite Environments API… It is still under active development"_
- _"Currently, the Bun specific deployment guidelines only work with React 19"_

The repo deploys on Vercel today, so its default path runs through the plugin the docs flag as in-flux. Direct input to [Choose the deployment target and rendering mode](https://github.com/viniciusoliveiras/portfolio/issues/9).

### React — 19, not 18

Start's peers accept `>=18.0.0 || >=19.0.0`, so 18 is permitted, but there is no reason to pick it: 19.2.8 is current stable, React Server Components support in Start requires 19, and Start's Bun deployment path is documented React-19-only. Pin **19.2.8**.

### Vite 8 — supported, and explicitly handled

Vite 8's move from Rollup to Rolldown could have been a blocker. It is not: Start detects the Vite major at runtime. From `@tanstack/start-plugin-core`'s changelog ([source](https://raw.githubusercontent.com/TanStack/router/main/packages/start-plugin-core/CHANGELOG.md), checked 2026-07-27):

> _"Support both Vite 7 (`rollupOptions`) and Vite 8 (`rolldownOptions`) by detecting the Vite version at runtime"_ (#6955), plus _"fix Vite 7/8 compat for bundler options"_ (#6985).

`@tailwindcss/vite@4.3.3` declares `vite: ^5.2.0 || ^6 || ^7 || ^8`. Vite 8 clears both. Vite 8 `engines`: `^20.19.0 || >=22.12.0`.

### Tailwind — v4, CSS-first `@theme` is the documented default

The [v4.3 theme docs](https://tailwindcss.com/docs/theme) present `@theme` as the standard way to define tokens and **never mention `tailwind.config.js` or `@config` at all**:

```css
@import "tailwindcss";

@theme {
  --color-mint-500: oklch(0.72 0.11 178);
}
```

> _"Theme variables are special CSS variables defined using the `@theme` directive that influence which utility classes exist in your project."_

Treat CSS-first as the only path for new work; a JS config is at best an undocumented legacy escape hatch. The v3 line is still maintained separately (`v3-lts` → `3.4.19`, 2025-12-10) but is not a candidate here.

Feeds the _Tailwind token system and the component layer_ fog patch on the map.

### TypeScript — 7.0.2, and this repo's tsconfig does not survive it

**"LTS" does not exist for TypeScript.** There is no LTS line; `latest` is `7.0.2` (2026-07-08). The original ask's "TypeScript on latest stable" resolves to 7.0.2 — but 7.0 is a rewrite, not a bump.

TypeScript 7.0 is the **native Go port**, 7.7×–11.9× faster builds, 6–26% less memory ([announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/), checked 2026-07-27).

Its removals collide head-on with `tsconfig.json` as it stands today:

| Current setting | Under TS 7 |
| --- | --- |
| `"target": "es5"` | **Removed — hard error.** So are `downlevelIteration` and the `amd`/`umd`/`systemjs` module resolutions |
| `"strict": false` | Fights the new default; `strict` now defaults to `true` |
| `"moduleResolution": "node"` | Legacy resolution; `module` now defaults to `esnext` |
| `"jsx": "preserve"` | Was for Next's compiler; under Vite this becomes `react-jsx` |
| _(no `baseUrl`)_ | Fine — `baseUrl` is unsupported in TS 7, and this repo never used it |

Also changed: `rootDir` defaults to `./` (so `"rootDir": "./src"` may need stating), `types` defaults to `[]` (was `["*"]`), and `esModuleInterop`/`allowSyntheticDefaultImports` can no longer be `false`.

**Conclusion: the tsconfig is authored fresh, not migrated.** Nothing in the current file is worth carrying over. Microsoft recommends upgrading to 6.0 before 7.0 — irrelevant to a greenfield config, but it means "go straight to 7" is a choice to make consciously. That choice belongs to [Fix the Biome ruleset and the TypeScript compiler baseline](https://github.com/viniciusoliveiras/portfolio/issues/7).

One caveat with no impact here: **TS 7 ships no programmatic API.** Tools needing one use the `@typescript/typescript6` compatibility package. TS 7 is documented as still incompatible with embedded-language tooling (Vue, Angular, Svelte, MDX, Astro) — none of which this repo uses.

### Biome — one tool covers lint + format for TS/TSX **and** CSS

Yes to the ticket's question. Per [language support](https://biomejs.dev/internals/language-support/) (checked 2026-07-27), parsing, formatting, **and** linting are all supported for JavaScript, TypeScript, JSX/TSX, CSS, JSON/JSONC, GraphQL, and HTML (HTML _"currently requires explicit opt-in"_). Only Vue/Svelte/Astro are experimental — not used here. Biome 2.5.5 replaces ESLint + Prettier outright for this repo's file types.

Two things worth knowing before writing the ruleset:

- **Biome 2.x has type-aware rules with its own inference engine** — `noFloatingPromises`, `noMisusedPromises`, `noUnnecessaryConditions`, `noBaseToString`, `useNullishCoalescing`. It resolves through `Pick`/`Omit`/`Partial`/`Required`/`Readonly`, and reads `baseUrl` and `jsxFactory` from `tsconfig.json` ([changelog](https://raw.githubusercontent.com/biomejs/biome/main/packages/@biomejs/biome/CHANGELOG.md)). These are opt-in and cost real time — a deliberate choice for #7, not a default.
- **This inference is Biome's own (Rust), not the TypeScript compiler's.** That is precisely why Biome pairs cleanly with TS 7 where typescript-eslint needs the `@typescript/typescript6` shim. Biome never loads `tsc`.

Low-risk caveat: the language-support page states _"Biome supports TypeScript version 5.9,"_ describing its grammar target. TS 6/7 added no new syntax that this repo would use (7.0 is a faithful port), and no Biome-vs-TS7 incompatibility is reported in the changelog or issue tracker. Flagged, not blocking.

### pnpm and Node — the baseline is forced, and Corepack is a dead end

`pnpm@11.17.0` declares `engines: node >=22.13`. Intersected with Start's `>=22.12.0` and Vite's `^20.19.0 || >=22.12.0`, the floor is **Node ≥ 22.13**.

Node release facts ([nodejs/Release schedule](https://raw.githubusercontent.com/nodejs/Release/main/schedule.json), checked 2026-07-27):

| Line | Status | Dates |
| --- | --- | --- |
| v20 Iron | **EOL** | ended 2026-04-30 |
| v22 Jod | Maintenance | since 2025-10-21, EOL 2027-04-30 |
| **v24 Krypton** | **Active LTS** | LTS 2025-10-28 → maintenance 2026-10-20, EOL 2028-04-30 |
| v26 | Current | becomes LTS **2026-10-28** |

**The locally installed v24.18.0 is the Active LTS.** No conflict to resolve — the ticket's premise that local v24 might diverge from LTS does not hold. But note v24 enters maintenance 2026-10-20, roughly three months out, when v26 takes over as LTS. Pin against v24 and expect a v26 bump inside a year.

**Corepack will not be available on the next LTS.** From the [Corepack readme](https://github.com/nodejs/corepack#readme) (checked 2026-07-27):

> _"Corepack is distributed with Node.js from version 14.19.0 up to (but not including) 25.0.0."_

Confirmed locally: `corepack 0.35.0` is bundled in v24.18.0. But it is **absent from Node 25+, therefore absent from Node 26 LTS.** A toolchain built on `packageManager` + `corepack enable` breaks on the next LTS upgrade. The migration needs an explicit pnpm install strategy — standalone installer, `npm i -g pnpm`, or `pnpm/action-setup` in CI. Direct input to [Plan the move from Yarn Berry to pnpm, and fix the Node baseline](https://github.com/viniciusoliveiras/portfolio/issues/8).

## Hard incompatibilities that change the plan

Ranked by how much they move the work.

1. **TanStack Start is RC, not GA, and has been for ~10 months.** The destination presumes Start. That is still a reasonable bet for a personal portfolio — feature-complete, API declared stable, breaking changes documented — but the human should confirm knowingly rather than on the assumption that `1.168.32` means GA.
2. **`tsconfig.json` is a rewrite, not a migration.** `target: es5` is a hard error under TS 7 and `strict: false` fights the new default. Every line of the current config is either removed, defaulted differently, or Next-specific.
3. **Corepack is gone from Node 25+, so it is gone from Node 26 LTS.** Do not build the toolchain on `corepack enable`.
4. **Vercel's Start deploy path runs through `nitro/vite`, which its own docs call "still under active development."** Cloudflare and Netlify have first-party plugins; Vercel does not.
5. **Node floor is 22.13**, set by pnpm 11. Local v24.18.0 clears it and is the Active LTS, but goes to maintenance 2026-10-20.

No incompatibility found between the pinned versions themselves. Start ↔ Vite 8, Tailwind 4 ↔ Vite 8, Biome ↔ TS 7, and React 19 across all of it are each positively confirmed above.
