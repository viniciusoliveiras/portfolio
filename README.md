# Portfolio — Vinicius Oliveira

Personal portfolio site. One page, two locales (`/pt` and `/en`), fully static, no remote data.

**Stack:** TanStack Start · React 19 · Tailwind CSS v4 · TypeScript 7 · Biome · pnpm · deployed on Vercel as static output.

---

## Status: shipped

**Live at [www.viniciusoliveiras.com](https://www.viniciusoliveiras.com).** `src/` is the site these documents describe. The Next.js 10 / Chakra v1 / Yarn Berry site they were written to replace is gone from `main`, removed by the orphan-branch force-push the cutover plan specifies rather than by a deletion commit.

The migration was planned as one effort of 21 decisions, tracked on [the migration map](https://github.com/viniciusoliveiras/portfolio/issues/1), then implemented and cut over against that spec. Both are closed. **`docs/` is now a maintenance reference and an audit trail, not a plan** — it records what was decided, what the implementation found wrong, and what was knowingly traded away.

The map asked to be judged on one claim: that implementation would need no further decisions. **It needed some.** There are 23 dated correction blocks across the corpus, and they cluster almost entirely on Vercel's actual behaviour — the one area no amount of desk research could settle, because it could only be measured. [The map's closing comment](https://github.com/viniciusoliveiras/portfolio/issues/1#issuecomment-5144229667) is the verdict; the corrections themselves are annotated in place.

### The 2026-07-31 redesign

`src/` no longer looks like the site ADR-0005 describes. A new visual direction was authored in Claude Design, imported, and implemented as **[ADR-0006](docs/adr/0006-warm-editorial-direction.md)**, which supersedes ADR-0005's visual axes — new faces, a warm palette, cards, a numbered section mark in place of the rail. **ADR-0001's information architecture is untouched**, and so is every string of prose.

Two things to know before reading further. ADR-0006 records **three contrast findings accepted rather than fixed**, all in light mode, each with a stated trigger to reopen — they are decisions, not oversights. And **six questions are open with Claude Design**, chief among them the mobile navigation: the design file has none, because a single-file preview cannot express a `<dialog>`, so the existing sheet is retained pending a ruling.

**Read [`CONTEXT.md`](CONTEXT.md) first if you are picking up work here.** It is the glossary, and several terms in these documents mean something narrower than they look. Note that **`rail` is retired** and that older documents use it freely.

---

## How to run

```sh
pnpm install          # pnpm 11
pnpm dev              # vite dev
pnpm build            # vite build && tsc --noEmit — in that order, deliberately
pnpm preview          # look at a production build locally
pnpm check            # biome check
pnpm check:write      # biome check --write
pnpm typecheck        # tsc --noEmit
pnpm test             # 54 node tests, then 16 Playwright browser tests
```

**Bootstrap pnpm with the standalone installer, not Corepack**, per [ADR-0003](docs/adr/0003-package-manager-and-node-baseline.md) — and mind the trap that follows from it. `devEngines.packageManager.version` is the *range* `>=11.0.0 <12.0.0`, which Corepack refuses to resolve at all: `Invalid package manager specification … expected a semver version`. If the `pnpm` first on your `PATH` is a Corepack shim, every command above fails — and so does `git commit`, because the lefthook `pre-commit` hook shells out to `pnpm` by name.

Node is pinned to `24.18.0` in `.nvmrc`, with a true floor of `>=22.13.0` in `engines`. There is **no `start` script** — the build produces static output, so there is no server to start.

The résumé PDF is a committed binary with a one-off build step kept deliberately outside `package.json`: `node resume/build.mjs`. It borrows the Chromium the browser tests already install.

---

## Reading order

Fifteen documents, and reading them in creation order is the wrong order. This is the order that makes each one make sense when you reach it.

### 1. What the site is

| | Document | Why it comes first |
| --- | --- | --- |
| 1 | [ADR-0001: Information architecture](docs/adr/0001-information-architecture.md) | **Start here, always.** What pages exist, what got cut, and why the site's job is hiring signal for a Tech Lead. Everything downstream assumes it. **Untouched by the 2026-07-31 redesign** |
| 2 | [ADR-0006: The warm editorial direction](docs/adr/0006-warm-editorial-direction.md) | **The current design brief.** Palette, typography, layout. Imported from a Claude Design project 2026-07-31 and implemented; it supersedes ADR-0005's visual axes and records three contrast findings accepted rather than fixed |
| 3 | [ADR-0005: Visual direction](docs/adr/0005-visual-direction.md) | **Superseded, and kept deliberately.** Read it *after* ADR-0006, for two reasons: its measured contrast tables are the reference ADR-0006's findings are stated against, and its process findings are all still binding. Do not build from its palette, faces or layout |
| 4 | [Site copy](docs/site-copy.md) | Every string, both locales, each factual claim traced to a line in the résumé. The prose is unchanged by the redesign; ADR-0006 added chrome strings on top |
| 5 | [Section layouts](docs/section-layouts.md) | How the seven sections were built under ADR-0005, decided against a working prototype. **The section *contents* still hold; the rail, the measure and the figure placement do not** |

### 2. What it is built with

| | Document | Why |
| --- | --- | --- |
| 6 | [ADR-0002: TypeScript and Biome](docs/adr/0002-typescript-and-biome-baseline.md) | Compiler strictness and lint rules. The `types: ["vite/client"]` finding is the easiest line in the migration to omit |
| 7 | [ADR-0003: Package manager and Node](docs/adr/0003-package-manager-and-node-baseline.md) | pnpm 11, and three traps that each break `pnpm install` outright |

The pinned versions that used to be documented here now live in `package.json` and `pnpm-lock.yaml`, which are enforced rather than described — see the note on removed documents below.

### 3. How it is put together

| | Document | Why |
| --- | --- | --- |
| 8 | [Tailwind token layer](docs/research/tailwind-token-layer.md) | How ADR-0005's values were bound into `@theme`. **Its values are superseded** — the shipped stylesheet is `src/styles/global.css` under ADR-0006 — but its *mechanism* findings are not, above all why `@theme inline` must never be used here |
| 9 | [i18n and locale routing](docs/research/i18n-and-locale-routing.md) | Route shape, `<html lang>`, and §8.1's decision: **typed message modules, no i18n runtime** |
| 10 | [Head and metadata](docs/research/head-and-metadata.md) | Every tag on every route. **`viewport` is not automatic in Start** — losing it gives phones the desktop layout |
| 11 | [Mobile sheet primitive](docs/research/mobile-sheet-primitive.md) | The one component primitive the site needs, on the native `<dialog>` |
| 12 | [Favicon and asset serving](docs/research/favicon-and-asset-serving.md) | What `public/` contains, the shipping favicon, and cache headers |

### 4. How it ships

| | Document | Why |
| --- | --- | --- |
| 13 | [ADR-0004: Deployment target and rendering mode](docs/adr/0004-deployment-target-and-rendering-mode.md) | Vercel, fully prerendered, no server runtime. Includes two collisions with ADR-0003, one fatal, plus the corrected build and install commands |
| 14 | [CI workflow](docs/ci-workflow.md) | The complete workflow YAML, with pinned SHAs |
| 15 | [Migration strategy and cutover](docs/migration-cutover.md) | **The record of what shipped**, all five phases performed. Read Phase 4 for the one requirement that was reversed rather than met |

### 5. Repo conventions (not part of the spec)

[`AGENTS.md`](AGENTS.md) and [`docs/agents/`](docs/agents/) — issue tracker usage, triage labels, and how domain docs are consumed. These describe how to *work* the repo, not what to build.

---

## How `docs/` is organised

Three directories, and the split is **not** what the names suggest:

- **`docs/adr/`** — the six numbered, load-bearing decisions, one of them superseded. A document earns a number when **reversing it invalidates other documents**. That is the whole test; prose shape has nothing to do with it. Three strong candidates were considered and declined — the [sheet primitive](docs/research/mobile-sheet-primitive.md), the [cutover plan](docs/migration-cutover.md) and [i18n §8.1](docs/research/i18n-and-locale-routing.md) — because reversing each of them reaches no further than itself.
- **`docs/research/`** — **provenance, not content.** It held the output of the map's five research tickets plus three later ones; three of those files have since been removed (see below), so it now holds five. Several are not research at all but implementation contracts: the token layer ships a paste-ready stylesheet, the sheet ships a component, the favicon ships a 332-byte file. The name is historical and was deliberately kept — moving the files would break the links in the closed tickets' resolution comments, which are the detail layer this README indexes.
- **`docs/`** root — everything else the spec produced.

**So do not navigate by directory. Navigate by the reading order above.**

### Three documents were removed after the cutover, 2026-07-31

`docs/research/target-stack-versions.md`, `docs/research/next-to-tanstack-start-api-map.md` and `docs/research/non-chakra-dependency-verdicts.md` — 577 lines, deleted deliberately once the migration shipped. Each was **input to a migration that has happened**, describing a codebase that no longer exists: a version survey that said of itself *"these move weekly"* and whose pins are now enforced by `package.json` and `pnpm-lock.yaml`; a Next → TanStack translation table whose Next side is gone; and keep/replace verdicts on packages that were all dropped.

**Two consequences, recorded rather than discovered later.** Eight links in closed tickets' resolution comments now dangle — the issues are closed and will not be rewritten, so those are permanent. And every remaining reference to this material points at the **tickets** ([#2](https://github.com/viniciusoliveiras/portfolio/issues/2), [#3](https://github.com/viniciusoliveiras/portfolio/issues/3), [#4](https://github.com/viniciusoliveiras/portfolio/issues/4)) rather than the files, which is why the corpus's prose survived the deletion intact. The content itself is in git history, at the commit that removed it.

This is the one place the corpus departs from its own rule that superseded material is struck through and kept. The rule holds for *text inside a living document*; these three had no living argument left to annotate.

## How to read any single document

Each one opens with its decision and closes with **"What this hands to other tickets"**. They were written in sequence, and later ones correct earlier ones **in place**, marked with a dated `> **Corrected …**` block over struck-through text. Where you see one, the correction wins — the original text is kept so the reasoning stays auditable, not because it still holds.

Two things follow from that:

- **Read the corrections.** Several are load-bearing: ADR-0001's *"via i18next"* is superseded, ADR-0005's font count went from three files to two, ADR-0004's Vercel phase turned out to be five settings rather than four with two of the commands wrong, and the cutover plan's Phase 4 records a requirement that was **reversed**, not met.
- **A document's date is not its authority.** ADR-0005 is dated 2026-07-27 and is upstream of almost everything; the cutover plan is dated a day later and is downstream of all of it.

---

## What this spec deliberately does not cover

- ~~**Tests.** The repo has none, and specifying a test stack was ruled a separate effort.~~ **Overturned by the implementation.** There are 47 node tests asserting the prerendered output and 13 Playwright tests driving a real build — `pnpm test`. The stack was chosen at implementation time, not specified: `node --test` plus Playwright, no third framework.
- **Analytics, OG image generation, performance budgets.** Head-and-meta *parity* is in scope; going beyond it is not.
- **A `LICENSE`.** Nothing in the map creates one — it is the author's call, not a migration decision.
