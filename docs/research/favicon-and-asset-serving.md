# Favicon and asset serving

Resolves [Settle the favicon and where the résumé PDF is served from](https://github.com/viniciusoliveiras/portfolio/issues/21) — the last two questions of the asset-strategy fog patch.

Decided **2026-07-28**. Every browser-support claim below cites a bug tracker or a vendor release note with the date it was read; every contrast ratio and geometry number was **computed or rendered locally** (Chromium via Playwright, fontTools 4.62.1, Pillow) rather than inferred. The favicon in §1.5 is the shipping file, not a sketch.

| # | Decision |
| --- | --- |
| 1 | **A full-bleed `#B3261E` tile carrying a Source Serif 4 `V`** in `#FAF9F7` — `wght 600`, `opsz 8`, exported as a path. 332 bytes. |
| 2 | **No `prefers-color-scheme` block in the file at all.** The mark carries its own ground, so the requirement is removed rather than solved — which is the only outcome that works in Safari. |
| 3 | **No raster fallback.** SVG only, holding [the head-and-metadata decision](head-and-metadata.md)'s "favicon only" line. |
| 4 | **`public/resume-en.pdf`**, unhashed at the web root, on Vercel's default revalidating headers. |
| 5 | **One `vercel.json` headers entry**, `/fonts/(.*)` → `max-age=31536000, immutable`, with a rename rule. Nothing else is given long-lived caching. |

---

## 1. The favicon

### 1.1 The mark that ships today is not his

`public/images/favicon.svg` — a rounded-hexagon shield enclosing a `>` chevron and a `_` underscore — carries `xmlns:svgjs="http://svgjs.com/svgjs"`, a `data-original="#000000"` attribute on every path, and fifteen empty `<g>` elements. That is the signature of an icon-pack export, recoloured to `#ffd369` and committed. Two independent reasons it cannot continue:

- **Its colour is dead.** The design brief dropped the yellow and the cyan; `#FFD369` was also the old `theme-color`, which [the head-and-metadata decision](head-and-metadata.md) already replaced with the two per-mode `paper` values.
- **Its provenance contradicts the site's thesis.** ADR-0001 makes the site itself the one live craft demo, because the professional work is not public. An unattributed third-party icon in the tab strip is the wrong first artifact for that argument, and a terminal-prompt glyph is the developer idiom rather than the print idiom the brief commits to.

### 1.2 Why the mark carries its own ground — measured

The favicon renders against **browser chrome**, not against the site's `paper`. Contrast ratios computed 2026-07-28 against real chrome values:

| Mark | Chrome light `#FFFFFF` | Chrome dark `#202124` | Safari dark `#3B3B3B` | Firefox dark `#2B2A33` |
| --- | --- | --- | --- | --- |
| bare `ink` `#1A1A1A` | 17.40 | **1.08** | **1.55** | **1.23** |
| bare `accent` `#B3261E` | 6.54 | **2.46** | **1.71** | **2.17** |
| bare `muted` `#545454` | 7.57 | **2.13** | **1.48** | **1.87** |
| `paper` `#FAF9F7` field | 1.05 | 15.30 | 10.65 | 13.47 |

**Every transparent-ground option fails 3:1 on every dark chrome**, and the worst cell in the table — `accent` at **1.71:1** on Safari's dark toolbar — is in the one browser a media query cannot reach (§2). A mark that brings its own field is legible in both chromes with no conditional logic: the tile's *edge* weakens on dark chrome (2.46:1) but the `#FAF9F7` letterform inside it does not, reading at 15.30:1 against the same surface.

Of the two grounds that work, the **accent tile** was chosen over an ink tile: internal contrast is 6.21:1 (`#FAF9F7` on `#B3261E`), red is the single accent the brief kept and the most canonically print one there is, and an ink tile dissolves at 1.08:1 on dark chrome — leaving a pale V floating with no mark around it.

Square corners, no radius: it maximises the ground area, reads as a printer's block, and a 12–15% radius eats ~2px per corner at 16px, at which point the mark reads as an app icon — the idiom [the mobile-sheet decision](mobile-sheet-primitive.md) already declined as convention drift.

### 1.3 Why `opsz 8`, and why the glyph is a path

Source Serif 4 carries `opsz 8–60` (verified in the binary: `wght 200–900`, `opsz 8–60`, `unitsPerEm` 1000, `sCapHeight` 670, version 4.005). A favicon is the smallest place the typeface will ever appear, so it takes the **small** optical cut. That is not a stylistic preference — it is measurable:

| Instance | `V` bounding box | Width |
| --- | --- | --- |
| `wght 600, opsz 8` | `(13.65, −2.68) → (732, 664.06)` | **718.35** units |
| `wght 600, opsz 20` | `(11.70, −4.69) → (662.03, 664.06)` | 650.33 units |

The `opsz 8` cut is **10.5% wider** at the same weight and cap height — sturdier strokes and more open counters, which is precisely what survives a 16px raster. `wght 600` is one of the two serif weights the design already ships (400 and 600; the mono is a static 500), so the mark is drawn in the site's own type rather than in a lookalike.

The glyph is **exported as an outline**, not set as text: a favicon SVG is fetched as a standalone document with no access to the site's `@font-face` rules, so `<text>` would fall back to whatever serif the OS has. This also means the favicon adds **nothing** to the font payload — the two `woff2` files are untouched.

### 1.4 Geometry

Fitted by cap height, centred horizontally, in a 32-unit `viewBox`:

- Scale `0.03648` (`24.32 / 666.74`), translate `(2.401, 28.062)` with a `y` flip.
- Vertical inset **12.0%** — 3.84 of 32, top and bottom.
- Horizontal inset **9.1%** — 2.90 each side, because the `opsz 8` V is wider than it is tall (718 × 667 units). The letterform is centred; the asymmetry is the glyph's, not a misfit.

### 1.5 The file

`public/favicon.svg` — 332 bytes, no `<style>` element, no CSS at all:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#B3261E"/>
  <path fill="#FAF9F7" d="M13.96 28.16 4.93 3.84H10.49L17.52 25.31H17.97L20.59 15.02L24.33 3.84H27.2L18.54 28.16ZM2.9 6.37V3.84H14.99V6.37H10.08H7.02ZM20.05 6.37V3.84H29.1V6.37H25.45H24.14Z"/>
</svg>
```

Reproducible end to end:

```sh
# Source Serif 4.005R, WOFF2 release, VAR/ subdirectory
curl -sLO https://github.com/adobe-fonts/source-serif/releases/download/4.005R/source-serif-4.005_WOFF2.zip
unzip -q source-serif-4.005_WOFF2.zip

python3 - <<'PY'
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Identity

f = TTFont('source-serif-4.005_WOFF2/VAR/SourceSerif4Variable-Roman.ttf.woff2')
instancer.instantiateVariableFont(f, {'wght': 600, 'opsz': 8}, inplace=True)
gs = f.getGlyphSet(); g = gs['V']

bp = BoundsPen(gs); g.draw(bp)
xmin, ymin, xmax, ymax = bp.bounds
VB, INSET = 32.0, 0.12
box, off = VB * (1 - 2 * INSET), VB * INSET
s = box / (ymax - ymin)
t = Identity.translate(off + (box - s * (xmax - xmin)) / 2 - s * xmin, off + s * ymax).scale(s, -s)

sp = SVGPathPen(gs, ntos=lambda v: f'{v:.2f}'.rstrip('0').rstrip('.'))
g.draw(TransformPen(sp, t))
print(sp.getCommands())
PY
```

### 1.6 The trap: the fill rule is load-bearing

Source Serif 4 draws the `V` as **three overlapping contours** — the stems plus a separate slab for each top serif, which is how variable fonts avoid point-count mismatches across the designspace. Under the default `nonzero` rule they union correctly. Under `evenodd` the overlaps punch out.

**Measured** by rendering both at 128px in Chromium and counting ink pixels: nonzero 3593, evenodd 3277 — **8.8% of the glyph lost**, and it lands entirely on the serifs, which detach from the stems into floating fragments.

Nothing in the file sets `fill-rule`, and nothing should. This is recorded because it is invisible in the source and an SVG optimiser or hand-tidy is exactly what would introduce it — the file is small enough that it should never be run through `svgo` at all.

### 1.7 Verified in a renderer

The file was served over HTTP and rendered in Chromium at 16, 32, 64 and 128px against both `#FFFFFF` and `#202124`. The contours union as expected, the serifs survive, and the mark reads as a red block with a light `V` at 16px on both chromes. This was worth doing rather than reasoning about: the three-contour fill-rule question in §1.6 is not visible in the path data.

---

## 2. No media query — and the mechanism, verified

The ticket asked whether the SVG should carry an inline `@media (prefers-color-scheme: dark)` block, noting the support question was a fact to check rather than assume. It was checked, and the answer makes the question moot.

### 2.1 What each engine does

| Engine | SVG favicon | `prefers-color-scheme` inside it | Source, read 2026-07-28 |
| --- | --- | --- | --- |
| Chrome / Edge | since Chrome 80 | **Yes** | [caniuse `link-icon-svg`](https://caniuse.com/link-icon-svg) |
| Firefox | since Firefox 41 | **Yes**, resolved against the **browser theme** | [bug 1764354](https://bugzilla.mozilla.org/show_bug.cgi?id=1764354) — RESOLVED FIXED, Firefox 101 |
| Firefox (Windows) | — | regression, fixed | [bug 1772632](https://bugzilla.mozilla.org/show_bug.cgi?id=1772632) — VERIFIED FIXED, Firefox 103 |
| Safari / iOS | **only since 26.0** | **No** | [WebKit Safari 26.0 notes](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/), 2025-09-15 |
| Safari | — | open bug | [WebKit bug 309949](https://bugs.webkit.org/show_bug.cgi?id=309949) — **NEW**, filed 2026-03-13, last touched 2026-07-04 |
| WebKitGTK | — | **No** | same bug, comment 6 |

WebKit bug **309949** is titled *"SVG favicons don't respect media query overrides, notably for dark mode."* It is confirmed, unassigned, and Anne van Kesteren's comment 3 notes it needs *"something different for favicons"* than the embedded-SVG colour-scheme work in [bug 199134](https://bugs.webkit.org/show_bug.cgi?id=199134) — so it is not incidentally fixed by that track. There is no fix in any shipped Safari.

Firefox's bug 1764354 records the mechanism the other engines share and is worth stating explicitly: a favicon's media query resolves against the **browser's own theme**, not the page's colour scheme. For this site the two agree by construction — the brief specified light-canonical with dark via `prefers-color-scheme` and **no toggle**, so there is no page-level override to diverge from. A site with a manual theme switch would have a favicon that ignores it.

One documented wart, not independently confirmed here: Chromium historically required a page reload before a favicon picked up an OS theme change ([crbug 1026539](https://issues.chromium.org/issues/40650595), status unread — the tracker requires sign-in). It does not bear on the decision.

### 2.2 Why this closes the question rather than answering it

The unsupported case does not fail loudly — it renders whatever is declared **outside** the `@media` block. So a media-query favicon is a progressive enhancement whose fallback branch is exactly the case §1.2 measured as broken: a light-mode mark on dark chrome, at 1.55–1.71:1 in Safari.

So the media query cannot rescue a transparent-ground mark, and a mark with its own ground does not need one. **The requirement is removed rather than solved** — the same shape as the mobile-sheet decision, where `closedby="any"` being at 0% on iOS deleted the light-dismiss requirement instead of prompting a hand-rolled substitute, and as ADR-0004, where static output made an upstream Vercel bug unreachable rather than worked around.

Consequences worth naming: the file contains **no CSS**, so it also renders correctly in the many contexts that rasterise an icon with no colour scheme attached at all (crawlers, feed readers, OS-level icon caches); and there is exactly **one** favicon artifact to keep in step with the palette instead of two branches that can drift.

---

## 3. No raster fallback

[caniuse](https://caniuse.com/link-icon-svg) puts SVG favicon support at **89.14%** globally, and since Safari and iOS Safari only gained it in 26.0 (2025-09-15, ~10 months old at time of writing) the ~11% gap is mostly older Safari and iOS. Those visitors get their browser's generic placeholder.

That is accepted. Adding a second `rel=icon` is the spec-sanctioned way to serve them — per MDN, when several icons are declared the browser uses `media`, `type` and `sizes` to pick one, and *"if the most appropriate icon is later found to be inappropriate, for example because it uses an unsupported format, the browser proceeds to the next-most appropriate"* — but it costs a second raster artifact to regenerate on every change, i.e. a second source of truth for the mark, to fix a cosmetic gap in one chrome affordance on a site that otherwise ships a single raster file (the OG card). [The head-and-metadata decision](head-and-metadata.md)'s decision 4 — the PWA surface dropped entirely, favicon only — stands unamended.

Note also that the familiar automatic fallback does **not** apply here: the HTML Standard permits requesting `/favicon.ico` only *"in the absence of a link with the `icon` keyword"*, and this site declares one. An `.ico` would need its own explicit `<link>` regardless, so it buys nothing a PNG would not, at 5–10× the bytes in an obsolete container.

**The head stays exactly as [the head-and-metadata decision](head-and-metadata.md) §4 wrote it** — one entry, unchanged by this document:

```ts
{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
```

---

## 4. What `public/` contains, and where the PDF comes from

| Path | Hashed? | Notes |
| --- | --- | --- |
| `public/favicon.svg` | no | §1. Moves out of `images/`; the head reference becomes absolute. |
| `public/fonts/roman.woff2` | no | Preloaded, render-blocking. §5. |
| `public/fonts/mono.woff2` | no | Preloaded, render-blocking. §5. |
| `public/og.png` | no | 1200×630, locale-neutral. |
| `public/robots.txt` | no | Carried over cleaned. |
| `public/resume-en.pdf` | no | **New to the repo.** §4.1. |

The résumé confirms the pattern the fonts set: unhashed, absolute path, stable across deployments — required here because the PDF's own footer cites a URL, and a content-hashed name could not be written into the document that carries it. `/resume-en.pdf` is already the path [the copy](../site-copy.md) §Contact fixed, linked from both locales with the Portuguese label naming the language.

### 4.1 The PDF is not in the repository, and nothing was going to add it

`git ls-files` finds **no PDF anywhere in the repo**. The file every factual claim on the new site traces to lives at `~/Documentos/resume-en.pdf` — 40.6 KB, untracked, local to one machine.

This matters more than it sounds, because of how [the migration decision](../migration-cutover.md) works. That decision inverted every deletion into a four-item **carry-over** list (`docs/`, `AGENTS.md`, cleaned `robots.txt`, the favicon) on the reasoning that an orphan branch creates only what is explicitly carried. The résumé PDF **never appeared in any deletion inventory** — it was never in the tree to be deleted — so it never inverted into that list. The orphan branch would therefore be authored without it, and `/resume-en.pdf` would 404 at launch from **two** places on both locales: the hero's second action and the contact list.

The carry-over list becomes **five items**. The PDF's content refresh at cutover was already assigned (Phase 0, the `Languages` grouping); this adds the prior step of the file existing in the repo at all.

---

## 5. Cache headers

Vercel's default for a static file is **`cache-control: public, max-age=0, must-revalidate`**, which the docs describe as instructing *"both the CDN and the browser not to cache"* ([Cache-Control headers](https://vercel.com/docs/caching/cache-control-headers), last updated 2026-07-01). The CDN still serves from the edge, but the browser spends a conditional request on every asset on every visit — including both preloaded `woff2` files, which [the token layer](tailwind-token-layer.md) subset down to 92.8 KB specifically because they sit on the render-blocking path of a page whose motion budget bans scroll reveals for delaying content.

This resolves the handoff ADR-0004 left open — *"the only scenario that would need one is fonts served unhashed from `public/`, which belongs to the map's asset-strategy patch."* It needs one, for the fonts and nothing else:

```json
{
  "headers": [
    {
      "source": "/fonts/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

This block is **added to** the `vercel.json` ADR-0004 already specifies for the `/` locale redirect, `cleanUrls` and `autoSubfolderIndex` — not a new file.

**The rule `immutable` buys, and its price:** the fonts are unhashed, so cache-busting is by filename. **Changing a font file means changing its name** (`roman.woff2` → `roman-2.woff2`, updating the `@font-face` `src` and the `preload` link together). Written here because the failure mode is silent and long: a swapped font under an unchanged name is invisible in a fresh browser and permanent in a warm one.

**Everything else keeps the revalidating default**, deliberately:

- **`resume-en.pdf`** — it changes at cutover and will change again whenever the résumé does, and a year-stale PDF served to a recruiter is a worse outcome than one conditional request on a click-through that is not on any render path.
- **`favicon.svg` and `og.png`** — the two assets most likely to be revised after launch. Browsers keep their own favicon caches regardless, and a frozen OG card in crawler stores is not worth the saved bytes.
- **`robots.txt`** — must stay fresh by nature.

So the site ships exactly one caching rule, covering the two files where the cost is measurable and the content is genuinely immutable once named.

---

## 6. Corrections to documents already written

**[The migration decision](../migration-cutover.md)'s `docs/` count was stale the moment it was written.** It records `docs/` as **18 files** in the carry-over table and repeats *"verify 18 files"* as step 9's pre-push check — the check guarding what it calls the highest-risk step in the whole map. Measured: `git ls-tree -r HEAD~1 docs/` is 18 and `HEAD` is 19, so the commit that wrote "18" was the commit that made it 19 by adding `migration-cutover.md` itself. This document makes it 20.

The fix is not a new literal — it is not writing one. A hardcoded count goes stale on every document the map adds, and it goes stale *silently*, in a check whose whole job is to catch a silent catastrophe. The check should compute both sides:

```sh
# on main, immediately before the force-push
git ls-files docs/ | wc -l                    # source of truth
git ls-tree -r --name-only <orphan> docs/ | wc -l   # must match
```

Both the table row and step 9 are updated accordingly, and the carry-over list gains the résumé PDF from §4.1.

**[The head-and-metadata decision](head-and-metadata.md)** needs no change to its specification — its icon link, its `public/` inventory and its decision 4 all stand. Its §11 note that "the favicon stays open" is closed by this document.

---

## 7. What this hands to other tickets

- **[Assemble the deliverable](https://github.com/viniciusoliveiras/portfolio/issues/22)** — this document is **contract-shaped, not ADR-shaped**, and does not register as a fifth candidate for ADR `0005`. It records no reversible choice between architectures; it is a paste-ready asset, a paste-ready config block and a support matrix, which is the same shape as the token layer and the section layouts. The one genuinely decision-like part — no raster fallback — is a restatement of [the head-and-metadata decision](head-and-metadata.md)'s decision 4 (the PWA surface is dropped entirely) rather than a new position.
- **[The migration decision](../migration-cutover.md)** — carry-over list goes to five items, and the `docs/` pre-push check becomes computed rather than literal. Both edits applied in this commit.
- **Implementation, whenever it happens** — do not run `public/favicon.svg` through an SVG optimiser (§1.6), and rename a font file rather than replacing it in place (§5).
