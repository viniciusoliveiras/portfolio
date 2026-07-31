# CONTEXT

Glossary for this repository, as [`docs/agents/domain.md`](docs/agents/domain.md) specifies: one `CONTEXT.md` at the root, alongside `docs/adr/`.

**It defines terms and points at the document that fixed each one. It never restates a decision** — the decision lives in exactly one place, and this file is an index into that, not a copy of it.

**It describes the site in `src/` today.** ~~`src/` is still the old Next.js + Chakra site, which uses none of this vocabulary.~~ **Corrected 2026-07-31:** the spec was implemented and cut over, so the code and this glossary now speak the same language — every term below names something that exists. See [`README.md`](README.md) for what state this repo is in.

## Why this file exists

Every term below has a plausible wrong synonym, and two pairs are actively dangerous: **sheet / drawer** and **rail / bar**. The corpus distinguishes them deliberately, and conflating either one produces the wrong component. If your output names one of these concepts, use the term as it is defined here.

---

## The page

| Term | Means | Not | Fixed by |
| --- | --- | --- | --- |
| **the rail** | The sticky marginalia column at `lg`+, carrying a mono label naming the section the reader is **currently in**. Six sections have one. Collapses above the content below `lg` | *sidebar*, *nav*, *table of contents* — it is not navigation, it does not list destinations, and it is not clickable | [ADR-0005 §Layout](docs/adr/0005-visual-direction.md), [section layouts §3](docs/section-layouts.md) |
| **the bar** | The top bar carrying **four** anchor links — what is worth jumping *to*. Below `md` its links move into the sheet | *header*, *navbar* — and above all not *the rail*. Six rail labels vs four bar anchors is correct, not an inconsistency | [ADR-0005 §Layout](docs/adr/0005-visual-direction.md), [section layouts §3](docs/section-layouts.md) |
| **the sheet** | The mobile-only full-bleed overlay holding the bar's anchors, built on the native `<dialog>` opened with `showModal()`, holding **zero** React state | ***drawer*** — the word implies the side-slide that was explicitly rejected; also not *modal*, *dialog component*, or *menu*. There is no dependency behind it | [mobile sheet primitive](docs/research/mobile-sheet-primitive.md) |
| **display figures** | A work entry's metrics set large **above** its prose, so a skimmer reads them first. Numbers never appear inside a sentence | *metrics*, *stats*, *KPIs*. The placement is the decision, not the styling | [ADR-0005 §Metrics](docs/adr/0005-visual-direction.md) |
| **rail label** | The mono, tracked-caps string in the rail. Measured to fit one line at 128px — `TRABALHOS` is the short pt-BR form as a **layout constraint**, not a copy choice | *eyebrow* (though it plays that role), *section title* | [section layouts §3](docs/section-layouts.md) |

## Colour and type

| Term | Means | Not | Fixed by |
| --- | --- | --- | --- |
| **paper** | The page background. `#FAF9F7` light, `#1A1918` dark | *background*, *bg*, *surface*, *white* | [ADR-0005 §Colour](docs/adr/0005-visual-direction.md) |
| **ink** | Prose, headings and figures. `#1A1A1A` light, `#E8E6E1` dark | *foreground*, *text*, *black* | [ADR-0005 §Colour](docs/adr/0005-visual-direction.md) |
| **muted** | Mono labels, dates, captions. **AAA on purpose**, because it carries 12px text that is load-bearing content | *secondary*, *subtle*, *grey* — and not "decorative", which is what its contrast ratio would otherwise imply | [ADR-0005 §Colour](docs/adr/0005-visual-direction.md) |
| **rule** / **rule-strong** | Hairline editorial dividers / boundaries of an **interactive** surface. The distinction is a WCAG obligation, not a shade preference | *border*, *divider* used interchangeably — picking the wrong one is an accessibility defect | [ADR-0005 §Colour](docs/adr/0005-visual-direction.md) |
| **accent** | The single accent, `#B3261E` light / `#F0736A` dark. **Neither value survives the other mode's paper** | *primary*, *brand*. There is exactly one accent; the old cyan and yellow are dead | [ADR-0005 §Colour](docs/adr/0005-visual-direction.md) |
| **on-accent** | Text on an accent fill — and it **flips between modes**: white on light, near-black on dark | a fixed value. White on the dark accent fails contrast. Use the `accent-surface` utility, which binds both together | [ADR-0005 §Colour](docs/adr/0005-visual-direction.md), [token layer §2](docs/research/tailwind-token-layer.md) |

