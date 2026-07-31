# CONTEXT

Glossary for this repository, as [`docs/agents/domain.md`](docs/agents/domain.md) specifies: one `CONTEXT.md` at the root, alongside `docs/adr/`.

**It defines terms and points at the document that fixed each one. It never restates a decision** — the decision lives in exactly one place, and this file is an index into that, not a copy of it.

**It describes the site in `src/` today.** Every term below names something that exists. Rewritten 2026-07-31 for [ADR-0006](docs/adr/0006-warm-editorial-direction.md), which superseded the visual axes of ADR-0005 — the history of what moved lives in ADR-0006, not here, because this file is a glossary and not an archive.

## Why this file exists

Every term below has a plausible wrong synonym, and three pairs are actively dangerous:

- **sheet / drawer** — the word *drawer* implies the side-slide that was explicitly rejected.
- **mark / bar** — two different things in two different places, with two different string sets behind them.
- **rule / ink** — the *two rule strengths* are not interchangeable. Section boundaries are full `ink`; dividers inside a section are the `rule` hairline. Swapping them is the single most visible way to make this page look like a different design.

And one term is a trap because it used to mean something else: ***rail*** **is retired.** It named ADR-0005's sticky per-section marginalia, which no longer exists. If you find it in an older document, that is what it meant there; do not apply it to the mark.

If your output names one of these concepts, use the term as it is defined here.

---

## The page

