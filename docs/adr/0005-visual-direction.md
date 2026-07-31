# ADR-0005: Visual direction for the redesigned portfolio

- **Status**: **Superseded** on 2026-07-31 by [ADR-0006: The warm editorial direction](0006-warm-editorial-direction.md) — its **visual axes only**
- **Date**: 2026-07-27

> **Superseded 2026-07-31.** A new visual direction was authored in Claude Design and
> implemented; ADR-0006 supersedes the axes below — the lineage, the palette, the faces,
> the scale, the rail, the cards-versus-rules ruling and the italic. Read ADR-0006 first,
> and read this document for what it still owns.
>
> **What is still binding.** Every *process* finding here survives, because ADR-0006
> re-verified rather than replaced them: the `@theme inline` hazard, `crossOrigin` on
> same-origin font preloads, the unhashed-filename discipline under `/fonts/`, `head()`'s
> meta dedupe keying on `name` alone, `items-start` over `items-end` for figure rows, and
> the finding that the mobile sheet is the platform's `<dialog>` rather than a dependency
> or a hand-roll. So is §Motion's principle that motion be layout- or state-derived with
> no animation library.
>
> **This document is kept, not cleaned up.** Its measured contrast tables are the
> reference ADR-0006's own findings are stated against, and its road-not-taken sections
> are why reversing ADR-0006 means going back to a document rather than reconstructing an
> argument. Nothing below is edited to match the new direction — read it as a record of
> what was true, and of what was deliberately given up.
- **Promoted**: 2026-07-29, from `docs/design-brief.md`, by [Assemble the deliverable](https://github.com/viniciusoliveiras/portfolio/issues/22)
- **Resolves**: [Settle the visual direction for the redesign](https://github.com/viniciusoliveiras/portfolio/issues/6), on [the migration map](https://github.com/viniciusoliveiras/portfolio/issues/1)
- **Builds on**: [ADR-0001: Information architecture](0001-information-architecture.md)
- **Amended by**: [Decide what animates, and with what](https://github.com/viniciusoliveiras/portfolio/issues/11) (§Motion), and the font corrections in §Typography and §Consequences below

Still referred to throughout the corpus as **the design brief** — that is the name every other document uses for it, and promotion does not rename the thing, only where it lives. It takes `0005` because reversing it invalidates four other documents: the [token layer](../research/tailwind-token-layer.md), the [section layouts](../section-layouts.md), the [favicon and asset serving](../research/favicon-and-asset-serving.md) and the [site copy](../site-copy.md). That is the test the closing ticket adopted — a number goes to a decision whose reversal reaches past itself.

## Context

ADR-0001 cut every screenshot, the contribution calendar and the icon wall. What remains across seven sections is a positioning line, a summary paragraph, a four-role timeline, 2–3 work entries whose punch is `15 modules / 8 clients / 400+ users`, a grouped skills list, education, and contact links.

**There is no imagery for a visual direction to arrange.** This is therefore a typographic problem, and the brief is organised as one.

## Reference lineage: editorial / print résumé

The page reads as a **well-set document** — a magazine profile or a Stripe Press page — not as a dev-portfolio landing page.

**Reference points:** Stripe Press, robinrendle.com, and the general register of print editorial — serif display, generous measure, real typographic hierarchy, rules instead of cards.

**Explicitly wrong, for the record:**

- **Bold statement minimalism** (oversized type as graphic, one idea per viewport). Fights seven sections of dense factual content, and it is a designer's move that invites being judged as a designer rather than an engineer.
- **Full-bleed tonal bands** and card grids. SaaS-landing devices that contradict the book lineage and add a second background tone to maintain across two colour modes.
- **The 2021 bootcamp look** the current site has — badge walls, neon-on-dark, gradient accents.

Why editorial over the safer "quiet craft" lineage (rauno.me / Linear / Geist): that register is the 2026 house style for frontend developers, so it avoids being wrong rather than being distinctive. Editorial differentiates, and it suits content that is genuinely prose.

## Metrics: display figures above prose

Editorial prose wants numbers inside sentences. ADR-0001's evidence strategy wants them skimmable, because with no public code the metrics *are* the argument. **Skimmability wins**: each work entry opens with its figures set large, then the prose follows.

```
SELECTED WORK          ← mono, muted, tracked caps

ERP monorepo           ← serif 600

 15        8      400+  ← serif 600, tabular-nums
 MODULES   CLIENTS USERS ← mono, muted

A modular ERP serving eight enterprise
clients. Led data modeling and code
review across the monorepo.

TypeScript · React · Node · MSSQL     ← mono, muted
2023—2026
```

Rejected: **margin notes** beside the prose (needed a wide viewport and a mobile collapse), and **prose-only emphasis** (bets the hiring argument on someone reading rather than skimming).

**Consequences.** No asymmetric outer column is needed, so the text container stays a plain centred measure. The renders are near-identical at every width. And the serif must carry good numerals — see `--text-figure` below, which mandates `font-variant-numeric: tabular-nums`.

## Colour

**Light is the canonical mode**, authored for paper. A dark palette ships behind `prefers-color-scheme` so a visitor on a dark OS is not flashbanged. **No manual toggle** — that would need `localStorage` plus an inline anti-flash script, i.e. the one thing that would put persisted client state back into a site ADR-0001 just made fully static.

The current palette **cannot** survive a light default regardless of taste. Measured against white: `#FF6464` is **2.9:1** and `#00A8CC` is **2.8:1** — both fail WCAG AA for text. They were tuned for a `#222831` background.

Resolution: **ink on paper plus one accent**, where the accent is `#FF6464` **deepened** rather than abandoned. Red is the most canonically print accent there is. The cyan and the yellow are dropped — two accents in a monochrome editorial system compete, and at the darkness accessibility demands, `#00A8CC` becomes a teal that no longer reads as *the* cyan. Note the yellow `#FFD369` is also today's `theme-color` meta, which changes with it.

### Tokens, with measured contrast

Ratios computed 2026-07-27 against each mode's own paper.

**Light**

| Token | Value | Ratio | Grade | Used for |
| --- | --- | --- | --- | --- |
| `paper` | `#FAF9F7` | — | — | Page background |
| `ink` | `#1A1A1A` | 16.54:1 | AAA | Prose, headings, figures |
| `muted` | `#545454` | 7.20:1 | AAA | Mono labels, dates, captions |
| `rule` | `#E2E0DC` | 1.25:1 | decorative | Editorial dividers |
| `rule-strong` | `#8E8B86` | 3.23:1 | AA non-text | Interactive-surface boundaries |
| `accent` | `#B3261E` | 6.21:1 | AA | Links, active anchor, section marks |
| `on-accent` | `#FFFFFF` | 6.54:1 | AA | Text on an accent fill |
| `ring` | `#B3261E` | 6.21:1 | AA non-text | Focus indicator |

**Dark**

| Token | Value | Ratio | Grade | Used for |
| --- | --- | --- | --- | --- |
| `paper` | `#1A1918` | — | — | Page background |
| `ink` | `#E8E6E1` | 14.08:1 | AAA | Prose, headings, figures |
| `muted` | `#ADA9A0` | 7.49:1 | AAA | Mono labels, dates, captions |
| `rule` | `#33312E` | 1.35:1 | decorative | Editorial dividers |
| `rule-strong` | `#6A6862` | 3.15:1 | AA non-text | Interactive-surface boundaries |
| `accent` | `#F0736A` | 6.16:1 | AA | Links, active anchor, section marks |
| `on-accent` | `#1A1918` | 6.16:1 | AA | Text on an accent fill |
| `ring` | `#F0736A` | 6.16:1 | AA non-text | Focus indicator |

### Three rules that fall out of the numbers

1. **`on-accent` flips between modes** — white on the light accent, near-black on the dark one. White on `#F0736A` is only **2.85:1** and fails. This is the easiest thing in the palette to get wrong.
2. **Never cross an accent with the other mode's paper.** `#B3261E` on dark paper is 2.69:1; `#F0736A` on light paper is 2.71:1. Both fail. Each accent is valid only in its own mode — which is also why `ring` needs no separate token.
3. **`muted` is AAA on purpose.** It carries the 12px mono labels — section names and metric labels — which are load-bearing content, not decoration. Barely-AA was not good enough for the smallest text on the page.

`rule` at ~1.3:1 is intentional: hairline editorial dividers are decoration, and WCAG's 3:1 non-text minimum applies to meaningful graphics and UI component boundaries. Any rule that delimits an **interactive** surface — the sticky bar's underside, the drawer's edge — uses `rule-strong` instead.

**Preferred over fills:** the hero's two actions (contact, résumé PDF) are accent-coloured underlined text links, not filled buttons. Fills are a UI convention that fights the editorial frame. `on-accent` is specified for the cases that do need one.

The CSS-first binding of these names into Tailwind v4's `@theme` belongs to the token-layer ticket; this brief fixes the semantic names and the values.

## Typography

**Source Serif 4** for everything that is prose, heading or figure. **JetBrains Mono** for everything that is *data* — section labels, metric labels, dates, stack strings, the skills groups.

The mono is a deliberate borrowing from the rejected "quiet craft" lineage, and it is canonically editorial anyway: the reference triple-stack pairs a serif with JetBrains Mono for exactly this role. Prose, headings and figures all stay serif; the mono never touches prose. It is the one signal that an engineer wrote this, inside an editorial shell.

Verified against the Google Fonts metadata and CSS2 API, 2026-07-27:

| | Version | Axes | Italic | pt-BR |
| --- | --- | --- | --- | --- |
| Source Serif 4 | v14 | `opsz 8–60`, `wght 200–900` | true italic axis | `latin-ext` ✓ |
| JetBrains Mono | v24 | `wght 100–800` | roman only — labels need none | `latin-ext` ✓ |

~~**Both carry `latin-ext`**, so pt-BR diacritics are covered.~~ Rejected: Playfair Display (fashion-coded, and high-contrast strokes go thin at body-adjacent sizes), a single-serif system (data never separates from prose), and Newsreader — which was shortlisted for its optical-size axis before verification showed **Source Serif 4 has `opsz 8–60` too**.

> **Corrected 2026-07-29.** The `latin-ext` inference is stale, though the fact is true. The [token layer](../research/tailwind-token-layer.md) §6 measured that **`latin-ext` is not needed**: every Portuguese diacritic sits in `U+00C0–U+00FF`, inside the `latin` range, and every proper noun in scope (Devex Soluções, Inovasensor, UniCarioca) is covered by `latin` alone. `latin-ext` covers Central and Eastern European letterforms this site has no copy for. Both faces still *carry* it; the subset does not take it. Font selection is unaffected — this changed the payload, not the choice.

### Use the optical-size axis

Because `opsz` is available, display sizes and body sizes take correct letterforms rather than one compromise: high contrast and tighter fit for the hero and the figures, sturdier strokes for prose. Set `opsz` explicitly per role — do not rely on defaults.

### Hosting: self-hosted

~~**Three** variable `woff2` files vendored into `public/fonts/` — Source Serif 4 roman, Source Serif 4 italic, JetBrains Mono roman — subset to `latin` + `latin-ext`, `font-display: swap`, the two roman files preloaded. Italic is not preloaded.~~

> **Corrected 2026-07-29.** **Two** variable `woff2` files, not three — Source Serif 4 roman and JetBrains Mono roman — vendored into `public/fonts/`, subset to **`latin`** only, `font-display: swap`, **both preloaded**.
>
> The italic face is gone. [The section layouts](../section-layouts.md) §7 found that across all seven sections nothing is italic — no pull quote, no figure caption, no display italic — and it was the last decision that could have created a use; the [message shape](../research/i18n-and-locale-routing.md) §8.1 independently has no emphasis segment kind, and the [copy](../site-copy.md) never asks for one. Three independent reasons, all pointing the same way, so the third `woff2` and its `@font-face` block both delete, taking a measured **80.2 KB** with them.
>
> **A consequence worth stating, because it retires a distinction this brief introduced:** with the italic gone the two survivors are roman (73.4 KB) and mono (19.4 KB), and *both* are preloaded — so the payload is **92.8 KB total and 92.8 KB preloaded**. "The two roman files preloaded" no longer distinguishes anything, because everything shipped is preloaded. The token layer's headline figure of 173.0 KB is superseded by 92.8 KB.

This deletes the `preconnect` and the render-blocking Google stylesheet that `src/pages/_document.tsx` currently carries, adds no dependency, and leaves the site with **zero third-party requests**.

### Scale

Base is **18px**, not 16px: serif prose at a 65ch measure needs the extra size, which is standard for reading contexts.

| Role | Face | Size / line-height | Notes |
| --- | --- | --- | --- |
| `label` | Mono 500 | 12 / 1.4 | Uppercase, tracking `0.08em`, `muted`. Rail names, metric labels, dates, stack strings |
| `body-sm` | Serif 400, `opsz 16` | 15 / 1.6 | `muted`. Captions, secondary lines |
| `body` | Serif 400, `opsz 18` | 18 / 1.65 | `ink`. Prose |
| `lede` | Serif 400, `opsz 22` | 22 / 1.55 | `ink`. The summary paragraph |
| `entry` | Serif 600, `opsz 24` | 24 / 1.3 | `ink`. Work and role titles |
| `figure` | Serif 600, `opsz 44` | 44 / 1.0 | `ink`, `font-variant-numeric: tabular-nums` |
| `hero` | Serif 400, `opsz 60` | `clamp(2.5rem, 6vw, 4rem)` / 1.05 | `ink`. The name |

## Layout and density

Density is **spacious**, not dense: section padding-block 96px at `lg`+ and 64px below, 32px between blocks, 12px from a label to its content.

### Centred measure with a left rail

Text sits in a centred measure capped at `min(65ch, 100% - 2rem)`. At `lg`+ a **rail** roughly `8rem` wide sits to its left, holding that section's name in the `label` style.

The rail label is **marginalia, not a sidebar**: it travels with its section and is released at the section's end, achieved with `position: sticky` scoped to the section as its containing block. It is *not* a persistent list of all seven names.

Below `lg` the rail collapses: the label sits above the section's content, static, same style.

```
┌─ sticky top bar ──────────────────────────┐
│ Vinicius Oliveira   exp work skills  PT|en │
└────────────────────────────────────────────┘

SELECTED    ERP monorepo
WORK        ← sticky, travels with its section
             15    8   400+

            A modular ERP serving eight
            enterprise clients across the
            fifteen modules.
────────────────────────────────────────────
SKILLS      ← previous released; this takes over
```

Rules dividing the seven sections stay inside the rail-plus-measure grid.

### Top bar and navigation

A sticky bar, 56px, its underside in `rule-strong` (it bounds an interactive surface, so it needs 3:1). It carries the name at left; at `md`+ the anchors and the language switcher at right.

**The bar carries four anchors, not seven** — Experience, Selected work, Skills, Contact. The hero needs none (it is the top), Summary sits directly beneath the hero, and Education is a low-value jump target.

**Below `md`, a drawer** behind a menu button, holding all seven anchors and the language switcher. This is a real primitive: focus trap, `Escape` to close, scroll lock, `aria-modal`. **It overturns ADR-0001's hope that the component layer needs no primitives** — see Consequences.

> **Resolved 2026-07-28** by [the sheet primitive decision](https://github.com/viniciusoliveiras/portfolio/issues/15) — spec in [`docs/research/mobile-sheet-primitive.md`](../research/mobile-sheet-primitive.md). It is a **full-bleed sheet**, not a side-anchored drawer, on the native `<dialog>` element. Read "drawer" throughout this brief as "sheet".

Sections take `scroll-margin-top` of the bar height plus `1rem` so anchored jumps do not land under the bar.

### Breakpoints

**Tailwind v4 defaults** — `sm 40rem`, `md 48rem`, `lg 64rem`, `xl 80rem`, `2xl 96rem`. The current custom set is dropped: `sm: 26.5625em` (425px) is an oddity and `xs: 20em` (320px) is below anything still shipping.

## Motion

**Layout-derived only.** The design reads restrained. The full inventory, **closed at five entries**:

| What | How |
| --- | --- |
| Rail label travelling with its section | `position: sticky`. CSS only, no JS |
| Anchor jumps | `scroll-behavior: smooth` on `html` |
| Hover and focus | 150ms colour and underline transition |
| Drawer open / close | 200ms — resolved to an **opacity cross-fade**, not a slide; CSS-only, no JS |
| Locale switch `/pt` ↔ `/en` | 200ms cross-fade via same-document View Transitions; one router prop, no JS of our own |

**No scroll reveals anywhere.** They are the most clichéd motion on the web and they delay exactly the content a skimming recruiter came for. Every byte of content is present on first paint.

`@media (prefers-reduced-motion: reduce)` sets `scroll-behavior: auto` and drops the drawer transition to 0ms.

The distinctiveness comes from the sticky marginalia label — real craft, zero JavaScript — rather than from applied animation. ~~This constrains [Decide what animates, and with what](https://github.com/viniciusoliveiras/portfolio/issues/11) to a small surface: there is no animation library in the budget, and `react-parallax-tilt` survives only if a tilted avatar does, which remains open.~~

> **Resolved 2026-07-28** by [Decide what animates, and with what](https://github.com/viniciusoliveiras/portfolio/issues/11). Five findings, one of them a reversal of this section.
>
> **The avatar tilt is dropped, so `react-parallax-tilt` is a plain drop** — not "keep if the avatar survives". A mouse-tracking 3D tilt is applied decoration, which is what "layout-derived only" excludes; it is pointer-only, so it does nothing for the phone-skimming reader the IA is built for; and on a site whose sheet holds zero React state it would be the only component in the tree needing mouse handlers. This **overturns the [dependency verdicts](https://github.com/viniciusoliveiras/portfolio/issues/4)' conditional keep** and narrows the prototypes' avatar question to *whether an illustrated avatar appears at all*, with no dependency riding on the answer.
>
> **The inventory gained a row.** The four bar anchors are same-page hash links, so `/pt` ↔ `/en` is the **only route change on the entire site** — and a peculiar one, since the layout is byte-identical, every string is replaced, and `resetScroll={false}` holds the reader's section. Left instant, every word changes in one frame, which reads as a rendering glitch rather than a navigation. A cross-fade is *state-derived*, the same class as the sheet's fade, so it needs no exception to the principle — and it is literally the print idiom [the sheet decision](https://github.com/viniciusoliveiras/portfolio/issues/15) already adopted, one spread cross-fading into another. 200ms, matching the sheet, so one duration governs every state change on the site.
>
> **The 150ms was never ours to choose.** It is Tailwind's own `--default-transition-duration`, verified in the 4.3.3 tarball, alongside `--default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)` — so `duration-150` never needs writing.
>
> **The inventory is closed, not merely fixed**, at zero net bytes: no animation dependency, and motion must be expressible in CSS or through a router prop already in the tree. A prototype wanting anything outside these five rows **reopens that ticket** rather than deciding locally — the same trigger-to-reopen shape [ADR-0002](0002-typescript-and-biome-baseline.md) used for Biome's type-aware rules. Without it, the tilt decision gets relitigated once per section, and the redesign stops being the typographic exercise this brief says it is.
>
> **Reduced motion is enumerated, three of four, and the hover is deliberately exempt** — the guidance targets movement, and a colour fade has no vestibular effect. A global `*, *::before, *::after` kill switch was rejected on a concrete ground rather than taste: it **cannot reach the view-transition pseudo-element tree**, so it would leave the one new animation running at full duration while appearing to have killed everything. CSS in [`tailwind-token-layer.md`](../research/tailwind-token-layer.md).

## Consequences

### The component layer needs a primitive after all

ADR-0001 hoped the token-layer question would answer itself as *no primitives*: `WarningAlertDialog` was dead code, and both tooltip consumers were cut. **The mobile drawer reverses that.** A modal with a focus trap, scroll lock, `Escape` handling and `aria-modal` is the one primitive this site cannot hand-wave, and whether it is hand-rolled or taken from a headless dependency is now a sharp question — tracked separately.

~~It also reintroduces a small amount of client state (drawer open/closed). Unlike a theme toggle this needs no persistence and no anti-flash script, so the site stays static and prerenderable.~~

> **Corrected 2026-07-28.** The client state is **zero**, not small. The sheet is driven imperatively off a ref — `showModal()` / `close()` — so the DOM's `open` attribute *is* the state and React never holds a copy. The conclusion this paragraph was reaching for holds more strongly than it claimed. Two further corrections from the same decision: the primitive is **the platform**, not a dependency and not hand-rolled, so no new package enters the stack; and **"scroll lock" overstates what had to be built** — `overscroll-behavior: contain` on the sheet is the whole of it, because a full-bleed sheet leaves no scrollable surface exposed.

### Scroll-spy is not needed

Because the rail is per-section marginalia rather than a persistent nav list, no `IntersectionObserver` is required. The four bar anchors are plain links.

### Assets

The Google Fonts `preconnect` and Heebo stylesheet are **deleted**, replaced by ~~three~~ **two** self-hosted `woff2` files — closing the one asset question ADR-0001 tied to this ticket. Heebo is gone from the stack entirely. The `theme-color` meta needs a new value per mode, since `#FFD369` dies with the yellow.

~~Still open, and still owned by the asset question: which avatar survives, and where the résumé PDF is served from.~~

> **Corrected 2026-07-29.** Two files, not three — see the correction in §Typography. Both remaining asset questions are also now closed, and both closed *negatively*, which this paragraph did not anticipate:
>
> - **No avatar survives.** [The section layouts](../section-layouts.md) §1 cut it outright — a face outranks type for attention and would shift the hero's thesis from scope to appearance, and the GitHub photo would break the zero-third-party-requests property these self-hosted fonts just won. `public/images/avatar.svg` deletes.
> - **The résumé is served from `public/resume-en.pdf`**, unhashed, per [the favicon and asset serving decision](../research/favicon-and-asset-serving.md) §4 — which also found the PDF **was not in the repository at all**.
>
> The `theme-color` tags did not survive as written either: [head and metadata](../research/head-and-metadata.md) §3 found `head()` deduplicates on `name` alone, so two tags differing only by `media` collapse to one. They become shell JSX.

### The token layer is now fully specifiable

The remaining fog was blocked on the visual direction. With the palette, scale, breakpoints and spacing fixed, binding them into Tailwind v4's CSS-first `@theme` is mechanical — plus the one primitive decision above.

### Page-level design is unblocked

Prototype variations for the seven sections can proceed: the lineage, palette, type scale, measure, rail behaviour and motion budget are all fixed.
