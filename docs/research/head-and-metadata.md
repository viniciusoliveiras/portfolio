# Head and metadata for both locale routes

Resolves [Settle the head and metadata content for both locale routes](https://github.com/viniciusoliveiras/portfolio/issues/13). Decided 2026-07-28.

Every API claim below is read out of the **pinned** packages — `@tanstack/react-router@1.170.18` and its resolved `@tanstack/router-core@1.171.15` — or compiled, rather than taken from documentation. Two of the findings contradict what the [API map](https://github.com/viniciusoliveiras/portfolio/issues/3) recorded, and one **invalidates a handoff this ticket inherited** from the token layer.

---

## 1. The six decisions

| # | Decision |
| --- | --- |
| 1 | **Canonical origin is a custom domain**, written once as `SITE_ORIGIN`. |
| 2 | **Title and description strings live in the message modules** under a `meta` key, not inline in `head()`. This ticket fixes the keys, the formula and the budgets; [the copy ticket](https://github.com/viniciusoliveiras/portfolio/issues/14) authors the wording. |
| 3 | **One static, locale-neutral OG card**, 1200×630, self-hosted. |
| 4 | **The PWA surface is dropped entirely** — no manifest, no `apple-touch-icon`, `public/icons/` deleted. Favicon only. |
| 5 | **No sitemap.** `robots.txt` is cleaned to its one useful directive. |
| 6 | **A minimal `Person` JSON-LD block**, declared in exactly one place. |

---

## 2. `SITE_ORIGIN` — and the defect it retires

The site currently serves from **two live origins**:

| Origin | Status | Who points at it |
| --- | --- | --- |
| `viniciusoliveiras.vercel.app` | 200, `/` → `/home` | the repo's `homepageUrl` field |
| `portfolio-viniciusoliveiras.vercel.app` | 200, `/` → `/home` | every `og:url` and `twitter:url` in `_document.tsx` |

Both are indexable, both serve the same pages, and **`rel="canonical"` appears nowhere in `src/`** — verified. That is duplicate content across two hosts, advertised inconsistently.

> **Corrected 2026-07-29 at cutover**, on two counts, both in this table's favour and one against it.
>
> **"Both are indexable" was not true.** Measured at cutover, `portfolio-viniciusoliveiras.vercel.app` served `x-robots-tag: noindex` — because it was pinned to a *preview*-classified deployment (see below). So the duplicate-content exposure was smaller than this section assessed. The canonical defect it identifies was real regardless.
>
> **The hosts were not one deployment, and the cutover plan's assumption that they would follow production "for free" is false.** Only `viniciusoliveiras.vercel.app` was an attached project **domain** tracking production. The others were **aliases pinned to 2021 deployments**, and after the force-push they were still serving the old Next.js site — `/pt` 404, `/home` 200, `age: 208089`.

**And this table lists two origins where there are three.** `portfolio-git-main-viniciusoliveiras.vercel.app`, a legacy git-branch alias under Vercel's old naming scheme, was pinned to a 2021 deployment too. It carried `x-robots-tag: noindex`, so it never contributed to the duplicate-content defect this section identifies — but it is a third `*.vercel.app` host to account for whenever the origins consolidate.

All three are now **project domains**, which is the only thing that makes a host track production — see [the cutover plan](../migration-cutover.md) §"Same Vercel project" for the mechanism and the API call, established across three production deploys after two wrong guesses. With that done, the fix this section designed works exactly as specified: every origin serves byte-identical output and every one advertises the same `rel="canonical"` at `SITE_ORIGIN`, so they consolidate from launch rather than at domain-swap time.
>
> With both hosts on the new deployment, the fix this section designed works exactly as specified: both serve byte-identical output and both advertise the same `rel="canonical"` at `SITE_ORIGIN`, so the origins consolidate from launch rather than at domain-swap time.

A custom domain retires the ambiguity instead of crowning one of two accidents, and ADR-0001 makes the case: the site's job is hiring signal for a working Tech Lead, and the host is the one string every reader sees.

**The origin is written exactly once.** Canonical, both `hreflang` alternates, `og:url` and the JSON-LD `url`/`sameAs` all derive from it:

```ts
// src/config.ts
export const SITE_ORIGIN = 'https://example.dev'   // ← the one literal to fill in
```

The hostname itself is the single value the implementer supplies; nothing in this spec's shape depends on which it is. ADR-0004's note that this project "will not have" a custom domain on a **non-production branch** is unaffected — that concerned preview deployments losing their automatic `X-Robots-Tag: noindex`, and a production domain does not touch it.

---

## 3. Where each tag lives — and the two things `head()` cannot express

`head()` accepts five keys — `title`, `meta`, `links`, `styles`, `scripts` — and dedupes `meta` by `name`/`property` with the **last** occurrence winning, so the root route carries locale-invariant tags and each locale route overrides only what differs. That much the API map had right.

But **two required tags cannot go through `head()` at all**, and both land as JSX in the `shellComponent`:

### 3.1 `<html lang>` — inherited, already settled

Established by [the i18n research](i18n-and-locale-routing.md) §3: there is no `htmlAttrs` key, so `lang` is JSX in the shell, which sits *above* the locale route and reads the locale from `useRouterState`. The value is **`pt-BR`** while the URL segment stays `/pt`.

### 3.2 The two `theme-color` metas — a handoff this ticket had to invalidate

The token layer handed this ticket *"two `<meta name="theme-color" media="(prefers-color-scheme: …)">` tags carrying `#FAF9F7` and `#1A1918`, the two `paper` values."* **That cannot be expressed as `head().meta` entries.** From `headContentUtils.js` in the pinned build:

```js
const attribute = m.name ?? m.property;
if (attribute) if (metaByAttribute[attribute]) continue;
else metaByAttribute[attribute] = true;
```

**The dedupe key is `name` or `property` alone.** Every other attribute — including `media` — is invisible to it. Two entries both named `theme-color` are treated as the same tag, and the earlier one is silently `continue`d away. Only one `theme-color` would ever render, and which one survives depends on array order rather than on the reader's colour scheme.

There is no escape via the union's `{ tagName: 'meta', … }` member either: that branch still carries `m.name`, so it deduplicates identically.

So both go in the shell's `<head>`, beside `<HeadContent />`. This is the correct home on the merits anyway — they are locale-invariant and mode-dependent, so no route ever needs to override them:

```tsx
// src/routes/__root.tsx — shellComponent
function RootDocument({ children }: { children: React.ReactNode }) {
  const lang = useRouterState({
    select: (s) => (s.location.pathname.startsWith('/en') ? 'en' : 'pt-BR'),
  })

  return (
    <html lang={lang}>
      <head>
        {/* Not head() entries: its meta dedupe keys on `name` alone, so two
            theme-colors differing only in `media` collapse to one. */}
        <meta name="theme-color" content="#FAF9F7" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1A1918" media="(prefers-color-scheme: dark)" />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

Note the symmetry: **both things `head()` cannot express are attributes it has no vocabulary for** — one on `<html>`, one distinguishing two same-named metas.

---

## 4. The root route's `head()` — locale-invariant only

```ts
head: () => ({
  meta: [
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Vinícius Oliveira' },
    { property: 'og:image', content: `${SITE_ORIGIN}/og.png` },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: `${SITE_ORIGIN}/og.png` },
  ],
  links: [
    { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'preload', href: '/fonts/roman.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
    { rel: 'preload', href: '/fonts/mono.woff2',  as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
  ],
})
```

**`charSet` and `viewport` are the highest-consequence lines in this document.** Neither is declared anywhere in this repo today — verified, `grep` finds no `charset` and no `viewport` in `src/` or `next.config.js` — because **Next injects both automatically**. TanStack Start does not: its own maintained [`start-basic` example's `__root.tsx`](https://github.com/TanStack/router/blob/main/examples/react/start-basic/src/routes/__root.tsx) declares them explicitly, `{ charSet: 'utf-8' }` and `{ name: 'viewport', content: 'width=device-width, initial-scale=1' }`.

A port that faithfully copies `_document.tsx`'s head therefore **loses the viewport meta** — and the failure mode is severe and invisible in a desktop dev loop: every Tailwind breakpoint resolves against a ~980px virtual viewport, so phones get the desktop layout, the `md` sheet never appears, and the `lg` marginalia rail renders on a 390px screen. On a design whose entire mobile story is breakpoint-driven, this is the single easiest catastrophic omission in the migration.

**`twitter:*` uses `name`, not `property`.** Today's `_document.tsx` writes `property="twitter:card"` throughout. Most parsers tolerate it; the Twitter/X card spec says `name`. Since the dedupe key is `m.name ?? m.property`, mixing the two forms across routes would also produce two independent entries that never override each other. Use `name` consistently.

**The font preloads keep `crossOrigin`** — inherited from the token layer, which noted it is required on font preloads even same-origin, and that omitting it makes the browser fetch each file twice.

---

## 5. Each locale route's `head()` — everything that varies

```ts
// src/routes/pt.tsx  (en.tsx is the mirror image)
head: () => ({
  meta: [
    { title: pt.meta.title },
    { name: 'description', content: pt.meta.description },
    { property: 'og:title', content: pt.meta.title },
    { property: 'og:description', content: pt.meta.description },
    { property: 'og:url', content: `${SITE_ORIGIN}/pt` },
    { property: 'og:locale', content: 'pt_BR' },
    { property: 'og:locale:alternate', content: 'en_US' },
    { name: 'twitter:title', content: pt.meta.title },
    { name: 'twitter:description', content: pt.meta.description },
    { 'script:ld+json': personLd('pt') },
  ],
  links: [
    { rel: 'canonical', href: `${SITE_ORIGIN}/pt` },
    { rel: 'alternate', hrefLang: 'pt-BR',    href: `${SITE_ORIGIN}/pt` },
    { rel: 'alternate', hrefLang: 'en',       href: `${SITE_ORIGIN}/en` },
    { rel: 'alternate', hrefLang: 'x-default', href: SITE_ORIGIN },
  ],
})
```

**Canonical is self-referential per locale.** `/pt` canonicalises to `/pt`, not to a shared default — two locales are *alternates*, not duplicates, and pointing both at one URL would deindex the other. `/` never needs a canonical of its own: it is a 307 to a locale and returns no HTML.

**`x-default` points at `SITE_ORIGIN`**, per the i18n research's handoff, so it resolves through ADR-0004's edge `Accept-Language` detector rather than hard-coding a preferred locale. Reciprocity is required — each page lists *both* locales plus `x-default`, including itself.

**`links` are not deduped.** Verified: `constructedLinks` simply `flatMap`s every match's `links` with no key check, unlike `meta`. So the three `alternate` entries coexist happily — and, conversely, a `links` entry declared on both the root and a locale route would render **twice**.

### The `meta` key in the message modules

Decision 2 puts the strings where the compiler can see them. Under the message-module contract, `pt` is canonical and `en satisfies Messages`, so a missing English title is **TS2741 at build time** rather than a silently absent tag:

```ts
// src/content/pt.ts
export const pt = {
  meta: {
    title: '…',          // ≤ 60 chars; MUST carry the Tech Lead positioning
    description: '…',    // ≤ 155 chars
  },
  // …the seven sections
}
```

Constraints handed to [the copy ticket](https://github.com/viniciusoliveiras/portfolio/issues/14):

- **Not translations of a template.** A pt-BR recruiter and an English-speaking engineering manager are being addressed differently; only the *structure* is compiler-enforced parallel, and the i18n decision already narrowed "translation or independent" to **wording only**.
- **The title carries the role**, because ADR-0001 makes the Tech Lead positioning the entire point of the redesign, and the current title — *"Vinícius Oliveira - Portfólio"* — asserts nothing.
- **Budgets are ~60 and ~155 characters**, the practical truncation points.
- The description replaces *"Portfólio pessoal construído com React.js"*, which describes the build tool rather than the person.

---

## 6. The JSON-LD `Person` block — declare it once

`{ 'script:ld+json': LdJsonObject }` is a first-class member of the `MetaDescriptor` union, so this needs no dependency and no build step. The renderer `JSON.stringify`s it, applies `escapeHtml`, and emits `<script type="application/ld+json">`.

```ts
const personLd = (locale: 'pt' | 'en') => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Vinícius Oliveira',
  url: `${SITE_ORIGIN}/${locale}`,
  jobTitle: 'Tech Lead',
  knowsLanguage: ['pt-BR', 'en'],
  sameAs: [
    'https://github.com/viniciusoliveiras',
    'https://www.linkedin.com/in/viniciusoliveiras-01532/',
  ],
})
```

**It must be declared on the locale routes only, never also on the root.** `script:ld+json` entries are handled by their own branch *before* the dedupe branch and carry no `name`/`property`, so **they are never deduplicated** — declaring one on the root and one on a locale route ships two competing `Person` blocks.

**`jobTitle` does not vary**, deliberately: "Tech Lead" is the title used in Portuguese too, and the résumé is the source of truth for every experience claim. That leaves `url` as the *only* locale-varying field, so `personLd` takes the locale purely to build its own canonical URL — which is why it belongs on the locale route rather than the root even before the deduplication argument. Instagram is **not** in `sameAs`: ADR-0001 dropped it as off-message.

---

## 7. The `/404` route's head

ADR-0004 established that the spec needs a **real `/404` route** sharing its component with the root's `notFoundComponent`, and that the page is **bilingual** — one page carrying both languages, since Vercel's zero-config path serves exactly one `404.html` and cannot know the visitor's locale.

```ts
head: () => ({
  meta: [
    { title: 'Página não encontrada · Page not found' },
    { name: 'robots', content: 'noindex' },
  ],
})
```

**`noindex` is required, and ADR-0004's own config is why.** `cleanUrls: true` serves `/404` from `404.html` with a **200** status. The zero-config path is safe — a cold request to an unknown URL returns a real 404, which is never indexed — but the `/404` URL *itself* resolves 200 and is a textbook indexable soft-404. No canonical and no `hreflang` on this page: it has no locale counterpart to point at.

**Its English half needs a per-element `lang`**, per the i18n research's handoff, since the shell's `<html lang>` can only be one value. The "back" link targets the **locale root** (`/pt` or `/en`), not today's `/home`, which ceases to exist.

---

## 8. What dies

| Tag / asset | Why |
| --- | --- |
| Google Fonts `preconnect` + Heebo stylesheet | Already deleted by the design brief; three self-hosted `woff2` files replace them |
| jsDelivr `devicon` stylesheet | Dies with the icon wall (ADR-0001) |
| `theme-color: #FFD369` | Dead colour — the yellow died with the palette; two per-mode `paper` values replace it |
| `og:image` → `i.imgur.com/oSNgyWg.jpg` | **A stock photo of PHP/WordPress theme code** — 3543×2365, 1.5 MB, hotlinked, and in a stack this person does not work in |
| `/manifest.json` + `public/icons/` | Decision 4 |
| `apple-touch-icon` | Decision 4 |
| `<meta name="title">` | Not a real tag; `<title>` is the tag |
| Two hardcoded `og:url` / `twitter:url` origins | Replaced by `SITE_ORIGIN` |

**The manifest could not have been ported unchanged even if kept**: `"start_url": "/home"` targets a route ADR-0001 deletes, so an installed instance would launch into a 404. Its `name` and `description` still read *"Portfólio pessoal construído com React.js"*, and its `theme_color`/`background_color` are the dead `#FFD369`. There is also a structural conflict — the manifest's `theme_color` is a **single** value, so it cannot follow the mode, and a ported manifest would contradict the two `theme-color` metas §3.2 places in the shell.

---

## 9. `robots.txt`

```
User-agent: *
Allow: /
```

The `Disallow: /nogooglebot/` block that currently opens the file is **copy-pasted verbatim from Google's own robots.txt documentation example** and references a directory that has never existed in this repo. What remains is exactly the crawler default, so the file encodes no policy — it is kept as the conventional artifact and the hook for a future `Sitemap:` line, not because it does anything.

**No sitemap.** Google accepts `hreflang` through HTML `<link>` elements *or* a sitemap, either alone being sufficient, and this site has **two** indexable URLs, both already carrying reciprocal alternates from §5. **Reopen trigger**: the site gaining routes — a writing section, per-role detail pages — at which point a hand-maintained two-entry file stops being ceremony and starts being worth its drift risk.

---

## 10. Traps, verified

1. **`viewport` is not automatic.** §4. Loses mobile layout entirely; invisible on a desktop dev loop.
2. **`head().meta` cannot carry two same-named metas.** §3.2. Dedupes on `name`/`property` alone, so `media` variants collapse. Invalidated a token-layer handoff.
3. **`MetaDescriptor` is not type-checked in any useful sense.** The union ends in `Record<string, unknown>`, which accepts anything. Compiled to confirm — all four of these pass `--strict --noEmit` with **no error**:

   ```ts
   const a: MetaDescriptor = { propety: 'og:title', content: 'typo' }  // misspelt key
   const b: MetaDescriptor = { name: 'description' }                    // no content
   const c: MetaDescriptor = { charSet: 'utf-16' }                      // wrong literal
   const d: MetaDescriptor = { completeNonsense: 42 }
   ```

   The same union with the trailing `Record<string, unknown>` removed rejects the first with **TS2353**, isolating the catch-all as the cause. So a typo in a `property` key is caught by **nothing** — not the compiler, not Biome, not the build — and renders as a silently wrong tag. On a ~20-tag head across two locales, this is the likeliest defect in the whole document; the mitigation is that both locale routes derive their strings from one typed `meta` object, so a mistake is at least made once rather than twice.
4. **`script:ld+json` is never deduplicated.** §6. Declare on locale routes only.
5. **`links` are never deduplicated either.** §5. A `canonical` on both root and locale route renders twice.
6. **`twitter:*` should use `name`, not `property`.** §4. Mixing forms defeats override, since they are different dedupe keys.

Two smaller pre-existing defects, recorded so they are not faithfully ported: `HeaderNav.tsx:84` has `href="mailto: vinitag190@gmail.com"` — **a space after the colon**, malformed per RFC 6068 — and the favicon is referenced as the relative `images/favicon.svg`, which resolves correctly only because every current route is a single path segment. Both become absolute, well-formed strings.

---

## 11. What this hands to other tickets

- **[Author the site copy for all seven sections, in both locales](https://github.com/viniciusoliveiras/portfolio/issues/14)** — gains a `meta` key in each message module: `title` (≤60 chars, must carry the Tech Lead positioning) and `description` (≤155 chars). Written pt-first like everything else, and the `satisfies Messages` check makes a missing English one a build failure. Also owns the personal-email question — `vinitag190@gmail.com` is what the site publishes today.
- **[Prototype the seven sections within the fixed design system](https://github.com/viniciusoliveiras/portfolio/issues/17)** — nothing blocking. The OG card is a separate 1200×630 artifact, not a section, and is spec'd tightly enough from the brief's tokens (paper ground, ink name, mono role label, accent rule) that producing the file is implementation, not design.
- **[Decide the migration strategy and cutover order](https://github.com/viniciusoliveiras/portfolio/issues/19)** — inherits three discrete deletions (`public/manifest.json`, `public/icons/`, the `robots.txt` block) and two additions (`public/og.png`, `src/config.ts`). Also inherits the **domain cutover**: registering the custom domain, pointing DNS at Vercel, and keeping the old `*.vercel.app` origins redirecting so existing shared links survive.
- **[The Tailwind token layer](https://github.com/viniciusoliveiras/portfolio/issues/16)** — its `theme-color` handoff is **honoured but relocated**: the two metas exist with exactly the values it specified, as shell JSX rather than `head()` entries, for the reason in §3.2. Its font-preload handoff is taken verbatim, `crossOrigin` included.
- **[The API map](https://github.com/viniciusoliveiras/portfolio/issues/3)** — two corrections. Its `meta` type `{ name?, property?, content? }` is a narrow slice of the real eight-member `MetaDescriptor` union, which also carries `charSet`, `title`, `httpEquiv`, `script:ld+json`, a `tagName` escape hatch and a catch-all; and its "everything currently in the heads is a `head()` entry on the root route" is wrong in two places, since `theme-color` and `<html lang>` both structurally cannot be.
- **The asset-strategy fog patch** — **`public/` is now settled except the favicon and the résumé PDF.** `icons/` is deleted, `manifest.json` is deleted, `og.png` is added, and `images/vercel-icon-dark.svg` turns out to be **referenced nowhere in `src/` already** — an orphan from the Create Next App scaffold, so it deletes on its own account rather than as a consequence of anything. The favicon stays open: this spec fixes only its path and type (`/favicon.svg`, `image/svg+xml`), not its design. — *Now closed by [the favicon spec](favicon-and-asset-serving.md), which leaves this document's icon link, `public/` inventory and decision 4 all standing: the mark is a `#B3261E` tile carrying a Source Serif 4 `V`, there is **no** raster fallback (so "favicon only" holds), and the résumé is served unhashed from `public/resume-en.pdf` — a file that turned out not to be in the repo at all.*
