# Non-Chakra runtime dependencies: keep / replace / hand-roll / drop

Research asset for [Decide the fate of each non-Chakra runtime dependency](https://github.com/viniciusoliveiras/portfolio/issues/4), a ticket on [Map: migrate the portfolio to TanStack Start + Tailwind, with a redesign](https://github.com/viniciusoliveiras/portfolio/issues/1).

**All rows checked 2026-07-27.** Every version, peer range, module format and API claim below was read from the npm registry, a GitHub release, or the package's own published `.d.ts` — cited per row. Nothing is from model memory.

Each package was held against the three bars the ticket set: **(1)** does it work under React 19, **(2)** does it work outside Next/webpack — Vite 8, ESM, and SSR if the deployment target does SSR, **(3)** does it still make sense once styling is Tailwind rather than Chakra/emotion.

## Verdicts

| Package | In repo | Latest (2026-07-27) | Verdict | One-line reason |
| --- | --- | --- | --- | --- |
| `react-github-calendar` | `^2.0.2` | [`5.0.8`](https://registry.npmjs.org/react-github-calendar) | **Replace** — go to v5, or drop a level to `react-activity-calendar@3.2.1` | v5 is a rewrite (pure ESM, named export, renamed props, new theme shape) and it **cannot SSR** — it fetches client-side by design. |
| `react-tooltip` | `^4.2.19` | [`6.0.8`](https://registry.npmjs.org/react-tooltip) | **Drop** | Both of its jobs disappear: the calendar now ships its own tooltips, and the other site needs one primitive from the Tailwind component layer. |
| `typewriter-effect` | `^2.17.0` | [`2.22.0`](https://registry.npmjs.org/typewriter-effect) | **Hand-roll** (or fold into the animation decision) | Works, but it is the last CJS/UMD-only dep in the target stack, 15 months without a commit, for ~25 lines of `setTimeout`. |
| `react-parallax-tilt` | `^1.5.8` | [`1.7.335`](https://registry.npmjs.org/react-parallax-tilt) | **Keep** — technically clear; retention is a *design* call | Clears all three bars cleanly (React 19 peer, dual ESM/CJS, zero runtime deps, published yesterday). |
| `date-fns` | `^2.21.1` | [`4.4.0`](https://registry.npmjs.org/date-fns) | **Keep**, upgrade to v4 | Both functions and the pt-BR locale survive; only the import syntax changes. Hand-rolling `formatDistanceToNowStrict` on `Intl` is not worth it. |
| `react-icons` | `^4.2.0` | [`5.7.0`](https://registry.npmjs.org/react-icons) | **Keep**, upgrade to v5 — do **not** standardise on Lucide | `sideEffects: false` + per-set ESM entries tree-shake fine, and Lucide has no brand icons, so switching would *add* a second dependency. |
| `framer-motion` | `^4.1.11` | [`12.42.2`](https://registry.npmjs.org/motion) (now published as `motion`) | **Drop** | Imported nowhere. Confirmed by grep across `src/`. |
| Chakra `AlertDialog` | — | — | **Drop, no replacement required** | `WarningAlertDialog.tsx` is dead code — see below. It imposes **no** requirement on the component layer. |

## Four premises in the ticket that the code does not support

Worth correcting before anything downstream leans on them.

**1. `react-parallax-tilt` is not in `ProjectCard.tsx`.** Its single use is `src/components/About/KnowWhoIAm.tsx:1`, wrapping the avatar image (`<Tilt><Image src="images/avatar.svg" boxSize="350" /></Tilt>`). `Projects/ProjectCard.tsx` imports nothing but Chakra. So the tilt is an *about-page avatar* effect, not a *project-card* effect — which changes who decides its fate.

**2. `WarningAlertDialog` is dead code.** `src/components/WarningAlertDialog.tsx` is defined and exported, and `grep -rn "WarningAlertDialog" src/` finds **only its own definition** — no page or component imports it. The "página ainda em construção" warning has not rendered for some time.

This dissolves the question the ticket asked. There is no accessible-modal-dialog requirement to hand to the component layer, because the app renders no dialog. The verdict is `rm src/components/WarningAlertDialog.tsx`. If the redesign wants a dialog back, that is a fresh requirement from the design tickets, not a migration constraint — and it should be stated there, where the visual direction can inform it.

**3. `@next/bundle-analyzer` is already disabled.** It is commented out in `next.config.js` (lines 2–6), so `cross-env ANALYZE=true next build` runs a plain build. Both packages are already inert; neither needs a Vite replacement *ported*. A bundle analyser under Vite would be net-new tooling, not a migration task.

**4. The `Tech.tsx` tooltips work by accident.** `src/components/About/Tech.tsx:11` sets a bare `data-tip={techName}` attribute but renders no tooltip component. It only works because `GithubCalendar.tsx` mounts `<ReactTooltip delayShow={50} html />` — a *global* v4 instance that scoops up every `data-tip` in the document — and both components happen to land on the about page. The coupling is invisible in the source and it is load-bearing.

This matters for sequencing: **upgrading the calendar silently breaks the tech-stack tooltips.** v5 no longer takes a tooltip component as `children`, so the global instance disappears with it. Anyone porting `GithubCalendar` in isolation will not notice.

## Per-package detail

### `react-github-calendar` — a rewrite, and it cannot server-render

v5 is a hard break from the `^2.0.2` in this repo. From the [v5.0 release notes](https://github.com/grubersjoe/react-github-calendar/releases/tag/v5.0), which also inherit every break from [`react-activity-calendar` v3.0](https://github.com/grubersjoe/react-activity-calendar/releases/tag/v3.0):

- **Pure ESM package** — fine under Vite, irrelevant under webpack-era assumptions.
- **Default export removed** → `import { GitHubCalendar } from 'react-github-calendar'`. The repo's `import GitHubCalendar from 'react-github-calendar'` breaks.
- `eventHandlers`, `totalCount`, `transformTotalCount` **removed**; `hideColorLegend` / `hideMonthLabels` / `hideTotalCount` **renamed** to `show*`.
- **Tooltips are now built in**, via Floating UI, headless and code-split. Either import the packaged styles (`react-activity-calendar/tooltips.css`, a real [export path](https://registry.npmjs.org/react-activity-calendar/latest)) or write your own CSS.

The `theme` prop changed shape entirely. The repo passes `{ background, text, grade0…grade4 }`; the published type ([`react-activity-calendar@3.2.1/build/index.d.ts`](https://unpkg.com/react-activity-calendar@3.2.1/build/index.d.ts)) is now:

```ts
export type ThemeInput =
  | { light: Array<Color>; dark?: Array<Color> }
  | { light?: Array<Color>; dark: Array<Color> };
```

Two colours per scheme is enough — it interpolates the scale. `background` and `text` are no longer theme keys at all; they are CSS now, which suits Tailwind. `blockSize`, `blockMargin` and `fontSize` all survive, so those three props port unchanged.

Peer range is `^18.0.0 || ^19.0.0` — React 19 fine.

**The SSR finding is the one that reaches other tickets.** The project's own FAQ ([README](https://github.com/grubersjoe/react-github-calendar#readme), checked 2026-07-27) answers "Is server side rendering (SSR) supported?" with:

> Yes. However, **not with this component** because it fetches data client-side. For SSR support, you can fetch the GitHub contribution data from a suitable API server-side and pass it on to the internally used `react-activity-calendar` component.

So under a prerendered build the calendar ships an empty skeleton and fills in on the client. Given the repo *already* fetches GitHub data server-side in `getStaticProps`, the coherent move is to drop a level: fetch from `github-contributions-api` in the route loader and render `<ActivityCalendar>` directly. Same author, same props, one fewer wrapper, and the calendar becomes part of the prerendered HTML like the rest of the page.

That is a recommendation, not a settled decision — it belongs with [Choose the deployment target and rendering mode](https://github.com/viniciusoliveiras/portfolio/issues/9), which also owns the `revalidate: 604800` question from the API map. Both are the same question wearing different hats: *how fresh is build-time GitHub data allowed to be?*

### `react-tooltip` — drop, because both of its jobs vanish

Not a health problem. v6.0.8 is actively maintained — [six patch releases](https://github.com/ReactTooltip/react-tooltip/releases) between 2026-05-14 and 2026-06-15 — with a `react >=16.14.0` peer, dual ESM/CJS, and Floating UI + clsx as its only deps.

The problem is that nothing is left for it to do:

- **Calendar tooltips** — now built into `react-activity-calendar` (above). Keeping `react-tooltip` here would mean shipping Floating UI twice.
- **`Tech.tsx` icons** — need a tooltip primitive, but so does `RecentProjects.tsx`, which today uses Chakra's `<Tooltip>`, not this library. The repo currently runs **two different tooltip mechanisms**; after Chakra leaves, both sites want the same primitive from whatever the component layer turns out to be.

Also note the v4 → v5 break would have to be paid anyway: v5 was [rebuilt from scratch on Floating UI](https://github.com/ReactTooltip/react-tooltip/releases/tag/v5.0.0), replacing the `data-tip` + global-instance pattern with explicit `data-tooltip-id` / `data-tooltip-content` anchors and a `<Tooltip id="…" />`. There is no version of this migration where the existing code carries over.

**Requirement handed to the component-layer decision:** one tooltip primitive, keyboard-accessible, covering two sites — icon labels on the tech grid and a formatted timestamp on recent-project cards. If the chosen component layer supplies one (Base UI, Radix, Ark, shadcn/ui all do), take it. If the layer ends up hand-rolled, `react-tooltip@6` is the fallback and clears every bar.

### `typewriter-effect` — works, but hand-rolling is the better trade

It is not broken. The three most recent commits ([2025-04-29](https://github.com/tameemsafi/typewriterjs/commits/master)) are "Fix dependencies", "**Add support for React 19**", and a TypeScript definition fix — so React 19 is explicitly supported, not just permitted by a loose `>=17.0.0` peer. SSR is safe too: the published bundle ([`dist/react.js`](https://unpkg.com/typewriter-effect@2.22.0/dist/react.js)) has one `document` reference, inside the class rather than at module scope, and guards `typeof window`.

The case against is accumulated friction, not failure:

- **The only CJS/UMD-only dependency left in the target stack.** `main: dist/react.js`, no `module`, no `exports` field, no `type: "module"` ([manifest](https://registry.npmjs.org/typewriter-effect/latest)). Vite handles it — pre-bundling in dev, `@rollup/plugin-commonjs` in build, externalised for SSR — but it is the one package that needs that handling.
- **Stale**: last commit 2025-04-29, 94 open issues, not archived.
- **Carries `raf` and `prop-types`** — a `requestAnimationFrame` polyfill for browsers this project does not target, and runtime prop validation that TypeScript already covers.
- **The payload is two strings.** `Typer.tsx` cycles `['Estudante de TI', 'Desenvolvedor React']` on `autoStart` + `loop`. That is a `useEffect` and a `setTimeout` — and it is the kind of thing a `prefers-reduced-motion` guard should wrap anyway, which the library does not do for you.

This is genuinely [Decide what animates, and with what](https://github.com/viniciusoliveiras/portfolio/issues/11)'s call, and it should make it: if that ticket adopts `motion` (`framer-motion`'s successor, `12.42.2`, React 19 peer), the typewriter comes free from what is already in the bundle. **Recommendation: drop the dependency, hand-roll or absorb — with the reduced-motion guard as a stated requirement.**

### `react-parallax-tilt` — technically the healthiest thing in `dependencies`

Nothing to decide on technical grounds. `1.7.335`, published **2026-07-26** — the day before this was checked — with [zero open issues](https://github.com/mkosir/react-parallax-tilt) on the repo. Peers span `^15 → ^19`, so React 19 is covered. Ships dual ESM/CJS with `type: "module"` and no runtime dependencies at all ([manifest](https://registry.npmjs.org/react-parallax-tilt/latest)).

Bar 3 is the only one it does not answer for itself. It is a decorative 3D tilt on a single avatar image, and whether a redesigned about page still wants that effect is [Settle the visual direction for the redesign](https://github.com/viniciusoliveiras/portfolio/issues/6) and [Decide what animates, and with what](https://github.com/viniciusoliveiras/portfolio/issues/11) to answer. **Keep it if the design keeps the effect; there is no migration reason to remove it.**

### `date-fns` — keep, and pay a two-line import change

`4.4.0`, ESM-first with CJS fallback and no runtime deps. Both functions in use are still first-class exports, verified from the [published exports map](https://registry.npmjs.org/date-fns/latest): `./formatDistanceToNowStrict` and `./locale/pt-BR` both resolve with `import`/`require` conditions and types.

One break, from the v3 rewrite. The locale is now a **named** export ([`date-fns@4.4.0/locale/pt-BR.d.ts`](https://unpkg.com/date-fns@4.4.0/locale/pt-BR.d.ts) declares `export declare const ptBR: Locale;` and no default):

```diff
- import ptBR from 'date-fns/locale/pt-BR';
+ import { ptBR } from 'date-fns/locale/pt-BR';
```

`RecentProjects.tsx` is the only file affected. The call sites — `format(date, 'PP HH:mm', { locale: ptBR })` and `formatDistanceToNowStrict(date, { locale: ptBR })` — are unchanged.

**On dropping it for `Intl`:** `format(…, 'PP HH:mm')` maps cleanly onto `Intl.DateTimeFormat('pt-BR')`, but `formatDistanceToNowStrict` does not. `Intl.RelativeTimeFormat` formats a *given* quantity and unit; choosing the unit and rounding it is your problem, and getting "há 3 meses" to agree with what a reader expects is exactly the fiddly logic date-fns already ships and tests. With v4 fully tree-shakeable, two functions plus one locale is a small, well-tested cost. **Keep.**

### `react-icons` — keep, and resist standardising on Lucide

`5.7.0`, [pushed to today](https://github.com/react-icons/react-icons), peer `react: *`. The [manifest](https://registry.npmjs.org/react-icons/latest) declares `sideEffects: false` with per-set subpath exports (`./fa`, `./ri`, each with `import`/`require`/`types`), so Rollup tree-shakes it properly in a Vite production build. Bar 1 and bar 2 pass without qualification.

Bar 3 — "standardise on one icon set" — is where the obvious move is wrong. The eight icons in use split into two kinds:

- **Brand marks**: `FaGithub`, `FaInstagram`, `FaLinkedin` (`Footer.tsx`, `HeaderNav.tsx`)
- **UI glyphs**: `FaEnvelope`, `RiHome2Line`, `RiInformationLine`, `RiCodeSSlashLine`, `RiFile2Line`

Lucide (`lucide-react@1.27.0`, React 19 peer) is the natural Tailwind pairing and would cover every UI glyph. It cannot cover the brand marks: querying [`lucide.dev/api/tags`](https://lucide.dev/api/tags) on 2026-07-27 returns **no** `github`, `linkedin`, or `instagram` tags, while `mail` is present — consistent with Lucide having removed brand icons from the set. Switching would mean Lucide **plus** `react-icons` or `simple-icons` for the three social links: two icon dependencies where there is currently one, and two visual languages to reconcile.

**Keep `react-icons@5`.** If the redesign wants a Lucide look for UI glyphs, that is a design decision worth making deliberately in [Settle the visual direction](https://github.com/viniciusoliveiras/portfolio/issues/6) — with the brand-mark cost on the table — not a migration default.

### `framer-motion` — drop

Confirmed unused: `grep -rn "framer-motion" src/` returns nothing. Remove from `dependencies` with no replacement. Note for [Decide what animates, and with what](https://github.com/viniciusoliveiras/portfolio/issues/11) that the library was renamed — it is published as [`motion`](https://registry.npmjs.org/motion) now, `12.42.2`, peer `react ^18 || ^19`, with an optional `@emotion/is-prop-valid` peer that is irrelevant once emotion leaves. `framer-motion` still publishes at the same version but the `motion` name is the current one.

## Build-time dependencies: what dies outright

| Package / file | Fate | Why |
| --- | --- | --- |
| `@next/bundle-analyzer` | **Drop** | Already commented out in `next.config.js`. A Vite analyser (`rollup-plugin-visualizer@7.0.1`) would be net-new, not a port. |
| `cross-env` | **Drop** | Exists only for the `buildanalyze` script, which runs the disabled analyser. |
| `next-env.d.ts` | **Delete** | Next-generated ambient types. Vite's own `vite-env.d.ts` / the Start template replaces it. |
| `@types/react-router-dom` | **Drop** | Unused — `grep -rn "react-router-dom" src/` returns nothing, and `react-router-dom` itself is not a dependency. Stray. |
| `eslint` + `eslint-config-airbnb` + `eslint-config-prettier` + `eslint-import-resolver-typescript` + `eslint-plugin-{import,import-helpers,jsx-a11y,prettier,react,react-hooks,testing-library}` + `@typescript-eslint/{eslint-plugin,parser}` + `prettier` | **Drop — 14 packages** | Replaced wholesale by Biome. Ruleset design belongs to [Fix the Biome ruleset and the TypeScript compiler baseline](https://github.com/viniciusoliveiras/portfolio/issues/7). Note `eslint-plugin-testing-library` is configured against tests that do not exist. |
| `@types/react` `^17`, `@types/react-dom` `^17` | **Replace** | React 19 lines: `19.2.17` and `19.2.3` ([registry](https://registry.npmjs.org/@types/react), checked 2026-07-27). |
| `@types/node` `^16` | **Replace, but pin the 24 line** | `latest` is `26.1.2`; the Node baseline is 24, so pin `24.9.2` ([registry](https://registry.npmjs.org/@types/node)). Belongs with [Plan the move from Yarn Berry to pnpm](https://github.com/viniciusoliveiras/portfolio/issues/8). |
| `typescript` `^4.3.5` | **Replace** | → `7.0.2`; the tsconfig is a rewrite, per [Pin the target stack versions](https://github.com/viniciusoliveiras/portfolio/issues/2). |

## What this hands to other tickets

- **[Choose the deployment target and rendering mode](https://github.com/viniciusoliveiras/portfolio/issues/9)** — the contribution calendar cannot server-render as a packaged component. Either accept a client-side fill-in, or fetch contributions in the loader and render `react-activity-calendar` directly. Same freshness question as `revalidate: 604800`.
- **The component-layer decision (still in the fog)** — needs exactly **one** primitive from this sweep: an accessible tooltip, covering the tech grid and recent-project cards. **No dialog primitive is required** — `WarningAlertDialog` is dead code.
- **[Settle the visual direction](https://github.com/viniciusoliveiras/portfolio/issues/6)** — owns two live effects the migration has no opinion on: the avatar tilt (`react-parallax-tilt`) and the icon set (`react-icons` vs a Lucide-plus-brand-fallback pairing).
- **[Decide what animates, and with what](https://github.com/viniciusoliveiras/portfolio/issues/11)** — inherits the typewriter. If it adopts `motion`, the effect is free; either way it should carry a `prefers-reduced-motion` guard the current library does not provide.
- **The Tailwind token layer (still in the fog)** — the calendar's `theme` is now two colours per scheme (`{ light: [zero, max], dark?: […] }`), and its tooltips are headless with optional packaged CSS. Both want to be driven from the design tokens rather than hardcoded, as `#FFD369` is today.
- **Sequencing warning** — porting `GithubCalendar.tsx` alone silently breaks the `Tech.tsx` tooltips, which depend on the global `react-tooltip` v4 instance it happens to mount. The two must move together.
