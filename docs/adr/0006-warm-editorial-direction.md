# ADR-0006: The warm editorial direction

- **Status**: Accepted
- **Date**: 2026-07-31
- **Supersedes**: [ADR-0005: Visual direction](0005-visual-direction.md) — its **visual axes only**. Everything ADR-0005 says about *process* survives, and so does every other ADR
- **Builds on**: [ADR-0001: Information architecture](0001-information-architecture.md), unchanged
- **Source**: `Portfolio Share.dc.html`, a Claude Design project imported 2026-07-31 via the `claude_design` MCP

## Context

ADR-0005 was implemented and cut over. Six days later a **new visual direction was authored in Claude Design** and handed to this repository to implement.

**The design file is the source of truth.** That was ruled explicitly during the grilling session that produced this ADR: the design itself was closed for debate and the session's remaining work was implementation. This ADR therefore records *what changed and what it cost* — it does not argue for the direction, and a reader looking for a defence of the palette will not find one here, by design.

**What did not change.** ADR-0001's information architecture is untouched: seven sections in the same order, `/pt` and `/en`, the message modules, `en satisfies Messages`. The design file is English-only with a `PT →` link pointing at the pre-cutover Vercel origin, and both of those are artifacts of it being a single-file share rather than decisions — read as the **English rendering of a two-locale page**.

## What supersedes ADR-0005, axis by axis

| Axis | ADR-0005 | ADR-0006 |
| --- | --- | --- |
| Lineage | Editorial / print résumé — Stripe Press, robinrendle.com | Warm editorial, materially darker and card-bearing |
| Prose face | Source Serif 4 (serif sets prose) | **Hanken Grotesk 300** (sans sets prose) |
| Display face | Source Serif 4 | **Instrument Serif**, roman and italic |
| Data face | JetBrains Mono | JetBrains Mono — **unchanged in face and in role** |
| Paper | `#FAF9F7` / `#1A1918`, neutral | `#F2EDE4` / `#141312`, warm |
| Surface | — (no such token) | **`#F7F3EB` / `#1A1918`**, new |
| Accent | `#B3261E` light / `#F0736A` dark, red, **per mode** | **`#2FA35C` verde, ONE value in both modes** |
| Canonical mode | Light, authored for paper | **Dark** — the design's initial state and its own thumbnail |
| Cards | Rejected outright as a SaaS-landing device | **Two bordered cards** on `surface`, 6px radius |
| Fills | Accent underlined links preferred over filled buttons | **Filled and outline pills**, seven of them |
| Marginalia | The **rail** — sticky per-section, 8rem, unnumbered | The **section mark** — numbered `01`–`06`, 260px, sticky on one section |
| Metrics | **Display figures** set large *above* the prose | Three-row **metric panel** beside it |
| Italic | Face deleted; nothing on the page was italic | **Load-bearing** — half the hero, the monogram, two emphasis runs, one skills row |
| Grain | — | A fixed noise overlay at `z-index: 50` |
| Breakpoints | Tailwind defaults, `md` and `lg` | Tailwind defaults **plus `wide: 820px`**, the design's one authored step |

## Colour, with measured contrast

Ratios computed 2026-07-31 against each mode's own paper, by the same method ADR-0005 used.

**Values taken verbatim from the design file.** No value below was adjusted.

| Token | Light | Ratio | Dark | Ratio |
| --- | --- | --- | --- | --- |
| `paper` | `#F2EDE4` | — | `#141312` | — |
| `surface` | `#F7F3EB` | — | `#1A1918` | — |
| `ink` | `#1C1917` | 15.00 AAA | `#E8E4DE` | 14.65 AAA |
| `muted` | `#7A7268` | **4.06 — FAILS AA** | `#96908A` | 5.88 AA |
| `rule` | `rgb(28 25 23 / 0.16)` | ~1.36 decorative | `rgb(232 228 222 / 0.14)` | ~1.34 decorative |
| `accent` | `#2FA35C` | **2.76 — FAILS AA** | `#2FA35C` | 5.76 AA |
| `on-accent` | `#FFF8EF` on accent | 3.06 AA-large | `#FFF8EF` on accent | 3.06 AA-large |

### Three findings, accepted rather than fixed

These were measured during the grilling session, put to the author, and **knowingly accepted**. They are recorded here so nobody later "discovers" them and assumes an oversight.

1. **`muted` fails AA on light paper at 4.06:1**, and it is not decorative: it carries the 11px mono labels, every experience bullet, both work-card paragraphs and the education lines. ADR-0005 held `muted` to AAA (7.20 / 7.49) *specifically* because it carries load-bearing small text. That reasoning is not refuted here — it is overridden.
2. **`accent` fails AA on light paper at 2.76:1.** This also reverses ADR-0005's rule 2 ("never cross an accent with the other mode's paper"), which existed precisely to prevent this. Verde is legal on dark and is not on light, and it ships on both. The visible cost is that the section marks, the `Go` row and the metric labels read faint in light mode.
3. **`rule-strong` is retired.** ADR-0005 kept a second, darker line token so that any rule bounding an *interactive* surface met WCAG's 3:1 non-text minimum. The design uses one line value everywhere, so the bar's underside and the outline pills' borders now sit at ~1.36:1 instead of ≥3:1.

