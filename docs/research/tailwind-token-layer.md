# Tailwind v4 token layer

Spec asset for [Specify the Tailwind v4 token layer from the design brief](https://github.com/viniciusoliveiras/portfolio/issues/16), a ticket on [Map: migrate the portfolio to TanStack Start + Tailwind, with a redesign](https://github.com/viniciusoliveiras/portfolio/issues/1).

**Checked 2026-07-27** against Tailwind's published docs, the shipped `tailwindcss@4.3.3` `theme.css` and `preflight.css`, MDN, the fontTools subsetter docs, and the upstream font binaries. Where a claim could be tested it was **compiled or measured locally with Tailwind 4.3.3 and fontTools 4.62.1** rather than inferred; those results are marked **measured**.

The [design brief](../adr/0005-visual-direction.md) fixed the values. This binds them.

## Verdict up front

1. **Dark mode is a plain `:root` override outside `@theme`, and `@theme inline` would silently break it.** Measured: with `inline`, `.bg-paper` compiles to a literal `#FAF9F7` and the dark override does nothing at all — no error, no warning.
2. **Do not set `html { font-size: 18px }`.** The brief's "base is 18px" is a *body text size*, not a root size. Setting it on `html` rescales Tailwind's entire rem-based spacing scale by 12.5%, so the brief's 96 / 64 / 32 / 12px spacing stops landing on the scale, and it overrides the reader's own browser setting.
3. **The `opsz` work is mostly already done by the browser.** `font-optical-sizing: auto` is the CSS initial value and drives `opsz` from `font-size`, which matches the brief in five of its six serif roles. Only two roles need an explicit override.
4. **The font payload is far heavier than "three woff2 files" suggests, and most of it is avoidable.** Measured: the naive subset is **496 KB**. Restricting to `latin`, trimming layout features and pinning the weight axis to the 400–600 the design actually uses brings it to 173 KB — and **dropping the italic face brings it to 92.8 KB**, which is also the preload path, since both surviving faces are preloaded. Down from 293 KB preloaded. Details and exact commands in §6.

---

## 1. How dark mode works — and the trap next to it

Two facts from the [theme docs](https://tailwindcss.com/docs/theme):

> Theme variables are required to be defined top-level and not nested under other selectors or media queries.

and, on `@theme inline`:

> Using the `inline` option, the utility class will use the theme variable _value_ instead of referencing the actual theme variable.

So `@theme` cannot itself be mode-aware. The working shape is: declare the light values in `@theme`, then override the **plain custom properties** in an ordinary `:root` block inside the media query. Utilities compile to `var(--color-paper)`, so they follow.

**Measured with 4.3.3.** Given `@theme { --color-paper: #FAF9F7 }` plus a `@media (prefers-color-scheme: dark) { :root { --color-paper: #1A1918 } }`, the output is:

```css
@layer theme, base, components, utilities;
@layer theme {
  :root, :host { --color-paper: #FAF9F7; }
}
@layer utilities {
  .bg-paper { background-color: var(--color-paper); }
}
@media (prefers-color-scheme: dark) {
  :root { --color-paper: #1A1918; }      /* unlayered — beats @layer theme unconditionally */
}
```

The override lands **unlayered**, and unlayered styles win over any `@layer`, so this is robust against source order and against Tailwind reordering its own layers.

**The trap, measured.** Change `@theme` to `@theme inline` and the same input compiles to:

```css
.bg-paper { background-color: #FAF9F7; }   /* the dark override is now unreachable */
```

No error. The site simply never goes dark. **Never use `@theme inline` for the colour tokens.**

**A second measured behaviour worth knowing:** unused theme variables are pruned. A `--color-neverused` declared in `@theme` but referenced nowhere did not appear in the output at all. Usage counts references from your own hand-written CSS, not just from generated utilities — `--color-rule` survived on the strength of a `border-top: 1px solid var(--color-rule)` in a plain rule. This is why §2 keeps every token in `@theme` rather than splitting some out: anything genuinely unreferenced disappears on its own, and `@theme static` exists if you ever want them all emitted regardless.

## 2. Which tokens become utilities

**All eight, in `--color-*`.** The ticket floated keeping `rule-strong` and `on-accent` as raw properties; that trades one lookup place for two and buys nothing, because Tailwind's `--color-*` namespace generates `bg-`, `text-`, `border-`, `outline-`, `decoration-`, `divide-` and the rest from a single declaration, and pruning already removes what goes unused.

Two adjustments to the brief's list:

- **`ring` is dropped as a token.** The brief's own rule 2 — "each accent is valid only in its own mode — which is also why `ring` needs no separate token" — is right, and `ring` carries the identical value to `accent` in both modes. A duplicated constant is a constant that can drift. Focus uses `outline-accent`.
- **`--color-*: initial` first**, wiping Tailwind's 22 default palettes. **Measured**: `text-red-500` and `text-xs` then generate nothing, while `bg-transparent` and `border-current` keep working (they are keyword utilities, not palette entries). On a two-mode system this is the guardrail that matters — an off-palette colour is exactly the thing that looks fine in light mode and unreadable in dark. The same argument applies to `--text-*: initial`, which forces every size through one of the seven named roles.

### Making the `on-accent` flip hard to get wrong

The brief calls this "the easiest thing in the palette to get wrong": white on the light accent, near-black on the dark one, and white on `#F0736A` is 2.85:1 and fails. Leaving `bg-accent` and `text-on-accent` as two independent utilities means any single-utility use is a bug waiting to happen.

**Bind them into one utility so the pair cannot be separated** (measured, compiles clean):

```css
@utility accent-surface {
  background-color: var(--color-accent);
  color: var(--color-on-accent);
}
```

`bg-accent` still exists for non-text fills. But every accent fill *carrying text* uses `accent-surface`, and the flip is then structural rather than remembered. Note the brief already minimises the blast radius: the hero's two actions are underlined text links, not filled buttons, so `accent-surface` should have very few callers — if it grows, that is a signal the editorial frame is drifting toward UI conventions.

## 3. The type scale

`--text-*` carries **four** of the five properties per role. From the [font-size docs](https://tailwindcss.com/docs/font-size):

> You can also provide default `line-height`, `letter-spacing`, and `font-weight` values for a font size

**Measured** output for one role, confirming all four land in a single utility and stay overridable:

```css
.text-label {
  font-size: var(--text-label);
  line-height: var(--tw-leading, var(--text-label--line-height));
  letter-spacing: var(--tw-tracking, var(--text-label--letter-spacing));
  font-weight: var(--tw-font-weight, var(--text-label--font-weight));
}
```

The `--tw-*` fallback chain means a later `leading-*`, `tracking-*` or `font-*` utility still wins — the role sets defaults, not locks.

What `--text-*` **cannot** carry is **font-family** and **`opsz`**. Those two ride separately.

### `opsz`: the browser already does most of it

[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing) on `font-optical-sizing`:

> **Initial value:** `auto` … Optical sizing is enabled by default for fonts that have an optical size variation axis.

Baseline widely available since March 2020. So `opsz` tracks `font-size` with no CSS at all. Lining that up against the brief's table:

| Role | Size | Brief's `opsz` | `auto` gives | Needs an override? |
| --- | --- | --- | --- | --- |
| `body` | 18 | 18 | 18 | no |
| `lede` | 22 | 22 | 22 | no |
| `entry` | 24 | 24 | 24 | no |
| `figure` | 44 | 44 | 44 | no |
| `body-sm` | 15 | **16** | 15 | **yes** |
| `hero` | clamp 40–64 | **60** | 40–64 | **yes** |
| `label` | 12 | — | — | n/a — JetBrains Mono has no `opsz` axis (**verified** in the binary: `wght` only) |

Two overrides, expressed as one functional utility (measured, compiles to `.optical-16` and `.optical-60`):

```css
@utility optical-* {
  font-variation-settings: 'opsz' --value(number);
}
```

**Two cautions from MDN.** `font-variation-settings` is **inherited**, and it "will always override those set using the corresponding basic font properties … no matter where they appear in the cascade". So an `opsz` set on the hero leaks into descendants and clobbers their `auto` sizing. In this design neither `optical-16` nor `optical-60` sits on an element with differently-sized serif children, but the reset is `font-variation-settings: normal` if that ever changes. Setting only `opsz` does **not** disturb `wght` — only axes named in the declaration are overridden — so `font-weight` and the `--text-*--font-weight` defaults keep working.

### The 18px base is a text size, not a root size

The brief says "Base is **18px**, not 16px". Implement that as `--text-body: 1.125rem`, and **leave the root font size alone**. Setting `html { font-size: 18px }` costs two things:

- Tailwind's spacing scale is rem-based — `--spacing: 0.25rem`, **verified** in the shipped `tailwindcss@4.3.3/theme.css`. At a 16px root that is 4px, so the brief's spacing lands exactly: 96px = `py-24`, 64px = `py-16`, 32px = `gap-8`, 12px = `mt-3`. At an 18px root the unit becomes 4.5px and 96px is 21.33 units — off the scale entirely.
- A px root font size overrides the reader's own browser font-size preference, which is a real accessibility regression on a page whose smallest text is a load-bearing 12px mono label.

Related: the brief's `min(65ch, 100% - 2rem)` measure resolves `ch` against the *container's* font size, so the measure container must itself be at `text-body`, not inherit a different size.

## 4. Custom variants: none needed

Answering question 5 directly: **no `@custom-variant`, and no `@variant` either.**

`@custom-variant` exists to *replace* the `dark:` variant with a class or attribute strategy. There is no toggle here, colour is handled entirely by the `:root` override, and `dark:` is never written. Everything else the brief asks for is a stock v4 variant — **measured**, all of these compile in 4.3.3:

| Need | Variant | Compiles to |
| --- | --- | --- |
| Reduced motion | `motion-reduce:` | `@media (prefers-reduced-motion: reduce)` |
| Focus ring | `focus-visible:` | `:focus-visible` |
| Rail at `lg`+ | `lg:` | `@media (width >= 64rem)` |

Breakpoints need no configuration either: `sm 40rem / md 48rem / lg 64rem / xl 80rem / 2xl 96rem` are the shipped defaults, **verified** in `theme.css`, and identical to what the brief specifies.

## 5. Base layer: `tabular-nums`, `scroll-margin-top`, and the rest

Question 6 asked where these live. Answer: **`@layer base` for anything that is a property of the document, utilities for anything a component chooses.**

- **`scroll-behavior: smooth`** is a document property → base, on `html`, with the reduced-motion counterpart beside it. (The `scroll-smooth` / `motion-reduce:scroll-auto` utilities both exist, but putting them on the `<html>` element in the shell scatters document behaviour into JSX.)
- **`scroll-margin-top`** is a property of *every* anchored section, so base, on `section[id]` — 56px bar + 1rem = `4.5rem`.
- **`font-variant-numeric: tabular-nums`** is per-role, so it belongs with the `figure` role. **But see below: in Source Serif 4 it is a no-op.**
- **Focus ring** in base on `:focus-visible`, so it is never forgotten.

Preflight already sets `font-family` on `html` from `--default-font-family`, which defaults to `--theme(--font-sans, initial)` (**verified** in `preflight.css` / `theme.css`). Since the prose face here is the serif, base overrides it directly.

### `tabular-nums` is already true — verified in the binary

The brief mandates `font-variant-numeric: tabular-nums` on `--text-figure` because "the metrics *are* the argument". Inspecting `SourceSerif4Variable-Roman.ttf` directly:

```
default glyphs for 0–9 : zero … nine      advance widths: 500 ×10   ← uniform, i.e. tabular
.lf  (proportional)     : zero.lf …        advance widths: 502, 426, 508, 503, …
.tosf (oldstyle)        : zero.tosf …      advance widths: 500 ×10
```

Source Serif 4's **default figures are already tabular lining**. The `tnum` feature only maps `.lf → default`, i.e. it exists to *undo* `pnum`. So the declaration changes nothing. Keep it anyway — it documents intent and costs nothing — but do not treat it as load-bearing, and do not go hunting when a subsetter drops the `tnum` feature.

**The general trap is still real and worth recording**, because it would bite a different font: fontTools' subsetter documents its default `--layout-features` as `calt, ccmp, clig, curs, dnom, frac, kern, liga, locl, mark, mkmk, numr, rclt, rlig, rvrn` — **`tnum`, `lnum`, `onum` and `pnum` are not in it**. In a font whose default figures are proportional, subsetting would silently break `tabular-nums`. Here it does not, and that is verified rather than hoped: the subsetted file's digits are still uniformly 500 units.

## 6. The ~~three~~ **two** `woff2` files

> **Corrected 2026-07-29** by [Assemble the deliverable](https://github.com/viniciusoliveiras/portfolio/issues/22). **The italic face is not built and not shipped.** [The section layouts](../section-layouts.md) §7 — the last decision that could have created a use for it — found nothing italic across all seven sections, and it was the third of three independent reasons pointing the same way (the [message shape](i18n-and-locale-routing.md) §8.1 has no emphasis segment kind; the [copy](../site-copy.md) never asks for one).
>
> Everything below is corrected in place: the italic row, the instancer command, the subset loop, the preload note and the `@font-face` block in §7. **The measured table is left exactly as measured** — those are real fontTools figures from 2026-07-27 — with the shipping row annotated instead.
>
> **The payload is 92.8 KB, not 173.0 KB**, and the total now *equals* the preload path, because both surviving faces are preloaded. The 173.0 KB figure is superseded wherever it appears.

### Sources

| Face | Upstream | Version | Axes (**verified in the binary**) |
| --- | --- | --- | --- |
| Source Serif 4 Roman | [`adobe-fonts/source-serif`](https://github.com/adobe-fonts/source-serif) `VAR/SourceSerif4Variable-Roman.ttf` | 4.005R (2023-01-20) | `wght 200–900`, `opsz 8–60` (default 20) |
| JetBrains Mono | [`JetBrains/JetBrainsMono`](https://github.com/JetBrains/JetBrainsMono) `fonts/variable/JetBrainsMono[wght].ttf` | v2.304 (2023-01-14) | `wght 100–800`, **no `opsz`** |

*Source Serif 4 Italic (`VAR/SourceSerif4Variable-Italic.ttf`, 4.005R, `wght 200–900`, `opsz 8–60`) was measured and then dropped — see the correction above.*

Both match the brief's axis table. Note the brief's "Source Serif 4 v14" is *Google's* asset version, not upstream's — the upstream release is 4.005R, and vendoring should come from upstream, not from `gstatic`, because Google serves five-plus files per family split by script.

### Subsetting: `latin` is enough for pt-BR

The brief specifies `latin` + `latin-ext`. **`latin-ext` is not needed.** Every Portuguese diacritic — `à á â ã ç é ê í ó ô õ ú ü` — sits in `U+00C0–U+00FF`, inside the `latin` range. `latin-ext` covers Central and Eastern European letterforms this site has no copy for. Names in scope (Vinícius, Devex Soluções, Inovasensor, UniCarioca) are all covered by `latin`.

The `latin` range, taken from the Google Fonts CSS2 API response for both families (identical, checked 2026-07-27):

```
U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193,
U+2212, U+2215, U+FEFF, U+FFFD
```

### Measured cost of each choice

All figures produced locally with fontTools 4.62.1, woff2 output:

| Build | Roman | Italic | Mono | Total | Preload path |
| --- | --- | --- | --- | --- | --- |
| `latin`+`latin-ext`, all layout features | 237.9 | 203.2 | 54.7 | **495.8 KB** | 292.6 KB |
| `latin`+`latin-ext`, default features | 165.6 | 180.8 | 46.4 | 392.8 KB | 212.0 KB |
| `latin` only, default features | 114.8 | 125.9 | 39.0 | 279.7 KB | 153.8 KB |
| `latin`, lean features, no hinting | 110.5 | 121.8 | 37.9 | 270.2 KB | 148.4 KB |
| **+ weight axis pinned to what the design uses** | **73.4** | **80.2** | **19.4** | **173.0 KB** | **92.8 KB** |
| **↳ as shipped, italic dropped** (2026-07-29) | **73.4** | — | **19.4** | **92.8 KB** | **92.8 KB** |

The last row is what ships. The design uses exactly three weights — serif 400, serif 600, mono 500 — so the roman keeps a `wght 400–600` variable range (`opsz` untouched, it is doing real work), and the mono is instanced to a **static** 500.

**Total and preload path are now the same number**, because the only two faces shipped are both preloaded. The "173 KB total, 93 KB preloaded" framing described a build with an italic face that no longer exists, and the distinction it drew has no remaining subject.

**92.8 KB instead of 293 KB matters here specifically**: this is a page whose motion budget bans scroll reveals for delaying content, and preloaded fonts are render-blocking by design.

### The commands, verified end to end

```sh
# 1. pin the weight axis to what the design actually uses
python3 -m fontTools.varLib.instancer SourceSerif4Variable-Roman.ttf  wght=400:600 -o roman.ttf
python3 -m fontTools.varLib.instancer 'JetBrainsMono[wght].ttf'       wght=500     -o mono.ttf

# 2. subset to latin, keep the shaping features, drop TrueType hinting
LATIN='U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'
FEAT='calt,ccmp,clig,kern,liga,locl,mark,mkmk,rclt,rlig,rvrn'

for f in roman mono; do
  pyftsubset "$f.ttf" --output-file="public/fonts/$f.woff2" --flavor=woff2 \
    --unicodes="$LATIN" --layout-features="$FEAT" --no-hinting
done
```

Requires `fonttools` **and** `brotli` — without the latter `--flavor=woff2` fails with `ImportError: No module named brotli`, which is not obvious from the error site.

This is a **one-off vendoring step producing committed binaries**, not part of the app build. It needs no npm dependency and no CI job.

### `@font-face`

Note the mono declares a single `font-weight: 500`, not a range, because it was instanced to a static face — declaring a range there would let the browser synthesise weights that do not exist. `unicode-range` is deliberately omitted: it exists to let the browser skip downloading one file among several split by script, and there is one file per face.

**Preload both faces.** There are only two, and both are used above the fold — so unlike the earlier three-file build, there is no face held back from the preload list.

**Synthesised italics are the accepted consequence.** With no italic face, a browser asked to render `font-style: italic` in Source Serif 4 will slant the roman mechanically. Nothing in the spec asks for one — that is why the face was dropped — but if a future change introduces italic prose, the fix is to restore this face and its `@font-face` block, not to accept the synthesis. Recorded as the trigger to reopen, on [ADR-0002](../adr/0002-typescript-and-biome-baseline.md)'s precedent.

## 7. The complete stylesheet

Paste-ready — **this exact stylesheet was compiled with Tailwind 4.3.3**: no errors, all 24 intended utilities generated, `text-red-500` and `text-xs` correctly absent, and the spacing utilities resolving to 96 / 64 / 32 / 12px as the brief specifies.

One file, `src/styles/global.css`, imported for its side effect from the root route — the [API map](next-to-tanstack-start-api-map.md) established that a bare `import` is like-for-like with the current Next setup and keeps more production features than `?url`.

```css
@import "tailwindcss";

/* ---------------------------------------------------------------- fonts */

@font-face {
  font-family: 'Source Serif 4';
  font-style: normal;
  font-weight: 400 600;
  font-display: swap;
  src: url('/fonts/roman.woff2') format('woff2');
}

@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;            /* static instance — not a range */
  font-display: swap;
  src: url('/fonts/mono.woff2') format('woff2');
}

/* ---------------------------------------------------------------- theme */
/* NOTE: never `@theme inline` here — it inlines values into the utilities
   and the dark override below silently stops working. */

@theme {
  --color-*: initial;
  --text-*: initial;

  /* light is canonical; dark overrides the same custom properties below */
  --color-paper:       #FAF9F7;
  --color-ink:         #1A1A1A;
  --color-muted:       #545454;
  --color-rule:        #E2E0DC;
  --color-rule-strong: #8E8B86;
  --color-accent:      #B3261E;
  --color-on-accent:   #FFFFFF;

  --font-serif: 'Source Serif 4', ui-serif, Georgia, serif;
  --font-mono:  'JetBrains Mono', ui-monospace, monospace;

  --text-label: 0.75rem;                    /* 12 */
  --text-label--line-height: 1.4;
  --text-label--font-weight: 500;
  --text-label--letter-spacing: 0.08em;

  --text-body-sm: 0.9375rem;                /* 15 */
  --text-body-sm--line-height: 1.6;
  --text-body-sm--font-weight: 400;

  --text-body: 1.125rem;                    /* 18 — body size, NOT the root size */
  --text-body--line-height: 1.65;
  --text-body--font-weight: 400;

  --text-lede: 1.375rem;                    /* 22 */
  --text-lede--line-height: 1.55;
  --text-lede--font-weight: 400;

  --text-entry: 1.5rem;                     /* 24 */
  --text-entry--line-height: 1.3;
  --text-entry--font-weight: 600;

  --text-figure: 2.75rem;                   /* 44 */
  --text-figure--line-height: 1;
  --text-figure--font-weight: 600;

  --text-hero: clamp(2.5rem, 6vw, 4rem);
  --text-hero--line-height: 1.05;
  --text-hero--font-weight: 400;
}

/* ------------------------------------------------------- dark overrides */
/* Plain custom properties, unlayered, outside @theme — @theme forbids
   media queries, and unlayered rules beat @layer theme unconditionally. */

@media (prefers-color-scheme: dark) {
  :root {
    --color-paper:       #1A1918;
    --color-ink:         #E8E6E1;
    --color-muted:       #ADA9A0;
    --color-rule:        #33312E;
    --color-rule-strong: #6A6862;
    --color-accent:      #F0736A;
    --color-on-accent:   #1A1918;   /* flips — white here is 2.85:1 and fails */
  }
}

/* ------------------------------------------------------------ utilities */

@utility optical-* {
  font-variation-settings: 'opsz' --value(number);
}

/* accent fill + its correct foreground, bound together so the mode flip
   cannot be applied half-way */
@utility accent-surface {
  background-color: var(--color-accent);
  color: var(--color-on-accent);
}

/* ----------------------------------------------------------------- base */

@layer base {
  html {
    /* no font-size here on purpose — see §3 */
    font-family: var(--font-serif);
    color: var(--color-ink);
    background-color: var(--color-paper);
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
  }

  section[id] {
    scroll-margin-top: 4.5rem;   /* 56px bar + 1rem */
  }

  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  /* The brief's 150ms hover. Base, not a utility, for the same reason as the
     focus ring: ~20 interactive elements must not each remember it.
     Hand-written rather than `@apply transition-colors` on purpose — the stock
     utility's property list includes `outline-color`, which would make any
     future change to the focus outline's colour FADE the focus indicator in.
     The two `var()`s are load-bearing: these theme vars are pruned when
     nothing references them, and this rule is what keeps them in the output. */
  a, button {
    transition-property: color, background-color, text-decoration-color;
    transition-duration: var(--default-transition-duration);          /* 150ms */
    transition-timing-function: var(--default-transition-timing-function);
  }

  /* Locale switch cross-fade, retimed from the UA's 0.25s to match the sheet.
     Targets the GROUP, not old/new: the UA puts `animation-duration` on
     `::view-transition-group(*)` and gives image-pair/old/new
     `animation-duration: inherit`, so one selector retimes the whole tree. */
  ::view-transition-group(*) { animation-duration: 200ms; }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    /* 1ms, not `animation: none` — removing the animations leaves both
       snapshots stacked at full opacity with nothing to end the transition. */
    ::view-transition-group(*) { animation-duration: 1ms; }
  }
}
```

### How the roles are used

| Role | Classes |
| --- | --- |
| `label` | `font-mono text-label uppercase text-muted` |
| `body-sm` | `text-body-sm optical-16 text-muted` |
| `body` | `text-body` (inherits serif and `ink` from base) |
| `lede` | `text-lede` |
| `entry` | `text-entry` |
| `figure` | `text-figure tabular-nums` |
| `hero` | `text-hero optical-60` |

Measure container: `max-w-[min(65ch,100%-2rem)] mx-auto`, at `text-body` so `ch` means what the brief intends. Section rhythm: `py-16 lg:py-24`, `gap-8` between blocks, `mt-3` from a label to its content — all exact on the default 4px spacing unit.

## 8. What this hands to other tickets

- **[Settle the head and metadata content for both locale routes](https://github.com/viniciusoliveiras/portfolio/issues/13)** — inherits the replacement for the dead `#FFD369` `theme-color`: two `<meta name="theme-color" media="(prefers-color-scheme: …)">` tags carrying `#FAF9F7` and `#1A1918`, the two `paper` values. Also owns the two `<link rel="preload" as="font" type="font/woff2" crossorigin>` tags for `roman.woff2` and `mono.woff2` — `crossorigin` is required on font preloads even same-origin, and omitting it makes the browser fetch the file twice.
- **[Prototype the seven sections within the fixed design system](https://github.com/viniciusoliveiras/portfolio/issues/17)** — the role table in §7 is the vocabulary. *(**Corrected 2026-07-29:** the `items-end` this layer accepted from the section layouts — "so figures share a baseline across differing digit counts" — does the opposite when rendered, because the variable is the label's line count rather than the figure's digit count. `items-start` ships. See [the section layouts](../section-layouts.md) §5.)* Its one open input to this layer: **whether any content is italic at all.** Nothing in ADR-0001's seven sections obviously is, and the italic face is the second-largest asset on the page at 80 KB — if the prototypes never reach for it, the third `woff2` file and its `@font-face` block both delete. — *Answered: they never reach for it. The face and its block are deleted, and §6 and §7 above are corrected accordingly. This document did not get that correction until [Assemble the deliverable](https://github.com/viniciusoliveiras/portfolio/issues/22) applied it on 2026-07-29, so between 2026-07-28 and then, §7's paste-ready stylesheet declared an `@font-face` pointing at a file no build step produced.*
- ~~**[Decide how the mobile drawer's modal primitive is supplied](https://github.com/viniciusoliveiras/portfolio/issues/15)** — the drawer's edge uses `rule-strong`, not `rule` (it bounds an interactive surface and needs 3:1), and its 200ms transition needs the `motion-reduce:` variant, which is stock.~~ **Resolved, and the edge premise was wrong.** The drawer is a **full-bleed sheet**, so it has no edge against the page for a 3:1 rule to delimit — and the decision picked a *fade* over a slide partly to stop that edge flickering back into existence for 200ms. `rule-strong` keeps its job on a different edge: **the rule beneath the sheet's own header row**, which does bound an interactive surface. The `motion-reduce:` half stands. Two additions to this layer's inventory, both stock and neither needing a custom variant: **`starting:`** (for `@starting-style`, without which the fade never runs, because the element leaves `display: none`) and **`backdrop:`** (to zero the UA's `dialog::backdrop { background: rgba(0,0,0,0.1) }`, which would otherwise tint the cross-fade). See [`mobile-sheet-primitive.md`](mobile-sheet-primitive.md) §8–9. No token work was blocked on it, and none is added.
- **[Decide what animates, and with what](https://github.com/viniciusoliveiras/portfolio/issues/11)** — ~~`scroll-behavior` and its reduced-motion counterpart are settled here, in base. That leaves it only the 150ms hover and the 200ms drawer; the 200ms drawer is now fully specified by the sheet decision, CSS-only, so **only the 150ms hover remains.**~~ **Resolved 2026-07-28, and it added three rules to the base layer above rather than one.** The 150ms hover landed in base, not as a utility, on the focus ring's precedent — and hand-written rather than `@apply transition-colors`, because the stock utility's property list includes **`outline-color`**, a latent focus-indicator fade. It also brought a **new** animation this layer had not budgeted for: a 200ms cross-fade on the `/pt` ↔ `/en` switch, which is the only route change on the site. **Three measured findings.** (1) The brief's "150ms" is **Tailwind's own `--default-transition-duration`** — verified in the 4.3.3 tarball, with `--default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)` beside it — so `duration-150` is never written. (2) **Those two vars are pruned when unreferenced** (compiled both ways): they reach the output *because* the hand-written base rule's `var()` counts as usage, which makes the `var()`s load-bearing for their own emission — an interaction between hand-written base CSS and `@theme` pruning worth knowing before anyone "simplifies" them to a literal. (3) The retime targets **`::view-transition-group(*)`, not `old`/`new`**: the UA puts `animation-duration: 0.25s` on the group and gives image-pair/old/new `animation-duration: inherit`, so one selector retimes the whole tree — the two-selector override this decision first sketched was wrong. `::view-transition-group(*)` compiles clean through the 4.3.3 parser, verified. **All variants still stock**, so ADR-0002's "no custom variants at all" holds a third time.
- **[Decide the migration strategy and cutover order](https://github.com/viniciusoliveiras/portfolio/issues/19)** — inherits one new discrete step: the one-off font vendoring in §6, which produces three committed binaries in `public/fonts/` and requires `fonttools` + `brotli` on the machine that runs it, but adds nothing to `package.json` or CI.
- **The asset-strategy fog patch** — one of its two open questions is now answered by construction. The three `woff2` files sit in `public/fonts/` and are referenced by absolute path from `@font-face`, so they are **unhashed** and do not pass through Vite's asset pipeline. Per [ADR-0004](../adr/0004-deployment-target-and-rendering-mode.md) that is precisely the scenario needing a `headers` block in `vercel.json` — the only such scenario in the whole spec. The alternative is importing them as modules for hashed, `immutable`-cached output at the cost of a `?url` import per face.
