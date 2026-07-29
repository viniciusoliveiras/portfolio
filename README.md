# Portfolio — Vinicius Oliveira

Personal portfolio site. One page, two locales (`/pt` and `/en`), fully static, no remote data.

**Stack:** TanStack Start · React 19 · Tailwind CSS v4 · TypeScript 7 · Biome · pnpm · deployed on Vercel as static output.

---

## Status: this repository holds a specification, not the site it describes

`src/` is still the **old** site — Next.js 10, Chakra UI v1, four pages, Portuguese only, content roughly five years out of date. Everything in `docs/` describes the site that **replaces** it, and nothing in `docs/` has been implemented yet.

The migration was planned as one effort of 21 decisions, tracked on [the migration map](https://github.com/viniciusoliveiras/portfolio/issues/1). That effort is complete: every decision is made and written down. Writing the code is the next effort, and it should need no further decisions — if it does, that is a gap in the spec and worth recording as one.

**Read [`CONTEXT.md`](CONTEXT.md) first if you are picking up implementation work.** It is the glossary, and several terms in these documents mean something narrower than they look.

---

## How to run

The current site (Next.js, Yarn Berry) — as it stands today:

```sh
yarn install
yarn dev
```

**After the migration**, per [ADR-0003](docs/adr/0003-package-manager-and-node-baseline.md):

```sh
pnpm install          # pnpm 11 — bootstrap with the standalone installer, not Corepack
pnpm dev              # vite dev
pnpm build            # vite build && tsc --noEmit — in that order, deliberately
pnpm preview          # look at a production build locally
pnpm check            # biome check
pnpm check:write      # biome check --write
pnpm typecheck        # tsc --noEmit
```

Node is pinned to `24.18.0` in `.nvmrc`, with a true floor of `>=22.13.0` in `engines`. There is **no `start` script** — the build produces static output, so there is no server to start.

---

## Reading order

Seventeen documents, and reading them in creation order is the wrong order. This is the order that makes each one make sense when you reach it.

### 1. What the site is

| | Document | Why it comes first |
| --- | --- | --- |
| 1 | [ADR-0001: Information architecture](docs/adr/0001-information-architecture.md) | **Start here, always.** What pages exist, what got cut, and why the site's job is hiring signal for a Tech Lead. Everything downstream assumes it |
| 2 | [ADR-0005: Visual direction](docs/adr/0005-visual-direction.md) | The design brief. Palette, typography, layout, motion budget. The single most-cited document in the corpus |
| 3 | [Site copy](docs/site-copy.md) | Every string, both locales, each factual claim traced to a line in the résumé |
| 4 | [Section layouts](docs/section-layouts.md) | How the seven sections are actually built, decided against a working prototype |

### 2. What it is built with

| | Document | Why |
| --- | --- | --- |
| 5 | [Target stack versions](docs/research/target-stack-versions.md) | Every version pinned with a dated primary source. Note TanStack Start is still **RC** |
| 6 | [Next → TanStack Start API map](docs/research/next-to-tanstack-start-api-map.md) | Each Next API this repo uses, and its replacement. Three files are deleted rather than migrated |
| 7 | [Dependency verdicts](docs/research/non-chakra-dependency-verdicts.md) | Keep / replace / hand-roll / drop for every non-Chakra dependency. Partly superseded by ADR-0001 — read the corrections |
| 8 | [ADR-0002: TypeScript and Biome](docs/adr/0002-typescript-and-biome-baseline.md) | Compiler strictness and lint rules. The `types: ["vite/client"]` finding is the easiest line in the migration to omit |
| 9 | [ADR-0003: Package manager and Node](docs/adr/0003-package-manager-and-node-baseline.md) | pnpm 11, and three traps that each break `pnpm install` outright |

### 3. How it is put together

| | Document | Why |
| --- | --- | --- |
| 10 | [Tailwind token layer](docs/research/tailwind-token-layer.md) | The paste-ready stylesheet. Binds ADR-0005's values into `@theme` |
| 11 | [i18n and locale routing](docs/research/i18n-and-locale-routing.md) | Route shape, `<html lang>`, and §8.1's decision: **typed message modules, no i18n runtime** |
| 12 | [Head and metadata](docs/research/head-and-metadata.md) | Every tag on every route. **`viewport` is not automatic in Start** — losing it gives phones the desktop layout |
| 13 | [Mobile sheet primitive](docs/research/mobile-sheet-primitive.md) | The one component primitive the site needs, on the native `<dialog>` |
| 14 | [Favicon and asset serving](docs/research/favicon-and-asset-serving.md) | What `public/` contains, the shipping favicon, and cache headers |

### 4. How it ships

| | Document | Why |
| --- | --- | --- |
| 15 | [ADR-0004: Deployment target and rendering mode](docs/adr/0004-deployment-target-and-rendering-mode.md) | Vercel, fully prerendered, no server runtime. Includes two collisions with ADR-0003, one fatal |
| 16 | [CI workflow](docs/ci-workflow.md) | The complete workflow YAML, with pinned SHAs |
| 17 | [Migration strategy and cutover](docs/migration-cutover.md) | **Read this before touching `main`.** Orphan branch, force-push, and a seven-item carry-over list whose omission is unrecoverable |

### 5. Repo conventions (not part of the spec)

[`AGENTS.md`](AGENTS.md) and [`docs/agents/`](docs/agents/) — issue tracker usage, triage labels, and how domain docs are consumed. These describe how to *work* the repo, not what to build.

---

## How `docs/` is organised

Three directories, and the split is **not** what the names suggest:

- **`docs/adr/`** — the five numbered, load-bearing decisions. A document earns a number when **reversing it invalidates other documents**. That is the whole test; prose shape has nothing to do with it. Three strong candidates were considered and declined — the [sheet primitive](docs/research/mobile-sheet-primitive.md), the [cutover plan](docs/migration-cutover.md) and [i18n §8.1](docs/research/i18n-and-locale-routing.md) — because reversing each of them reaches no further than itself.
- **`docs/research/`** — **provenance, not content.** It holds the output of the map's five research tickets plus three later ones. Several files in it are not research at all but implementation contracts: the token layer ships a paste-ready stylesheet, the sheet ships a component, the favicon ships a 332-byte file. The name is historical and was deliberately kept — moving the files would break the links in eight closed tickets' resolution comments, which are the detail layer this README indexes.
- **`docs/`** root — everything else the spec produced.

**So do not navigate by directory. Navigate by the reading order above.**

## How to read any single document

Each one opens with its decision and closes with **"What this hands to other tickets"**. They were written in sequence, and later ones correct earlier ones **in place**, marked with a dated `> **Corrected …**` block over struck-through text. Where you see one, the correction wins — the original text is kept so the reasoning stays auditable, not because it still holds.

Two things follow from that:

- **Read the corrections.** Several are load-bearing: ADR-0001's *"via i18next"* is superseded, ADR-0005's font count went from three files to two, and the dependency verdicts shifted substantially once ADR-0001 removed the site's remote data.
- **A document's date is not its authority.** ADR-0005 is dated 2026-07-27 and is upstream of almost everything; the cutover plan is dated a day later and is downstream of all of it.

---

## What this spec deliberately does not cover

- **Tests.** The repo has none, and specifying a test stack was ruled a separate effort.
- **Analytics, OG image generation, performance budgets.** Head-and-meta *parity* is in scope; going beyond it is not.
- **A `LICENSE`.** Nothing in the map creates one — it is the author's call, not a migration decision.