**Trigger to reopen all three:** any accessibility audit, any report from a real reader that light mode is hard to read, or a decision to make light the canonical mode. The fix is known and cheap — deepen the light accent toward `#016431` (6.28) and `muted` toward `#564E45` (7.00), and restore `rule-strong` — and none of it touches structure. The ladder of candidate values is in the session that produced this ADR.

### One accent, not two

`accent` and `on-accent` are deliberately **absent from the dark-mode override block** in `global.css`. Repeating the same value there would imply a mode flip that does not exist, and the browser suite asserts the *same* resolved colour under both `prefers-color-scheme` values so that a future per-mode accent fails a test rather than passing unnoticed.

## Typography: three families, four files, still self-hosted

The design loads all three families from the **Google Fonts CDN**, with a `preconnect` to `fonts.googleapis.com`. That is the one place this implementation departs from the file, and it was decided explicitly.

**Self-hosted, four files, 99.2 KB, all four preloaded.**

| File | Size | Kind |
| --- | --- | --- |
| `instrument-roman.woff2` | 21.0 KB | static 400 — no weight axis |
| `instrument-italic.woff2` | 22.1 KB | static 400 italic |
| `hanken.woff2` | 29.2 KB | variable, **instanced** to `wght 300–500` |
| `mono-2.woff2` | 29.3 KB | variable, **instanced** to `wght 400–500` |

Against ADR-0005's 92.8 KB that is **+6.4 KB** for a third family and a genuinely-used italic.

**Why not the CDN**, since the design specifies it:

- **Cross-origin font caching no longer exists.** Browsers partitioned the HTTP cache by top-level site in 2020, so the "they already have it cached" argument is dead and every visitor downloads it regardless.
- **Two origins on the critical path.** The stylesheet is render-blocking, and the binaries come from `fonts.gstatic.com` — which the design's `preconnect` does not cover, so the second handshake is paid in full.
- **It would have deleted a test rather than edited one.** `tests/browser/rendered.spec.ts` asserts *zero third-party requests*. Self-hosting is the only reason that assertion survives this redesign, and that is the clearest statement of what the CDN would have cost.
- The css2 URL also over-fetches: it requests Hanken italic and weights 400/600, none of which the page uses.

Taken from Google's own `latin` unicode-range blocks, which are already subset — so there is no subsetting pass of ours to drift. **The two variable faces are instanced to the ranges the page actually uses**, which is what makes the `font-weight` ranges in `@font-face` truthful rather than an invitation to synthesise. `mono-2.woff2` carries a new filename because `/fonts/(.*)` is cached `immutable` for a year and the retired `mono.woff2` was a pinned static 500.

**The italic is not optional.** ADR-0005 deleted its italic face on three independent findings that nothing on the page was italic. That is comprehensively false here: the hero's surname, the bar's monogram, the Summary and Contact emphasis runs, and the Skills `Learning` row are all italic.

## The token layer

Written CSS-first into Tailwind v4's `@theme`, as before. **`@theme inline` remains forbidden** — the hazard ADR-0005 measured (values inline into utilities, the dark override silently stops working, no error) is unchanged.

**Three mono tokens, collapsed from the design's five.** The file carries five near-identical mono-label variants across ~30 uses, differing only by size (10/11px) and tracking (0.10/0.12/0.14/0.16em). That spread is an artifact of hand-written inline styles rather than intent, so it became `mark` (11px/0.14em/caps), `meta` (11px/0.10em, sentence case) and `micro` (10px/0.14em/caps). Largest single shift: the footer and hero meta labels move to a shared 0.14em — 0.02em at 10px is 0.2px per letter.

**Four serif display tokens, for the four sizes that repeat** (`figure`, `entry`, `decade`, `role`). One-off display sizes — the hero, the Summary lede, the Contact statement, the education title, the monogram — stay as arbitrary values at their single call site, because tokenising a size with one caller hides the number from whoever is reading the component.

This is the "hybrid" of three options put to the author: tokenise the roles, keep the one-off clamps.

## Consequences

### The rail is gone, and `CONTEXT.md` changes

The **section mark** is not a renamed rail. The rail was per-section marginalia — sticky, scoped to its section, released at its end, never numbered, never a list. The mark is a numbered index entry in a 260px column, static on five of six sections. They share a position on the page and nothing else, which is why the term is replaced rather than redefined.

**A consequence worth stating: the `TRABALHOS` layout constraint is retired.** ADR-0005's rail was 128px, and the short pt-BR form existed because `TRABALHOS SELECIONADOS` wrapped to three lines in it. The mark's column is 260px, so the copy is free to say what it means — and the bar's abbreviation is now a *separate authored string* (`nav.anchors`) rather than the same one doing two jobs.

**`display figures` no longer means what it says.** ADR-0005 defined them as metrics set large *above* the prose, and called the placement "the decision, not the styling". They now sit in a panel *beside* it. The skimmability argument survives the move — 72px type beside 16px prose is still read first — but the definition does not, and the glossary is corrected rather than quietly left half-true.