| Term | Means | Not | Fixed by |
| --- | --- | --- | --- |
| **the mark** | The numbered index entry — `01 / Summary` — in a 260px column, its number in accent. Six sections have one. **Static on five; sticky on Skills alone**, and that asymmetry is correct | ***the rail*** (retired, and a different behaviour), *sidebar*, *nav*, *table of contents*, *eyebrow*. It lists no destinations and is never clickable | [ADR-0006 §Consequences](docs/adr/0006-warm-editorial-direction.md) |
| **the bar** | The sticky top bar: the monogram at left, **five** anchors and the locale switch at right, translucent over the page. Below `wide` its anchors move into the sheet | *header*, *navbar* — and above all not *the mark*. **Six mark labels against five bar anchors is correct**, and the two are authored as separate string sets | [ADR-0006](docs/adr/0006-warm-editorial-direction.md), `src/portfolio/anchors.ts` |
| **the sheet** | The mobile-only full-bleed overlay holding all six anchors, built on the native `<dialog>` opened with `showModal()`, holding **zero** React state | ***drawer*** — the word implies the side-slide that was explicitly rejected; also not *modal*, *dialog component*, or *menu*. There is no dependency behind it | [mobile sheet primitive](docs/research/mobile-sheet-primitive.md) |
| **the monogram** | `V`, an italic accent `O`, a full stop. The bar's link back to the top, drawn from real Instrument Serif outlines and carrying the full name as its accessible name | *logo*, *wordmark*, *avatar* — no face appears anywhere. It is also the favicon, but the term names the mark, not the file | [ADR-0006 §Assets](docs/adr/0006-warm-editorial-direction.md) |
| **the metric panel** | The ERP card's right-hand column: three equal rows, each a display figure with its label on the same baseline | *stats grid*, *KPI row*. And **not** "figures above the prose", which was ADR-0005's arrangement | [ADR-0006 §Consequences](docs/adr/0006-warm-editorial-direction.md) |
| **display figures** | The three hard numbers — `15 / 8 / 400+`. Still the site's evidence and still read before the prose, but set **beside** it in the metric panel rather than above it. Numbers never appear inside a sentence | *metrics*, *stats*. ~~"set large above its prose"~~ — that definition retires with ADR-0005 | [ADR-0006 §Consequences](docs/adr/0006-warm-editorial-direction.md), values in `src/content/facts.ts` |
| **the decade marker** | The large serif year beside each role — `2026 — now`, `2023`, `2021`, `2019`. Accent on the current role only | *date*, *period* — the **period** is the separate mono line beneath it (`APR 2026 — PRESENT`) | [ADR-0006](docs/adr/0006-warm-editorial-direction.md), values in `facts.roleDecades` |
| **the chips** | The BPO card's three rounded rows pairing a technology with its role — framework, server state, backend. The first two are accent and the third muted, because the first two are the **decision** and the third is context | *tags*, *badges*, *pills* — the pills are a different component | [ADR-0006](docs/adr/0006-warm-editorial-direction.md), values in `terms.bpoArchitecture` |
| **the pills** | The two rounded action shapes: `pill-solid` filled (the hero's primary action, the email link) and `pill` outlined (the résumé action, the three other contact links). Both hover to accent | *buttons* — though note ADR-0005 preferred underlined links over fills, and ADR-0006 reverses that | [ADR-0006](docs/adr/0006-warm-editorial-direction.md) |
| **the grain** | The fixed noise overlay covering the whole viewport at `z-index: 50`, above the bar. **`pointer-events: none` is what makes it survivable** — without it every link on the site is dead and the page still looks perfect | *texture*, *noise layer*. Not decorative in the sense of "safe to edit": it has two load-bearing declarations and a browser test | [ADR-0006 §Consequences](docs/adr/0006-warm-editorial-direction.md) |

## Colour and type

| Term | Means | Not | Fixed by |
| --- | --- | --- | --- |
| **paper** | The page background. `#F2EDE4` light, `#141312` dark — **warm**, not neutral | *background*, *bg*, *surface* (a different token here), *white* | [ADR-0006 §Colour](docs/adr/0006-warm-editorial-direction.md) |
| **surface** | The raised background behind the two work cards. `#F7F3EB` light, `#1A1918` dark | *paper*, *card*, *elevated*. It has exactly one consumer, and it did not exist before ADR-0006 | [ADR-0006 §Colour](docs/adr/0006-warm-editorial-direction.md) |
| **ink** | Prose, headings, figures — **and every section boundary**. `#1C1917` light, `#E8E4DE` dark | *foreground*, *text*, *black*. Do not reach for `rule` where a section rule is wanted | [ADR-0006 §Colour](docs/adr/0006-warm-editorial-direction.md) |
| **muted** | Mono labels, dates, captions — **and, under ADR-0006, body prose**: the experience bullets, the card paragraphs, the education lines. **It measures 4.06:1 on light paper and fails AA**, knowingly | *secondary*, *subtle*, *grey*. And not "AAA", which is what ADR-0005 held it to and this direction gave up | [ADR-0006 §Colour](docs/adr/0006-warm-editorial-direction.md) |
| **rule** | The hairline editorial divider, ~1.36:1, used for every divider **inside** a section — experience rows, skills rows, card panel splits, the footer, the bar's underside | *border* or *divider* used interchangeably with **ink**. ***`rule-strong` is retired*** — there is one line value now, so interactive boundaries no longer get their own 3:1 token | [ADR-0006 §Colour](docs/adr/0006-warm-editorial-direction.md) |
| **accent** | The single accent: `#2FA35C`, verde vibrante, **one value in both modes**. Clears dark paper at 5.76:1 and **fails light paper at 2.76:1**, knowingly | *primary*, *brand*. And **not** a per-mode pair — ADR-0005's rule that an accent is valid only against its own paper is deliberately reversed. The old red is dead | [ADR-0006 §Colour](docs/adr/0006-warm-editorial-direction.md) |
| **on-accent** | Text on an accent fill: `#FFF8EF`, one value, because the accent is one value | a per-mode flip, which is what ADR-0005 needed. Use the `accent-surface` utility, which binds the pair together | [ADR-0006 §Colour](docs/adr/0006-warm-editorial-direction.md) |
| **the display face** | **Instrument Serif**, roman and italic. Headings, figures, decade markers, the monogram, the two lede paragraphs. **Display only** | *the body face* — that inverted under ADR-0006, and a bare size token renders in the sans unless `font-serif` is set | [ADR-0006 §Typography](docs/adr/0006-warm-editorial-direction.md) |
| **the body face** | **Hanken Grotesk** at weight 300, set on `html`. All prose that is not a lede | *the serif*. There was no sans in the stack at all before ADR-0006 | [ADR-0006 §Typography](docs/adr/0006-warm-editorial-direction.md) |
| **the data face** | **JetBrains Mono**. Marks, labels, dates, stack strings, chips, the footer. It sets data and **never** prose — unchanged in face and in role across both directions | *the mono* is fine as shorthand; *a heading face* is not | [ADR-0006 §Typography](docs/adr/0006-warm-editorial-direction.md) |
| **mark / meta / micro** | The **three** mono type roles, collapsed from the design's five near-identical variants. `mark` 11px/0.14em caps is the workhorse; `meta` 11px/0.10em is sentence case, for readable phrases rather than labels; `micro` 10px/0.14em caps is the hero meta labels and the footer | five separate variants, which is what the design file carries and what the token layer deliberately does not | [ADR-0006 §The token layer](docs/adr/0006-warm-editorial-direction.md) |

## Content

| Term | Means | Not | Fixed by |
| --- | --- | --- | --- |
| **message module** | `src/content/pt.ts` or `en.ts` — a plain typed object of strings. There is **no i18n runtime** in the stack | *translation file*, *locale bundle*, *i18next resource*. `i18next` is not a dependency | [i18n §8.1](docs/research/i18n-and-locale-routing.md) |
| **canonical locale** | **pt-BR**. `export type Messages = typeof pt`, and `en satisfies Messages`, so a missing English key is a compile error | ***default locale*** — ADR-0001 forbids privileging a locale in the URL, and this is a type-system role, not a routing one | [i18n §8.1](docs/research/i18n-and-locale-routing.md) |
| **segment** | A message that needs an inline link: `string \| { text, href }`, in an array. There is **no emphasis kind**, and **JSX-valued messages are forbidden** | a rich-text node, a `<Trans>` component. ADR-0006's accent italics deliberately did *not* become an emphasis kind | [i18n §8.1](docs/research/i18n-and-locale-routing.md), [ADR-0006 §Consequences](docs/adr/0006-warm-editorial-direction.md) |
| **emphasis run** | The clause of a sentence set in accent italic, authored as a **second plain string** that must be a literal substring of the first. Two exist: one in the Summary lede, one in the Contact statement | a markup segment. **It fails open** — a run that does not match renders the sentence plain, with no error — which is why the substring relationship is asserted in a test | [ADR-0006 §Consequences](docs/adr/0006-warm-editorial-direction.md) |
| **chrome** | Page furniture belonging to no single section: the hero eyebrow's three items and the footer's three. `place` is deliberately **one string with two call sites** rather than two that agree today | *layout copy*, *boilerplate* | [ADR-0006](docs/adr/0006-warm-editorial-direction.md), `src/content/pt.ts` |
| **facts** | `src/content/facts.ts` — the hard numbers and locale-neutral proper nouns, **keyed, not positional**, so a `400+` typo cannot diverge between locales. Also holds `year` (written, never computed) and `roleDecades` | duplicated per locale, or indexed by position | [i18n §8.1](docs/research/i18n-and-locale-routing.md), [site copy §2](docs/site-copy.md) |
| **(voice)** | A copy line marked as interpretive rather than traced to the résumé — safe to overwrite without checking a source | filler, or placeholder text | [site copy](docs/site-copy.md) |
| **`SITE_ORIGIN`** | The canonical origin, written **once**, currently the `www` host. Retires a live defect where the site served from two origins with no `rel="canonical"` | hardcoded per tag, as the old site did. Note the design file's absolute links point at the **pre-cutover** Vercel host and are not authoritative | [head and metadata §2](docs/research/head-and-metadata.md), [ADR-0006 §Context](docs/adr/0006-warm-editorial-direction.md) |

## Process

| Term | Means | Fixed by |
| --- | --- | --- |
| **carry-over** | The seven paths that must exist on the rebuild branch. Built by **inverting a deletion inventory**, which is why it twice missed a file that was never in the tree. Omitting `docs/` is unrecoverable | [cutover §1](docs/migration-cutover.md) |
| **the road not taken** | A rejected alternative kept in the document on purpose, so reversal stays cheap and the reasoning stays auditable. It is **not** stale text to clean up — which is also why a superseded ADR is kept unedited | [i18n §4](docs/research/i18n-and-locale-routing.md), [ADR-0005](docs/adr/0005-visual-direction.md) |
| **trigger to reopen** | A stated condition under which a closed decision must be revisited — e.g. type-aware lint rules if the async surface grows, or ADR-0006's three accepted contrast findings if an accessibility audit runs | [ADR-0002](docs/adr/0002-typescript-and-biome-baseline.md), [ADR-0006 §Colour](docs/adr/0006-warm-editorial-direction.md) |
| **accepted rather than fixed** | A defect measured, put to the author, and knowingly shipped — recorded so nobody later "discovers" it and assumes an oversight. ADR-0006 has three, all contrast | [ADR-0006 §Colour](docs/adr/0006-warm-editorial-direction.md) |
| **blast radius** | The test for whether a decision earns an ADR number: does reversing it invalidate **other** documents? Replaced an earlier "contract-shaped vs ADR-shaped" test, which selected almost everything once applied deliberately | [Assemble the deliverable](https://github.com/viniciusoliveiras/portfolio/issues/22) |

---

## Terms that are now wrong

**Retired by ADR-0006:** **the rail** and **rail label** (replaced by *the mark*), **`rule-strong`** (one line value now), **Source Serif 4** (replaced by Instrument Serif and Hanken Grotesk), and **the red accent** `#B3261E` / `#F0736A` (replaced by verde). "Display figures set **above** the prose" is also wrong — they sit beside it. So is the `TRABALHOS` layout constraint: the 128px rail it served no longer exists, and the short form is now a separately authored bar anchor rather than a compromise.

**Retired earlier by ADR-0001, and still wrong:** **"Estudante de TI"** (the positioning is Tech Lead), the **contribution calendar**, the **tech/tool icon wall**, the **typewriter hero**, the **project cards**, the **avatar** (no face appears anywhere), and **`/home`, `/about`, `/projects`, `/resume`** as routes — all four replaced by `/pt` and `/en`.
