# i18n and locale routing for `/pt` and `/en`

Research asset for [Specify the i18next setup and locale routing for /pt and /en](https://github.com/viniciusoliveiras/portfolio/issues/12), a ticket on [Map: migrate the portfolio to TanStack Start + Tailwind, with a redesign](https://github.com/viniciusoliveiras/portfolio/issues/1).

**Everything below checked 2026-07-27** against the npm registry, TanStack Router's docs and maintained examples at `main`, the i18next and react-i18next changelogs, and Vercel's `vercel.json` reference. Nothing is from model memory. Re-verify the version rows before implementation.

## Verdict up front

1. **Route shape: two literal route files**, `routes/pt.tsx` and `routes/en.tsx`, rendering one shared page component. Not an optional param, not a required param, not a URL rewrite. This is the only shape that keeps ADR-0004's static build free of `pages` enumeration while honouring ADR-0001's "both locales prefixed".
2. **`<html lang>` cannot come from `head()`.** It has to be JSX in the root `shellComponent`, which sits *above* the locale route — so the shell reads the locale out of `useRouterState`. This is the single easiest thing here to omit and the most expensive to omit, because it is an accessibility and SEO defect that no build step catches.
3. **i18next is overkill for this site — and as of 2026-07-28 this is decided, not recommended: the site ships typed message modules and no i18n runtime.** Two locales of static authored copy on one page need a typed message module per locale, not 23.5 KB gzip of translation runtime. §8 is the decision, with the module shapes and the compiler behaviour measured under the pinned TypeScript. §4 is retained as the road not taken — the full i18next setup, kept because reversal is `createInstance` plus a provider with the copy untouched.

**This supersedes ADR-0001's "pt-BR and English via i18next"** as to the *library only*. Everything else that ADR said about language — both locales prefixed, English as a first-class version rather than a translation afterthought — stands. Following the precedent of ADR-0004, the supersession is recorded here rather than by editing ADR-0001 in place.

---

## 1. Versions

| Package | Latest | Published | Notes | Source |
| --- | --- | --- | --- | --- |
| `i18next` | **26.3.6** | 2026-07-09 | **Zero runtime dependencies.** Peer: `typescript@^5 \|\| ^6 \|\| ^7` (optional) | [registry](https://registry.npmjs.org/i18next) |
| `react-i18next` | **17.0.11** | 2026-07-22 | Peers: `i18next >= 26.2.0`, `react >= 16.8.0`, `typescript ^5 \|\| ^6 \|\| ^7`. Deps: `@babel/runtime`, `html-parse-stringify`, `use-sync-external-store` | [registry](https://registry.npmjs.org/react-i18next) |
| `i18next-browser-languagedetector` | 8.2.1 | 2026-02-12 | **Not needed** — detection happens at Vercel's edge per ADR-0004 | [registry](https://registry.npmjs.org/i18next-browser-languagedetector) |
| `@inlang/paraglide-js` | 2.4.x | — | The library TanStack's own i18n examples use. Listed for context, not proposed | [example `package.json`](https://github.com/TanStack/router/blob/main/examples/react/start-i18n-paraglide/package.json) |

### Compatibility with the pinned stack — no conflicts

- **React 19.2.8** satisfies `react >= 16.8.0`. react-i18next runs weekly CI against `@types/react@next` as of 17.0.10, and 16.3.4 fixed the last React 19 `ref is not a prop` warning.
- **TanStack Start 1.168.32 / Router 1.170.18 / Vite 8.1.5** — neither package has an opinion about the framework; the integration surface is React context.
- **The TypeScript pair from ADR-0002 does not trip `strictPeerDependencies`.** ADR-0003 sets `strictPeerDependencies: true`, and both packages declare a `typescript` peer. In the maintained example the dependency literally named `typescript` is `npm:@typescript/typescript6@^6.0.2`, which resolves to **6.0.2** ([registry](https://registry.npmjs.org/@typescript/typescript6)) and satisfies `^6`. The TS 7 compiler is installed under the *alias key* `@typescript/native`, so it never participates in peer resolution. Verified against [`start-basic/package.json`](https://github.com/TanStack/router/blob/main/examples/react/start-basic/package.json).
- **i18next is dual CJS/ESM**, not CJS-only — `hasJSModule: "./dist/esm/i18next.js"`, `isModuleType: false` ([bundlephobia API](https://bundlephobia.com/api/size?package=i18next@26.3.6)). It would not repeat the `typewriter-effect` problem the [dependency verdicts](https://github.com/viniciusoliveiras/portfolio/issues/4) flagged.

### Weight

| Package | Minified | **Gzip** | Deps |
| --- | --- | --- | --- |
| `i18next@26.3.6` | 43,441 B | **13,513 B** | 0 |
| `react-i18next@17.0.11` | 25,340 B | **9,958 B** | 3 |
| **Total** | 68.8 KB | **23.5 KB** | |

Measured via the bundlephobia API, 2026-07-27. Add the translation resources themselves on top — see §7.

### Breaking changes worth knowing if i18next is kept

- **i18next 26.0.0** removed the deprecated `initImmediate` option (use `initAsync`), removed the legacy `interpolation.format` function in favour of the Formatter module via `.use()`, and removed `simplifyPluralSuffix`. TypeScript 4 support dropped.
- **i18next 26.3.4** was a security release — `deepExtend` prototype pollution, GHSA-6jcc-5g8w-32mx, CVSS 5.9. Do not pin below it.
- **react-i18next 17.0.0** changed `<Trans>` serialisation: `transKeepBasicHtmlNodesFor` now preserves HTML tag names when children contain interpolations, so `<strong>{{name}}</strong>` no longer serialises as `<1>{{name}}</1>`. Only bites projects with existing auto-generated `Trans` keys — irrelevant here, since the copy is authored fresh in [the copy ticket](https://github.com/viniciusoliveiras/portfolio/issues/14).

Sources: [i18next CHANGELOG](https://github.com/i18next/i18next/blob/master/CHANGELOG.md), [react-i18next CHANGELOG](https://github.com/i18next/react-i18next/blob/master/CHANGELOG.md).

---

## 2. Route shape — four candidates, one winner

[TanStack Router's i18n guide](https://tanstack.com/router/latest/docs/framework/react/guide/internationalization-i18n) offers two headline patterns and states plainly that the router is *"library-agnostic"*. Both of its patterns are wrong for this site, for reasons specific to ADR-0001 and ADR-0004.

### A. Optional path parameter `{-$locale}` — **rejected**

The guide's own headline pattern. A single route file `routes/{-$locale}/index.tsx` matches `/`, `/pt` and `/en`.

Rejected because it **privileges the default locale by construction**: the whole point of an optional param is that the default locale is served unprefixed. [ADR-0001](../adr/0001-information-architecture.md) requires both locales prefixed *"so no locale is privileged and the active language is unambiguous in every URL"*. Under this pattern `/` is a real, renderable route rather than a redirect, which also collides with ADR-0004's edge redirect: the prerenderer would emit an `index.html` that Vercel's redirect makes permanently unreachable.

### B. Required path parameter `$locale` — **workable, but costs more**

`routes/$locale/index.tsx`. Both locales prefixed, page written once.

Two costs. First, prerender enumeration: *"Routes are excluded from automatic discovery in the following cases: Routes with path parameters (e.g. `/users/$userId`) since they require specific parameter values"* ([static prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering)). So `pages` must list `/pt` and `/en` by hand. Second, params are typed `string`, not `'pt' | 'en'`, so the guide's own example adds a `beforeLoad` validity check and a `isLocale()` type guard — runtime validation standing in for a type the file system could have given for free.

### C. Two literal route files — **chosen**

```
src/routes/pt.tsx     →  /pt   →  dist/client/pt.html
src/routes/en.tsx     →  /en   →  dist/client/en.html
src/routes/404.tsx    →  /404  →  dist/client/404.html
```

Each file is a handful of lines that hands its messages to one shared component:

```tsx
// src/routes/pt.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Portfolio } from '~/portfolio/Portfolio'
import { pt } from '~/content/pt'

export const Route = createFileRoute('/pt')({
  component: () => <Portfolio locale="pt" m={pt} />,
})
```

Why it wins:

- **Nothing to enumerate.** Literal paths are static paths, so `autoStaticPathsDiscovery` (default `true`) finds all three. No `pages` block.
- **It lands exactly where ADR-0004 needs it.** With `autoSubfolderIndex: false` the build emits `pt.html`, `en.html` and `404.html` at the output root, which is where `cleanUrls: true` and Vercel's zero-config 404 both look.
- **The page is still written once.** The duplication is the route file, six lines of it.
- **The locale is a literal type at compile time**, with no guard and no validation.

### D. Paraglide-style URL `rewrite` — **rejected**

TanStack's maintained examples use Paraglide's `rewrite: { input: deLocalizeUrl, output: localizeUrl }` so that route files stay unlocalized and the locale is ambient. There is no i18next equivalent of `deLocalizeUrl`/`localizeUrl` — it would be hand-written — and the pattern exists to serve a *server* that resolves locale from cookie or `Accept-Language` per request, which ADR-0004 removed.

Worth recording honestly: **TanStack's officially maintained i18n examples are Paraglide, not i18next** — [`examples/react/i18n-paraglide`](https://github.com/TanStack/router/tree/main/examples/react/i18n-paraglide) and [`examples/react/start-i18n-paraglide`](https://github.com/TanStack/router/tree/main/examples/react/start-i18n-paraglide). There is no first-party i18next example. That is not a reason to switch libraries — §8 argues for no library at all — but it does mean any i18next setup here is assembled from two sets of docs rather than copied from a maintained example.

### Correction to record

`pages` is a **top-level `tanstackStart()` option, a sibling of `prerender`**, not `prerender.pages`:

```ts
tanstackStart({
  prerender: { enabled: true, autoSubfolderIndex: false },
  pages: [{ path: '/my-page', prerender: { enabled: true, outputPath: '/my-page/index.html' } }],
})
```

Option C never needs it, but the shape is easy to get wrong when reading ADR-0001's *"the locale set must be enumerated explicitly"* in isolation.

---

## 3. `<html lang>` — the finding that costs the most if missed

**`head()` cannot set attributes on `<html>`.** [Document head management](https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management) documents exactly five keys — `title`, `meta`, `links`, `styles`, `scripts`. There is no `htmlAttrs`.

So `lang` is JSX in the root `shellComponent`. TanStack's own Paraglide example does precisely this, reaching for an ambient accessor:

```tsx
// examples/react/start-i18n-paraglide/src/routes/__root.tsx
<html lang={getLocale()}>
```

Under option C there is no ambient locale — and the shell sits above the locale route, so it cannot use `Route.useParams()`. It reads the router's location instead:

```tsx
function RootDocument({ children }: { children: React.ReactNode }) {
  const lang = useRouterState({
    select: (s) => (s.location.pathname.startsWith('/en') ? 'en' : 'pt'),
  })

  return (
    <html lang={lang === 'en' ? 'en' : 'pt-BR'}>
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  )
}
```

`useRouterState` inside a `shellComponent` is confirmed working in TanStack's own e2e suite — [`e2e/react-start/spa-mode/src/routes/__root.tsx`](https://github.com/TanStack/router/blob/main/e2e/react-start/spa-mode/src/routes/__root.tsx) selects `isLoading`/`status` in exactly this position.

Note the value: **`pt-BR`, not `pt`**, matching the résumé's audience and today's copy — while the *URL segment* stays the shorter `/pt`. The two are deliberately different and both are right.

The `/404` route falls through this to `pt-BR`. ADR-0004 already decided that page is bilingual, so no single `lang` is correct; `pt-BR` is the better default for a Brazilian portfolio, and per-element `lang` on the English half is the accessible fix. Hands to [the head-and-metadata ticket](https://github.com/viniciusoliveiras/portfolio/issues/13).

---

## 4. SSR initialisation — and why "static" does not excuse a singleton

The ticket asked where a per-request instance hooks into Start's server entry. Two findings.

### The documented hook is `src/server.ts`, wrapping `handler.fetch`

```ts
// the shape, from the Paraglide example
import handler from '@tanstack/react-start/server-entry'
import { someMiddleware } from './middleware'

export default {
  fetch(req: Request): Promise<Response> {
    return someMiddleware(req, () => handler.fetch(req))
  },
}
```

For finer control, [the server entry point guide](https://tanstack.com/start/latest/docs/framework/react/guide/server-entry-point) exposes `createStartHandler(defineHandlerCallback(...))` with `defaultStreamHandler`. Separately, the router itself is created by a **`getRouter()` factory**, not a module-level instance — confirmed across `start-basic`, `start-basic-static` and `start-i18n-paraglide` — which is the natural place to attach a per-render i18n instance to router context.

### Prerendering does not make the singleton hazard go away

This is the non-obvious part. A fully static build still server-renders — at build time — and **`concurrency` defaults to `14`** ("How many prerender jobs to run at once", [static prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering)). A module-level i18next instance mutated by `changeLanguage()` would therefore be raced by `/pt` and `/en` rendering concurrently, in the same build process, producing a nondeterministic mix of languages in the emitted HTML. *(That the jobs share one JS process is inference from the plugin architecture, not a documented statement — but the failure is silent and the mitigation is free, so treat it as true.)*

The failure mode is worse than a server-side one: it bakes into committed-adjacent build output rather than surfacing on a request you can retry.

### If i18next is kept, this is the pattern

Create the instance per render, never at module scope, and never call `changeLanguage`:

```tsx
// src/i18n/createI18n.ts
import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { pt } from '~/content/pt'
import { en } from '~/content/en'

export function createI18n(locale: 'pt' | 'en') {
  const i18n = createInstance()
  i18n.use(initReactI18next).init({
    lng: locale,
    fallbackLng: 'pt',
    resources: { pt: { translation: pt }, en: { translation: en } },
    interpolation: { escapeValue: false }, // React already escapes
    initAsync: false,                      // `initImmediate` was removed in v26
  })
  return i18n
}
```

then `<I18nextProvider i18n={createI18n('pt')}>` inside each locale route's component.

Two notes on the official SSR guidance. [react-i18next's SSR page](https://react.i18next.com/latest/ssr) is written against `i18next-http-middleware` attaching an instance to an Express `req`, with `initialLanguage` + `initialI18nStore` handed to the client via `useSSR`/`withSSR`. Those APIs still ship in v17 — 17.0.10 adjusted their warning wording — but none of the plumbing applies here: with resources bundled and the locale fixed by the route, there is no async load to hydrate around and no store to serialise. Second, react-i18next 17.0.10 added a dev-only `SUSPENDED_WHILE_LOADING` warning before `useTranslation` suspends; synchronous `resources` avoids that path entirely, which is another reason to bundle rather than lazy-load (§7).

---

## 5. The redirect at `/` — already answered, with one addition

The ticket asked whether `/` uses detection or a fixed default. **[ADR-0004](../adr/0004-deployment-target-and-rendering-mode.md) answered it after this ticket was written**: detection happens at Vercel's edge via a `vercel.json` `has` condition on `accept-language`, `permanent: false` (307, not the defaulted 308). The `throw redirect()` mechanism from ADR-0001 is superseded — it needs the server runtime ADR-0004 removed.

**The tie-break the ADR left here: a visitor whose `Accept-Language` matches neither locale — Spanish, French, German — lands on `/pt`.** That is the fall-through rule, and it is the right default: the site's owner is Brazilian, the domain is a personal portfolio, and a non-match is more likely to be a Brazilian browser sending an unusual header than a genuine third-language visitor. It is also self-correcting in one click.

Re-verified today against [`vercel.json`'s redirects reference](https://vercel.com/docs/project-configuration/vercel-json): `permanent` is documented as *"default true"* → 308, confirming ADR-0004's insistence on `false`; `has`/`missing` accept `type` of `header`, `cookie`, `host` and `query`; and `value` may be a `{ pre, suf }` matcher. Also re-confirmed: *"Using `has` does not yet work locally while using `vercel dev`, but does work when deployed."*

**The addition: `type: "cookie"` is supported, so locale persistence is mechanically possible** — a cookie rule ordered before the header rule, with the switcher writing the cookie client-side. §7 recommends against doing it.

---

## 6. Prerender enumeration — the constraint resolves to nothing

ADR-0001 recorded that a locale segment makes prerendering *"no longer fully automatic"*, and ADR-0004 narrowed it: *"That holds only if the locale is a path param."* Option C takes the other branch.

Final prerender config, and it is unchanged from what ADR-0004 already specified:

```ts
tanstackStart({
  prerender: { enabled: true, autoSubfolderIndex: false },
})
```

`autoStaticPathsDiscovery` (default `true`) discovers `/pt`, `/en` and `/404`. ~~Leave `crawlLinks` at its default `true` — it costs nothing here and acts as a net if a future route is ever added behind a link. `filter` is unnecessary.~~ **No `pages` block, no locale list, no drift risk between a hand-maintained array and the route tree.**

> **Corrected 2026-07-29** during implementation. The `pages`/no-enumeration half of this section is right and unchanged. **Both claims about the other two options are wrong**, and one of them was shipping a corrupted file.
>
> **`filter` is necessary, not unnecessary.** The prerenderer seeds its queue with `/` whenever `pages` is empty — `let pages = startConfig.pages.length ? startConfig.pages : [{ path: "/" }]` in `prerender.js`. But [ADR-0004](../adr/0004-deployment-target-and-rendering-mode.md) deliberately makes `/` an edge 307 rather than a route, so the seed 404s and `failOnError` (default `true`) aborts the build. The build cannot succeed without:
>
> ```ts
> filter: (page) => page.path !== "/",
> ```
>
> **`crawlLinks` must be `false`, and its default silently corrupts the résumé PDF.** Link crawling collects every `href` beginning with `/`, which includes `/resume-en.pdf` — linked from the hero and the contact list in both locales. The crawler fetches it and writes the response **as text**: measured, the 40.6 KB PDF came back out at **71,889 bytes with every non-ASCII byte replaced by U+FFFD**, i.e. a corrupted résumé shipped over the good one, from the two most important links on the page.
>
> "It costs nothing here" was the error. The stated benefit — a net for a future route added behind a link — is worth nothing on this site, because **every route here is static and `autoStaticPathsDiscovery` already finds all of them**, so the net catches only things that are not pages. The suite now asserts the emitted PDF is byte-identical to the source.

---

## 7. Resources, the switcher, and persistence

### Bundled, never lazily fetched

Lazy loading is the one option that is disqualified rather than merely worse: fetching a JSON resource at runtime *"would reintroduce a runtime request into a site the IA just made fully static"*, as the ticket itself noted. Bundle both locales' copy at build time.

The consequence differs sharply by approach:

- **With i18next**, `resources` is initialised with both locales, so **every visitor downloads both languages' copy**, on top of the 23.5 KB gzip runtime.
- **With option C's literal routes**, Vite code-splits per route, so `/pt` ships Portuguese only.

### Organisation: one module per locale, not namespaces

Namespaces exist to split large resource sets across lazy loads. There is one page and no lazy loading. **One module per locale**, keyed by the seven sections from ADR-0001:

```ts
// src/content/pt.ts
export const pt = {
  hero: { … }, summary: { … }, experience: { … },
  work: { … }, skills: { … }, education: { … }, contact: { … },
}
export type Messages = typeof pt

// src/content/en.ts
import type { Messages } from './pt'
export const en = { … } satisfies Messages
```

That `satisfies` is the type contract for [the copy ticket](https://github.com/viniciusoliveiras/portfolio/issues/14): a missing English key is a compile error under the ADR-0002 baseline, with no codegen and no i18next `resources.d.ts` module augmentation.

> **Correction, 2026-07-28.** This sketch originally wrote `as const` on `pt` and imported `Messages` from a separate `./types`. Both were wrong, and the first is a hard build failure — `as const` makes every value a string *literal* type, so English can only typecheck by being character-identical to Portuguese. Measured under TypeScript 7.0.2 with the ADR-0002 flags: `Type '"hi"' is not assignable to type '"oi"'` (TS2322). The shape above is the corrected one; see §8 for the full decision, the segment shape for links, and the locale-neutral `facts.ts` split.

### The switcher: `resetScroll={false}` plus a carried hash

The ticket flagged the real risk — one long scrolling page means a naive locale switch dumps the reader back at the hero. [Scroll restoration](https://tanstack.com/router/latest/docs/framework/react/guide/scroll-restoration) documents the fix: *"Use the `resetScroll` option to disable restoration"* — `<Link resetScroll={false}>`, also available on `navigate()` and `redirect()`. *"When `resetScroll={false}`, scroll positions won't be restored for existing history entries or reset to the top for new entries."*

```tsx
const { pathname, hash } = useRouterState({ select: (s) => s.location })
const other = pathname.startsWith('/en') ? '/pt' : '/en'

<Link to={other} hash={hash} resetScroll={false} hrefLang={other.slice(1)}>
  {other === '/en' ? 'English' : 'Português'}
</Link>
```

**This imposes a constraint on three other tickets: section anchor ids must be locale-neutral English slugs** — `#experience`, not `#experiencia` in one locale and `#experience` in the other. Otherwise the carried hash is meaningless across the switch and there is nothing to preserve. Cheap if decided now, invasive if discovered during prototyping.

`resetScroll={false}` preserves the scroll *offset*; because the two locales are the same layout with different text, sections will not land at identical pixel offsets. The hash is what makes it land on the right *section*. Both are needed.

### Persistence: none — recommended

A cookie is possible (§5) and I recommend skipping it. **The URL is the state.** Persistence buys a returning visitor one avoided click, and costs: a client-side cookie write, an extra ordered `vercel.json` rule, a second source of truth that can disagree with the URL, and a new cache-correctness question on top of the `Vary: Accept-Language` risk ADR-0004 already recorded as unresolved. On a two-locale portfolio, that is a bad trade. If it is ever wanted, the mechanism is a `has: [{ type: "cookie", key: "locale", value: "en" }]` rule placed above the header rule.

---

## 8. Decision: no i18n runtime — typed message modules

**Decided 2026-07-28** by [Rule on i18next versus typed message modules](https://github.com/viniciusoliveiras/portfolio/issues/20). This section was written as a recommendation and is now the decision; §8.1 below is the resulting specification, with every compiler claim measured under TypeScript **7.0.2** — the version ADR-0002 pins — using `--strict --noUncheckedIndexedAccess --verbatimModuleSyntax`. `i18next` and `react-i18next` never enter `package.json`.

The argument that got here, retained:

**What i18next is for:** plural rules across locales, context and gender selection, ICU-style interpolation and formatting, namespaces with lazy loading, runtime language detection and switching, a translation-store with fallback chains, and an ecosystem of extractors and TMS integrations.

**What this site is:** seven sections of authored prose in two locales, prerendered to two HTML files, with the locale fixed by the route and no remote data, no dates to format (ADR-0001 dropped `date-fns` with its only consumer), no plurals of consequence, and copy that is authored once and changes when the résumé does.

The overlap is close to empty. Measured against that:

| | i18next + react-i18next | Typed message modules |
| --- | --- | --- |
| Runtime shipped | **23.5 KB gzip** | **0** |
| Copy shipped per visitor | both locales | active locale only (route-split) |
| Missing-key detection | runtime fallback, or generated `resources.d.ts` | **compile error**, via `satisfies` |
| SSR/prerender concurrency hazard | real (§4), needs a per-render instance | none — it is a static import |
| Setup surface | `createInstance`, `initReactI18next`, `I18nextProvider`, init options, a provider in each route | one type, two objects |
| Reading a section's copy | `t('experience.title')` | `m.experience.title` |

The design brief makes the weight argument sharper than it looks: this is a purely typographic, deliberately fast page whose motion budget explicitly excludes scroll reveals *"since they delay exactly what a skimming recruiter came for"*. Shipping a translation engine to serve two frozen dictionaries on that page is the same mistake in a different layer.

**The honest counter-arguments**, since this should be decidable rather than persuaded:

- A third locale, or copy managed outside the repo by a non-developer, would flip this — i18next's ecosystem is the payoff and there is none in a hand-rolled dictionary.
- `<Trans>` is genuinely nice for copy with inline links or emphasis. The workaround is a component-per-string or a small `{ before, link, after }` shape, which is fine for the two or three strings that need it and would get tedious at thirty.
- "It's what I know" is a legitimate reason on a personal project, and the cost of being wrong is one afternoon.

**Cost of reversing later is low in both directions.** The message modules *are* i18next `resources` in shape, so adopting i18next later is `createInstance` plus a provider, with the copy untouched.

**If i18next is kept**, §4 is the spec: per-render `createInstance()`, never a module singleton, never `changeLanguage`, resources bundled synchronously, `initAsync: false`, `interpolation.escapeValue: false`, one `translation` namespace. Nothing else in this document changes — the route shape, the `<html lang>` mechanism, the switcher and the prerender config are all independent of the library question. *(Road not taken as of 2026-07-28; retained for the reversal path.)*

---

## 8.1 The specification

Five decisions, in the order they were taken. Every compiler result below was produced by compiling the case, not inferred.

### a. The contract: pt-BR is canonical

```ts
// src/content/pt.ts
export const pt = { … }              // NO `as const` — see the §7 correction
export type Messages = typeof pt

// src/content/en.ts
import type { Messages } from './pt' // `import`, without `type`, is TS1484
export const en = { … } satisfies Messages
```

| Case | Result |
| --- | --- |
| English omits a key | **TS2741** — property missing |
| English adds a key Portuguese lacks | **TS2353** — object literal may only specify known properties |
| `Messages` imported without `type` | **TS1484** — `verbatimModuleSyntax` is on per ADR-0002 |

**Why one locale rather than a hand-written `Messages`.** A third hand-maintained copy of the key set is the artifact most likely to rot, and with exactly two locales it buys nothing: whichever locale *is* the type gets checked by the other one failing to match. **pt-BR is canonical** because ADR-0004's edge detector sends every non-English visitor to `/pt` — including Spanish and French — so Portuguese is the copy that must never have a hole, and making it the type makes a hole there structurally impossible rather than merely caught.

The consequence for authoring: **Portuguese is written first**, and English cannot silently drift, because adding a key to `en` alone is TS2353.

### b. Delivery: explicit props, sliced per section

The module is a static import, so there is no loader, no async step and no provider. Each locale route imports its own module and hands slices down: `<Experience copy={m.experience} />`. Depth never exceeds two hops (`m.nav` → top bar → drawer).

**Rejected: a React context plus a `useMessages()` hook.** The decider is [the section prototypes](https://github.com/viniciusoliveiras/portfolio/issues/17), not the prop threading — a section whose copy arrives as a typed prop renders standalone against fixture text, while one that reaches into context drags a provider along and cannot be exercised in isolation. Router context was not considered seriously; it exists to thread request-time values.

**The locale tag travels as a sibling prop**, `'pt' | 'en'`, rather than being derived from `pathname`. The switcher needs it for direction and `hrefLang`, and §7's `pathname.startsWith('/en')` snippet is a string-match against routing the route file already knows for certain. Same prototypability argument as above.

### c. Rich text: a segment array, links only

Dropping i18next drops `<Trans>`, and React renders a string as text — so a sentence with a link mid-clause needs a shape. It is a real requirement here, not a hypothetical:

```ts
// a message that carries a link
devex: ['Arquitetura de frontend na ', { text: 'Devex Soluções', href: 'https://…' }, '.']
// segment = string | { text: string; href: string }
```

Rendered by a five-line component in the component layer, so `src/content/` stays plain data with no React import.

| | segment array | rigid `{ before, link, after }` |
| --- | --- | --- |
| English omits the key | TS2741 ✓ | TS2741 ✓ |
| English malforms a segment | TS2353 ✓ | ✓ |
| English silently omits the *link* | **compiles clean** ✗ | TS2741 ✓ |
| Two links in one phrase | yes | no |
| Link at the very start or end | yes | `before: ''` |

The triple is the only shape where a forgotten English link is a compile error, and it was still rejected: it hard-codes "exactly one link with text either side", and the résumé already contains the phrase that breaks it — the **Devex Soluções / Inovasensor** group is two names in one clause. What is lost is link *parity*, whose failure mode is degraded rather than broken — the English sentence still renders in full, minus the anchor. That is a proofreading bug, not a blank section, and the guarantee typed modules were chosen for (missing copy is a compile error) is untouched.

**JSX-valued messages are forbidden**, and `src/content/*.ts` keeps the `.ts` extension. A message typed as `ReactNode` is assignable to any other `ReactNode`, so the moment a message becomes JSX, `satisfies Messages` stops checking it — for exactly the strings most likely to diverge. Plain data also stays importable by a lint or word-count script without a renderer.

**No emphasis segment kind.** Links only; adding `{ em: string }` later is purely additive. This is deliberate friction: it leaves the map's open question of whether the italic `woff2` is used at all — a measured 80 KB, the second-largest asset on the page — genuinely open, and leaning toward deletion.

**`noUncheckedIndexedAccess` does not bite here.** Segments are consumed with `.map()`, never indexed. Verified.

### d. The hard numbers live once, outside the locale modules

The design brief opens each work entry with its figures set large in serif 600, with 12px mono labels beneath. The labels are copy (`módulos` / `modules`); the values are not — `15` is `15` in both languages.

```ts
// src/content/facts.ts — locale-neutral, written once
erp: { figures: { modules: '15', clients: '8', users: '400+' }, from: 2021, to: null }

// src/content/pt.ts — translatable only
erp: { title: '…', prose: [ … ], labels: { modules: 'módulos', clients: 'clientes', users: 'usuários' } }
```

Duplicating `400+` across two locale modules puts it beyond the compiler's reach: two strings of the correct shape, one of them typo'd, and nothing to report. Splitting the values out removes the class of bug entirely.

**Keyed, never positional.** Measured: `figureLabels[0]` and `figures[1]` are both `string | undefined` under `noUncheckedIndexedAccess` (TS2322 at every use site), and index-pairing also tolerates a locale supplying fewer labels than there are figures. Keys make the pairing structural — a missing `users` label in English is TS2741.

Two things stay **per-locale on purpose**:

- **`href`s, including those inside segment arrays.** Where the résumé PDF is served from is still open on the map, and if a pt-BR résumé ever joins `resume-en.pdf`, the download link genuinely differs by language. Keeping hrefs in the locale modules costs nothing and keeps that decision free.
- **The open-ended date word.** `from`/`to` are neutral, but `to: null` renders as `presente` / `present`, and that word is copy.

### e. Files

```
src/content/pt.ts      the canonical module + `export type Messages = typeof pt`
src/content/en.ts      `import type { Messages } from './pt'` + `satisfies Messages`
src/content/facts.ts   locale-neutral keyed figures and from/to
```

`Messages` is exported from `pt.ts`, not a separate `types.ts`: with `typeof pt` as its definition, a types file could only re-export it. The directory is `content/`, not `i18n/` or `messages/`, because after this decision there is no i18n layer — the name should not imply a runtime that was just declined.

Where the segment renderer lives is left to the component layer. The new build's component conventions are not settled anywhere yet, and this decision is not the place to invent them.

---

## 9. What this hands to other tickets

- **[Settle the head and metadata content for both locale routes](https://github.com/viniciusoliveiras/portfolio/issues/13)** — inherits three things. `<html lang>` is `pt-BR` / `en` and lives in the shell, not in `head()` (§3). Reciprocal `hreflang` alternates plus `x-default` belong in each locale route's `head().links`, and `x-default` should point at `/` so it resolves through the edge detector. The bilingual `/404` needs a per-element `lang` on its English half.
- **[Author the site copy for all seven sections, in both locales](https://github.com/viniciusoliveiras/portfolio/issues/14)** — the message-module shape in §7, as corrected, is its deliverable's type contract, and the `satisfies Messages` check is what makes a missing English string a build failure rather than a live blank. §8.1 adds four things it needs before authoring: **Portuguese is written first** (it is the canonical module); its own open question *"is the English a translation or written independently"* narrows to **wording only**, since structure is now compiler-enforced parallel; sentences that want an inline link use the segment array rather than prose-with-a-link-beside-it; and **the figures and role dates leave its scope** for `facts.ts`, so what it authors per work entry is the title, the prose and the three figure *labels*.
- **[Prototype the seven sections within the fixed design system](https://github.com/viniciusoliveiras/portfolio/issues/17)** — **section anchor ids must be locale-neutral English slugs** (§7). This is the one constraint here that is expensive to retrofit.
- **[Decide what animates, and with what](https://github.com/viniciusoliveiras/portfolio/issues/11)** — a locale switch is a route change on a shared layout; if anything animates section entry, it will fire on switch unless guarded. `resetScroll={false}` handles scroll, not animation.
- **[Decide how the mobile drawer's modal primitive is supplied](https://github.com/viniciusoliveiras/portfolio/issues/15)** — the drawer carries the language switcher as well as the four anchors, so its content is one item wider than the design brief's four.
- **[ADR-0004](../adr/0004-deployment-target-and-rendering-mode.md)** — confirmed on the no-enumeration branch of the constraint it recorded. Its `vercel.json`, `prerender` and `cleanUrls` configuration needs no change, and its `permanent: false` and `has`-doesn't-work-under-`vercel dev` findings were both re-verified today.
- **Nothing for** [the Tailwind token layer](https://github.com/viniciusoliveiras/portfolio/issues/16), [the CI workflow](https://github.com/viniciusoliveiras/portfolio/issues/18) or [the migration strategy](https://github.com/viniciusoliveiras/portfolio/issues/19) — and as of the §8 decision, not even a dependency line: `package.json` gains nothing at all from i18n.