### One primitive is unresolved, not decided

The design has **no mobile navigation**: its nav is a single `flex-wrap` row of six 11px mono items, and its "mobile" mode is a JS `matchMedia(819px)` swapping inline styles. A single-file preview **cannot express a `<dialog>`**, so the sheet's absence is read as a limitation of the medium rather than a ruling.

**The sheet is therefore retained** — structure untouched, restyled to the new palette and faces, all five of its browser tests still passing — and Claude Design has been asked to rule on it. Five further questions went with it, all traceable to the same root cause: the breakpoint ladder above 820px, which mode is canonical, focus states, reduced motion, and a 404 treatment. **Focus (derived from accent) and reduced motion (guarding `scroll-behavior`) are implemented as defaults meanwhile**, and both are marked in the source as awaiting an answer.

### The grain is the highest-consequence rule on the site

The overlay is `position: fixed; inset: 0` at `z-index: 50` — **above** the bar's 40 — so it covers every interactive element on the page and is survivable only because of `pointer-events: none`. Lose that one declaration and the page looks perfect and nothing is clickable, with no visual symptom. There is a browser test asserting it.

Its `feColorMatrix` is equally easy to lose and was in fact **dropped once while transcribing the data URI during this implementation**. Without it the raw `feTurbulence` paints at the div's full 0.4 opacity: measured, dark paper lifted from `#141312` to a mean `#353433` with a luminance stdev of 8.66, and `og.png` inflated from 21 KB to 285 KB because random noise does not compress. It reads as a deliberately grungy design rather than as a bug. **The card's file size is a usable canary** for whether that data URI is still intact.

### The hero eyebrow is cut, and the availability claim with it

The design opens the page with a three-part mono row above the name — `Portfolio — 2026` · `● Open to conversation` · `Rio de Janeiro, BR` — under a full-ink rule. **Cut on the author's call after seeing it rendered**, which is the one place this implementation departs from the design on taste rather than on an engineering constraint.

The name now opens the page on the section's own 88px, and the `<h1>`'s 48px top margin went with the eyebrow rather than being left as an orphan. `chrome.kind` and `chrome.availability` existed only for that row and are deleted from both message modules; `place` and `builtWith` survive in the footer.

**This settles a decision that had been reversed twice.** `75233bf` dropped the availability claim from the contact statement, on the grounds that announcing a passing state dates the page and that such a line is the only sentence on the page able to go stale with no fact changing — the full argument is in [site copy](../site-copy.md). This ADR originally *relocated* that claim to the eyebrow rather than reversing it, reasoning that a status line at the top is a materially different thing from a standing position in the last sentence. With the eyebrow gone the claim is simply absent, which restores site-copy's position in full — including its statement that **no string on the page asserts availability**, which had briefly stopped being true.

Third state of one decision, so it is now **asserted in `tests/prerendered-output.test.ts`** rather than left as prose: the exact strings that have been on the page and removed must not reappear. A rewording will slip past it, deliberately — the guard exists to make a reversal explicit, not to police vocabulary.

### Two emphasis runs are matched, not marked up

The design sets a clause of the Summary lede and the closing clause of the Contact statement in accent italic. This did **not** become an emphasis kind on `Segment`: a message typed as a node is assignable to any other node, which would switch `satisfies Messages` off for the two longest sentences on the page — the exact hole that type exists to close.

Instead the copy carries the sentence and the run as two plain strings, and `Emphasise` finds and wraps it. **It fails open** — a run that does not match renders the sentence plain, with correct text, no italic and no error — so the substring relationship is asserted for both locales in `tests/prerendered-output.test.ts` rather than trusted.

### Assets

`favicon.svg` is redrawn as the design's monogram — a roman `V`, an italic verde `O` and a period — from **real Instrument Serif outlines extracted from the shipped `woff2` files**, so it cannot drift from the site's type. It relies on **nonzero winding**: the `O`'s counter is a contour wound against the first, and setting `evenodd` anywhere fills it solid. `og.png` is regenerated from `og/og.html` through the existing Chromium step, and inverted to dark with the palette.

The card stays **locale-neutral by construction**, which is what lets one file serve both routes — and that constraint shaped it. The obvious card in this language would carry the design's eyebrow trio and the three labelled figures, and every one of those labels needs translating, so none of them is on it. Only the split name, the invariant role line and the accent rule survive. (The eyebrow was subsequently cut from the page too, for unrelated reasons — see above — so the card and the hero happen to agree.)

### What ADR-0005 keeps

Its **process** findings are untouched and still binding: the `@theme inline` hazard, `head()`'s meta dedupe on `name` alone, `crossOrigin` on same-origin font preloads, the unhashed-filename discipline for anything under `/fonts/`, `items-start` over `items-end` for figure rows, and the reasoning that made the sheet the platform's `<dialog>` rather than a dependency. ADR-0005 is marked Superseded, not deleted, and its road-not-taken sections stay readable — reversing this ADR means going back to a document, not to a reconstruction.