## Content

| Term | Means | Not | Fixed by |
| --- | --- | --- | --- |
| **message module** | `src/content/pt.ts` or `en.ts` — a plain typed object of strings. There is **no i18n runtime** in the stack | *translation file*, *locale bundle*, *i18next resource*. `i18next` is not a dependency | [i18n §8.1](docs/research/i18n-and-locale-routing.md) |
| **canonical locale** | **pt-BR**. `export type Messages = typeof pt`, and `en satisfies Messages`, so a missing English key is a compile error | ***default locale*** — ADR-0001 forbids privileging a locale in the URL, and this is a type-system role, not a routing one | [i18n §8.1](docs/research/i18n-and-locale-routing.md) |
| **segment** | A message that needs an inline link: `string \| { text, href }`, in an array. There is no emphasis kind, and **JSX-valued messages are forbidden** | a rich-text node, a `<Trans>` component | [i18n §8.1](docs/research/i18n-and-locale-routing.md) |
| **facts** | `src/content/facts.ts` — the hard numbers, locale-neutral and **keyed, not positional**, so a `400+` typo cannot diverge between locales | duplicated per locale, or indexed by position | [i18n §8.1](docs/research/i18n-and-locale-routing.md), [site copy §2](docs/site-copy.md) |
| **(voice)** | A copy line marked as interpretive rather than traced to the résumé — safe to overwrite without checking a source | filler, or placeholder text | [site copy](docs/site-copy.md) |
| **`SITE_ORIGIN`** | The canonical origin, written **once**. Retires a live defect where the site served from two origins with no `rel="canonical"` | hardcoded per tag, as the old site did | [head and metadata §2](docs/research/head-and-metadata.md) |

## Process

| Term | Means | Fixed by |
| --- | --- | --- |
| **carry-over** | The seven paths that must exist on the rebuild branch. Built by **inverting a deletion inventory**, which is why it twice missed a file that was never in the tree. Omitting `docs/` is unrecoverable | [cutover §1](docs/migration-cutover.md) |
| **the road not taken** | A rejected alternative kept in the document on purpose, so reversal stays cheap and the reasoning stays auditable. It is **not** stale text to clean up | [i18n §4](docs/research/i18n-and-locale-routing.md), and several others |
| **trigger to reopen** | A stated condition under which a closed decision must be revisited — e.g. type-aware lint rules if the async surface grows, or the italic face if italic prose appears | [ADR-0002](docs/adr/0002-typescript-and-biome-baseline.md), [token layer §6](docs/research/tailwind-token-layer.md) |
| **blast radius** | The test for whether a decision earns an ADR number: does reversing it invalidate **other** documents? Replaced an earlier "contract-shaped vs ADR-shaped" test, which selected almost everything once applied deliberately | [Assemble the deliverable](https://github.com/viniciusoliveiras/portfolio/issues/22) |

---

## Terms the old site used that are now wrong

`src/` and the pre-2026 copy use vocabulary the new site abandons. Do not carry these forward: **"Estudante de TI"** (the positioning is Tech Lead), the **contribution calendar**, the **tech/tool icon wall**, the **typewriter hero**, the **project cards**, the **avatar** (no face appears anywhere), and **`/home`, `/about`, `/projects`, `/resume`** as routes — all four cease to exist, replaced by `/pt` and `/en`.
