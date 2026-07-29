# Section layouts: the seven sections within the fixed design system

Resolves [Prototype the seven sections within the fixed design system](https://github.com/viniciusoliveiras/portfolio/issues/17). Decided 2026-07-28.

The prototype these decisions were made against is a self-contained page with the real typefaces, the measured palette and the canonical pt-BR copy: **https://claude.ai/code/artifact/d85c5e7f-d4bf-451c-b4ea-9880e597f5d0**. It is private to the repo owner, so **this document is written to stand alone** — nothing below depends on being able to open it.

Everything upstream stayed fixed: the editorial lineage, the palette, Source Serif 4 with JetBrains Mono across the seven-role scale, the centred 65ch measure, the sticky marginalia rail at `lg`+, the 56px four-anchor bar with a sheet below `md`, spacious density, and the closed five-entry motion inventory.

---

## 1. Decisions

| Question | Decision |
| --- | --- |
| Experience left edge | **Rules only.** No vertical timeline border. |
| Work entry separation | **Ruled**, at a different span from the section rules. |
| BPO figure slot | **Stack lockup** in mono, and the entry's trailing stack line is suppressed. |
| Skills grouping | **Definition list**, mono labels in one aligned column, serif values. |
| Avatar | **None, anywhere.** |
| Hero | Four elements: mono role-and-place line, name, lede, two underlined accent links. |
| Summary | One `lede` paragraph, no further structure. |
| Education | Lighter than Experience: three items, no rules between them. |
| Contact | Closing `lede` statement **plus** a labelled link list. |

### Why the timeline border went

ADR-0001 carried `ResumeItem`'s left-border timeline forward as "the one structural idea", but it does not survive contact with the rail:

- The brief's separator idiom is **rules instead of cards**, meaning *horizontal* rules. A left border is a vertical one, and it would be the only vertical line on the page besides the rail's own column.
- At `lg`+ it sits 2.5rem inboard of the rail, opening a narrow dead channel between the label and the text.
- **Below `lg` the rail collapses above the content**, so the border becomes the sole left-edge element. The device would therefore mean one thing at wide widths and another thing at narrow ones.

The carry-forward was an observation about the old site, where the timeline existed because `/resume` had nothing else structuring it. Here the mono date lines already sequence the roles.

### Why the BPO entry fills its slot

[The copy decision](site-copy.md) established that the two Selected-work entries are asymmetric on purpose — the ERP argues by scale, the BPO by judgement — and refused to invent a BPO figure.

Seeing both rendered showed the cost of leaving the slot empty: **the skim layer carried scale but not judgement.** ADR-0001's thesis is that the metrics are the argument *because there is no public code*, but the TanStack Start decision is the only evidence on the page about how its author thinks, and in prose alone a skimming reader never reaches it.

So the slot takes the chosen architecture, set in mono, in the exact position where the other entry sets its figures:

```
TRABALHOS      Plataforma de BPO financeiro

               TanStack Start
               TanStack Query
               ARQUITETURA ESCOLHIDA
```

Mono is the brief's data face and a chosen stack is data, so this needs no exception. **The entry's trailing stack line is suppressed when the lockup is present** — otherwise the page says *TanStack Start · TanStack Query* twice, eight lines apart. See §5.

### Why there is no avatar

The site currently ships **both** a GitHub photo on `/home` and the `images/avatar.svg` illustration on `/about`.

- The brief's premise is that **"there is no imagery for a visual direction to arrange. This is therefore a typographic problem."** A face is the one element that outranks type for attention, so adding one changes the hero's thesis from scope to appearance.
- The lineage agrees: Stripe Press pages carry no author portrait, and a print résumé carries no photo.
- The GitHub photo would reintroduce a request to `avatars.githubusercontent.com`, **breaking the zero-third-party-requests property** the self-hosted fonts just won — unless vendored, which then drags in the hashing and caching questions the fonts already answered separately.
- `avatar.svg` belongs to the register being replaced.
- Practically: **the LinkedIn link already carries a photo.** A recruiter who wants a face is one click from one.

**Consequence: `public/images/avatar.svg` deletes**, and the avatar question closes entirely rather than passing further downstream.

---

## 2. Per-section layout

### Hero — no rail label

It is the top of the page, so it takes no marginalia label and its rail column is empty.

Four text elements, in order: a **mono role-and-place line** (`Tech Lead · Desenvolvedor Full-Stack · Rio de Janeiro`), the **name** at the `hero` role, the **positioning sentence** at `lede`, then **two underlined accent links** — contact and the résumé PDF.

**Not filled buttons**, per the brief: fills are a UI convention that fights the editorial frame. The underline is the affordance, at `text-decoration-color` 40% accent rising to full on hover inside the 150ms transition.

Location rides in the role line rather than sitting under the links. A separate line below the actions is the classic "tiny tagline below the CTAs" pattern, and it also pushed the hero to five elements.

### Summary — `#summary`

One `lede` paragraph. **No structure beyond that**, deliberately: it is three sentences, it is the highest-value block on the page, and any device added to it competes with the figures two sections down.

### Experience — `#experience`

A `body-sm` group note first, carrying the two inline links (*Devex Soluções*, *Inovasensor*), then four roles.

Each role is a mono date line, then a 1.125rem/600 title, then `·`-marked bullets. **Rules between roles**, 2.25rem of padding above each. Numbers stay **inline in the prose** here — Experience is a chronological record read as sentences, and the display-figure treatment belongs to the showcase.

**Ancar Ivanhoe is a minor row**: date line plus a 1rem/400 muted title, no bullets. The weight drop does the work the copy decision asked for — present for chronological completeness, given no prose.

### Selected work — `#work`

Two entries. Each: `entry`-role title, the figure block, prose, then a mono stack line.

The ERP's figure block is three lockups — figure at 2.75rem/600 with `tabular-nums`, label beneath in mono. Labels are capped at `9ch` so they wrap under their own number instead of pushing the row wide. The blocks align on `flex-end` so the numbers share a baseline despite one-, two- and four-character values.

**Entries separate with a rule** spanning the measure only, where the section rules span the full rail-plus-measure grid. Two levels of horizontal rule at two different spans stay legible as a hierarchy; the same span at both levels would not.

### Skills — `#skills`

Eight rows: the résumé's seven groupings plus `Aprendendo` / `Learning` carrying Go.

A definition list — **mono label in a 10.5rem column, serif values** — collapsing to stacked label-over-values below `40rem`. The aligned label column is the idiom the figure labels and date lines already use.

**On the brief's ambiguity:** its typography section lists *"the skills groups"* among the mono items. That is read here as the **labels**, not the values. The alternative reading turns the section into a dense grey block in the middle of a serif page.

**Clustering was built and rejected.** Grouping the eight rows into three chunks answers the "flat list is lazy" critique, but the super-grouping is an editorial reading of how the skills relate rather than the résumé's own, and [the copy decision](site-copy.md) held that every claim traces to the résumé. Structure is a claim too. Recorded as available if the grouping ever turns out to be how the author actually thinks about it.

### Education & certifications — `#education`

Lighter than Experience: three items, **no rules between them**, 1.75rem apart. The degree gets a mono `2020 - 2022 · concluído` line, a 600-weight title, then a muted institution line. Certifications and languages are a mono label over a serif run.

It is the lowest-value section on the page and its treatment should say so.

### Contact — `#contact`

A closing `lede` statement, then the labelled link list — mono key in a 6.5rem column, accent underlined value. **Statement plus list, not a bare list**: the section is the page's last word, and four naked links would end the document mid-sentence.

---

## 3. Rail labels

**Measured, not estimated.** JetBrains Mono is monospaced at a 600/1000 em advance; the `label` role is 12px with `0.08em` tracking, so each character occupies 8.16px against a 128px rail.

| | pt-BR | ch | width | en | ch | width |
| --- | --- | --- | --- | --- | --- | --- |
| Hero | *(none)* | | | *(none)* | | |
| Summary | `RESUMO` | 6 | 49px | `SUMMARY` | 7 | 57px |
| Experience | `EXPERIÊNCIA` | 11 | 90px | `EXPERIENCE` | 10 | 82px |
| Selected work | `TRABALHOS` | 9 | 73px | `SELECTED WORK` | 13 | **106px** |
| Skills | `COMPETÊNCIAS` | 12 | 98px | `SKILLS` | 6 | 49px |
| Education | `FORMAÇÃO` | 8 | 65px | `EDUCATION` | 9 | 73px |
| Contact | `CONTATO` | 7 | 57px | `CONTACT` | 7 | 57px |

**All twelve fit on one line.** The worst case is `SELECTED WORK` at 106px, leaving 22px of headroom. `TRABALHOS` is the short pt-BR form on purpose — *TRABALHOS SELECIONADOS* is 22 characters and would wrap to three lines.

### Rail labels are not the bar anchors

The bar carries **four** anchors — Experiência, Trabalhos, Competências, Contato — while **six** sections carry rail labels. `RESUMO` and `FORMAÇÃO` therefore have a label but no anchor, and that is correct rather than an oversight: the rail names *where the reader is*, the bar lists *what is worth jumping to*. The brief already ruled the hero needs no anchor (it is the top), Summary sits directly beneath it, and Education is a low-value jump target.

This is also why **scroll-spy is not needed** — the rail is per-section marginalia, not a persistent list of all seven names, so the four bar anchors stay plain links.

---

## 4. Order and rule placement

Order is ADR-0001's, unchanged: **hero → summary → experience → selected work → skills → education → contact**.

**At `lg`+**, the grid is `8rem` rail plus `2.5rem` gutter plus the measure. Section rules span **the full grid**, per the brief's "rules dividing the seven sections stay inside the rail-plus-measure grid" — a rule stopping at the measure would leave the rail label floating outside the structure. Section padding-block is 96px, and the rail label is `position: sticky` at `bar + 1.75rem`, its containing block the section, so it travels with the section and is released at the section's end.

**Below `lg`**, the rail collapses: the label sits static above the section's content in the same style, section padding-block drops to 64px, and rules span the measure because the measure is the whole shell.

Within the measure: 32px between blocks, 12px from a label to its content.

---

## 5. What building it found that reasoning had not

1. **The hero carried a fifth text element in the worst position.** `Rio de Janeiro, Brasil` sat on its own line below the two action links — the "tiny tagline below the CTAs" pattern. Folded into the role line.
2. **The BPO stack lockup duplicated the entry's trailing stack line.** Both entries end with a mono stack string, so the lockup restated *TanStack Start · TanStack Query* eight lines after saying it. The lockup now suppresses the trailing line, which makes the two options structurally different rather than one being a superset.
3. **The rail labels needed measuring**, and `TRABALHOS SELECIONADOS` would have wrapped to three lines in a 128px rail. The short form is a layout constraint, not a copy preference.
4. **Metric labels needed a width cap.** Un-capped, `clientes corporativos` pushes its lockup wide enough to break the three-figure row onto two lines at the measure. Capped at `9ch` they wrap under their own figure.

---

## 6. One deliberate deviation, recorded

The `design-taste-frontend` skill was used for the craft pass. Two of its rules were adopted — the hero element cap (finding 1) and its scepticism of flat long lists (which produced the clustered variation, built then rejected on §2 grounds).

**Four of its rules were deliberately not followed**, because they contradict decisions already locked upstream:

| Rule | Why not |
| --- | --- |
| Serif "very discouraged as default" | The brief names Source Serif 4 and the lineage is genuinely editorial, which is the skill's own stated override. Neither of its two banned display serifs is in play. |
| Max one eyebrow per three sections | The sticky marginalia rail label *is* an eyebrow by that definition, and it is the brief's core structural device. It also encodes real information — which section the reader is inside — rather than decorating. |
| **"Real images required; pure-text minimalism is incomplete work"** | Directly contradicts the brief's premise that this is a typographic problem with no imagery to arrange. This is the rule that bears on the avatar, and it lost to the brief on the reasoning in §1. |
| Zero em-dashes, "non-negotiable" | The pt-BR copy is human-approved and em-dashes are ordinary Portuguese punctuation. **Date ranges did move to hyphens**, where the rule is typographically right anyway. |

Recorded so a later reviewer reading the skill does not mistake these for oversights.

---

## 7. What this hands to other tickets

- **[Decide the migration strategy and cutover order](https://github.com/viniciusoliveiras/portfolio/issues/19)** — one more deletion: `public/images/avatar.svg`. With `public/icons/` and `manifest.json` already going, `public/` reduces to the three font files, `og.png`, `favicon.svg`, `resume-en.pdf` and `robots.txt`.
- **The asset-strategy fog patch** — **the avatar question is closed** (none, anywhere), so the patch retains only the favicon's design and where the résumé PDF is served from.
- **The italic-face question** — **the answer is now no.** Across all seven layouts nothing is italic: no pull quote, no figure caption, no display italic anywhere. Combined with the message shape having no emphasis segment kind and the copy never asking for one, **all three independent reasons now point the same way**, and this was the last ticket that could have created a use. The italic `woff2` and its `@font-face` block delete, taking a measured 80 KB with them.
- **[The Tailwind token layer](https://github.com/viniciusoliveiras/portfolio/issues/16)** — no new tokens and no custom variants. Two additions to its inventory, both stock: a width cap on metric labels (`max-w-[9ch]`) and `items-end` on the figure row so figures share a baseline across differing digit counts.
