# Next.js → TanStack Start: API map for this repo

Research asset for [Map TanStack Start's routing, data loading, and head handling onto this repo's Next APIs](https://github.com/viniciusoliveiras/portfolio/issues/3), a ticket on [Map: migrate the portfolio to TanStack Start + Tailwind, with a redesign](https://github.com/viniciusoliveiras/portfolio/issues/1).

**All rows checked 2026-07-27** against TanStack's own docs and the `TanStack/router` repo at `main`. Version context from [Target stack: versions and release status](./target-stack-versions.md): Start `1.168.32` (RC), Router `1.170.18`.

The Next surface here is the complete list of what `src/` actually imports — verified by reading every file, not inferred.

## The map

| Next API (as used here) | TanStack Start equivalent | Swap or shape change? | Note |
| --- | --- | --- | --- |
| `next/link` `<Link href>` | `Link` from `@tanstack/react-router`, prop is `to` | **Shape change (small)** | `to` is type-checked against the generated route tree — a typo is a compile error, not a 404 |
| `useRouter().asPath` in `ActiveLink` | `Link`'s own `activeProps` / `activeOptions` / `data-status="active"` | **Shape change — the component is deleted** | Start solves this natively; `ActiveLink` has no successor |
| file-based routing over `src/pages/` | file-based routing over `src/routes/` + generated `routeTree.gen.ts` | **Shape change** | Every route file exports `Route = createFileRoute('/path')({...})`; codegen is not optional |
| `src/pages/404.tsx` | `notFoundComponent` on the root route | **Shape change** | Not a route file — a route *option*. No `404.tsx` exists |
| `getStaticProps` (data) | route `loader` + `Route.useLoaderData()` | **Shape change** | Loader result is not props; it's read by hook |
| `getStaticProps` (build-time HTML) | `prerender: { enabled: true }` in `tanstackStart()` | **Shape change, but automatic** | `autoStaticPathsDiscovery` finds all four static pages with no per-route config |
| `revalidate: 604800` | **no equivalent** — `headers: () => ({ 'Cache-Control': ... })` | **Shape change, and a real decision** | Start has no revalidate counter; ISR is done with CDN cache headers. See [Consequences](#consequences) |
| `next/head` in `_app.tsx` | `head: () => ({ title, meta, links, scripts })` route option + `<HeadContent />` | **Shape change** | Declarative object, not JSX children |
| `next/document` (`Html`/`Head`/`Main`/`NextScript`) | `shellComponent` on the root route | **Shape change, near-mechanical** | You hand-write `<html><head><HeadContent/></head><body>{children}<Scripts/></body></html>` |
| `next/app` `AppProps` + provider wrapper | root route's `component` (wraps `<Outlet />`) | **Like-for-like in spirit** | The Chakra provider slot becomes… nothing, if Tailwind replaces Chakra |
| `redirects()` in `next.config.js` | `throw redirect({ to: '/home' })` in `beforeLoad` on `routes/index.tsx` | **Shape change** | The redirect becomes application code in a real route file |
| `import '../styles/global.css'` | identical — bare side-effect import | **Like-for-like** | Explicitly supported and SSR-discovered. `?url` + `head().links` is the alternative, not the requirement |

## Per-item detail

### 1. Route definition

Routes live in `src/routes/`, and the filename-to-URL table is close enough to `src/pages/` to be uninteresting: `about.tsx` → `/about`, `index.tsx` → `/`, `$param.tsx` for dynamic segments, `$.tsx` for wildcards ([routing](https://tanstack.com/start/latest/docs/framework/react/guide/routing), checked 2026-07-27). This repo has no dynamic segments at all, so that half of the conventions is dead weight here.

What *is* new is that a route file is not just a default-exported component. Each one exports a `Route`:

```tsx
export const Route = createFileRoute('/posts/$postId')({
  component: PostComponent,
})
```

The path string is "automatically written and managed by the router for you via the TanStack Router Bundler Plugin," and `routeTree.gen.ts` is regenerated on every route add/move/rename. That generated file is what makes `to="/about"` type-safe — it's load-bearing, must be committed or generated in CI, and is a new thing to have an opinion about in the Biome config (ignore it) and in `.gitignore` (probably don't).

**`__root.tsx` is mandatory** and has no path — it is always matched and its component always renders. It is the merge point for what `_app.tsx` and `_document.tsx` do today, plus the 404.

**404.** There is no not-found *route*. `src/pages/404.tsx` becomes a `notFoundComponent` option, most simply on the root route ([not-found errors](https://tanstack.com/router/latest/docs/framework/react/guide/not-found-errors), checked 2026-07-27):

```tsx
export const Route = createRootRoute({
  notFoundComponent: () => <NotFound />,
})
```

`notFoundMode` defaults to `'fuzzy'` (nearest route with a `notFoundComponent` wins); `'root'` forces everything to the root handler. For a four-page portfolio with one 404 design, root-level is the answer and `notFoundMode` never needs touching. `notFound()` can also be thrown from a loader, which this repo has no use for. The existing 404 page's content ports as-is — it's pure presentation plus a link home.

### 2. Data loading

Two of the six pages fetch: `home.tsx` (two most-recently-updated repos) and `about.tsx` (the GitHub bio). Both use `getStaticProps` with `revalidate: 604800`.

**The data half is a straightforward loader** ([data loading](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading), checked 2026-07-27). `loader` receives `{ params, context, abortController, deps, location, preload, route }` and the component reads the result via `Route.useLoaderData()` rather than props. Client-side cache knobs are `staleTime` (default `0`) and `gcTime` (default 30 min) — these govern the *client* router cache, not the CDN, and shouldn't be confused with `revalidate`.

**Whether to wrap the fetch in a server function is a genuine choice.** `createServerFn().handler(...)` gives a same-origin RPC endpoint that keeps server capability private ([server functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions), checked 2026-07-27). But the GitHub calls here are unauthenticated reads of public data with no secret to hide, so a plain `fetch` in the loader is defensible and simpler. This feeds [Specify GitHub API fetching with fetch, replacing axios](https://github.com/viniciusoliveiras/portfolio/issues/10).

**Static prerendering is available, and it's the easy part** ([static prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering), checked 2026-07-27):

```ts
tanstackStart({
  prerender: { enabled: true },  // default false
})
```

`autoStaticPathsDiscovery` (default `true`) discovers all static paths automatically, excluding only routes with path params, layout routes (`_`-prefixed), and componentless routes. **Every page in this repo is a static path**, so `enabled: true` is the entire configuration — no `pages` array needed. `crawlLinks` (default `true`) is belt-and-braces here since the nav links every page anyway. Other knobs: `concurrency: 14`, `retryCount: 2`, `failOnError: true`, `maxRedirects: 5`, `filter`, `onSuccess`, `autoSubfolderIndex`.

Prerendering produces HTML, which means route loaders necessarily execute at build time and the GitHub responses get baked in — *the docs don't say this in so many words, but generating the HTML cannot happen without running the loader.* So the build-time-fetch behaviour of `getStaticProps` is fully reproducible.

There is also an **experimental** `staticFunctionMiddleware` for server functions ([static server functions](https://tanstack.com/start/latest/docs/framework/react/guide/static-server-functions), checked 2026-07-27): results are cached with the build output as static JSON under a function-ID+payload-hash key, embedded in the prerendered HTML, and later invocations become a `fetch` of that JSON. It's the closer structural analogue to `getStaticProps` — and its experimental status plus "ensure `staticFunctionMiddleware` is the final middleware" caveat make it the wrong default for two trivial GET requests. Prerendering alone covers this repo.

**`revalidate` has no counterpart, and this is the one item that isn't a mapping exercise.** Start does ISR with standard HTTP cache headers, not a framework revalidation clock ([ISR](https://tanstack.com/start/latest/docs/framework/react/guide/isr), checked 2026-07-27) — "TanStack Start's approach to ISR is flexible and leverages standard HTTP cache headers that work with any CDN." The route-level API is a `headers()` option, and the docs give Vercel its own snippet verbatim:

```tsx
export const Route = createFileRoute('/posts/$id')({
  headers: () => ({
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
  }),
})
```

So `revalidate: 604800` resolves one of two ways, and it is a decision, not a translation:

- **Prerender only** — data is frozen at build time and refreshes on deploy. For a bio and two repo names this is arguably correct, and it makes the site fully static with no server.
- **SSR + `headers()`** — `'public, s-maxage=604800, stale-while-revalidate=86400'` reproduces weekly revalidation semantics, at the cost of needing a server runtime.

This is direct input to [Choose the deployment target and rendering mode](https://github.com/viniciusoliveiras/portfolio/issues/9), which is where it should be settled.

### 3. Head / metadata

`next/head`'s JSX children become a declarative object returned from a `head()` route option, rendered by `<HeadContent />` ([document head management](https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management), checked 2026-07-27):

```tsx
{
  title?: string
  meta?: Array<{ name?: string; property?: string; content?: string }>
  links?: Array<{ rel: string; href: string }>
  styles?: Array<{ media?: string; children: string }>
  scripts?: Array<{ src?: string; children?: string }>
}
```

`property` is in the type, so `_document.tsx`'s `og:*` and `twitter:*` tags port directly. Dedupe is by `name`/`property` with **last nested occurrence winning**, which means per-page titles and descriptions Just Work by declaring `head()` on the page route — an improvement over today, where the title is hardcoded once in `_app.tsx` for all six pages.

**`_document.tsx`'s job goes to `shellComponent`.** This is the current canonical shape, from `examples/react/start-basic/src/routes/__root.tsx` at `main` (checked 2026-07-27):

```tsx
export const Route = createRootRoute({
  head: () => ({ meta: [...], links: [...], scripts: [...] }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

`shellComponent` "is always SSRed and is wrapping around the root `component`, the root `errorComponent` or the root `notFound` component respectively" ([selective SSR](https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr), checked 2026-07-27) — so the shell survives even when a route opts out of SSR. Note the routing guide's own example still shows the shell under `component`; both work, but `shellComponent` is the dedicated slot and what the maintained examples use. **Prefer `shellComponent`.**

`<Scripts />` replaces `NextScript`; `<Main />` becomes `{children}` (in the shell) or `<Outlet />` (in the root `component`). `Html`/`Head` become literal `<html>`/`<head>` tags — you own the document.

Everything currently in `_app.tsx`'s and `_document.tsx`'s heads is a `head()` entry on the root route: the title, the jsDelivr `devicon` stylesheet, `/manifest.json`, the Google Fonts preconnect + Heebo stylesheet, the favicon, `apple-touch-icon`, `theme-color`, and the primary/OG/Twitter meta. Two of those are worth separate scrutiny rather than blind porting — the jsDelivr `devicon` CSS and the Google Fonts link are third-party render-blocking requests — but that belongs to the asset-strategy fog, not here.

### 4. Redirects

There is no config file to put `/` → `/home` in. `redirect()` is thrown from `beforeLoad` or `loader` ([redirect](https://tanstack.com/router/latest/docs/framework/react/api/router/redirectFunction), checked 2026-07-27):

```tsx
// src/routes/index.tsx
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/home' })
  },
})
```

`to` for internal paths, `href` for external, and `throw: true` returns-vs-throws. Prerendering follows redirects up to `maxRedirects: 5`, so this survives a static build.

Worth saying plainly: this redirect exists only because the home page lives at `/home` instead of `/`. Under TanStack Start the idiomatic move is to make the home page `routes/index.tsx` and delete the redirect entirely. Whether `/home` survives is [Settle the information architecture](https://github.com/viniciusoliveiras/portfolio/issues/5)'s call — but if it doesn't, this row of the map disappears rather than getting ported. A host-level redirect (`vercel.json`) is the third option and only worth it to preserve inbound links to `/home` after an IA change.

### 5. Active-link detection

`ActiveLink.tsx` — `useRouter().asPath`, a `shouldMatchExactHref` flag, prefix matching, and `cloneElement` to inject a colour — is **entirely redundant** under TanStack Start. `Link` does this natively ([navigation](https://tanstack.com/router/latest/docs/framework/react/guide/navigation), checked 2026-07-27):

```tsx
<Link to="/about" activeProps={{ className: 'font-bold' }}>Sobre</Link>
```

Three mechanisms, any of which suffices:

- `activeProps` / `inactiveProps` — styles merge, other props override.
- `data-status="active"` on the rendered element when active — pairs perfectly with a Tailwind `data-[status=active]:` variant, which is likely the cleanest fit here.
- children-as-function receiving `{ isActive }`.

`activeOptions` covers the `shouldMatchExactHref` flag: `{ exact, includeHash, includeSearch, explicitUndefined }`. Default matching is prefix-based with search params included — the same default `ActiveLink` hand-rolls. `useMatchRoute()` / `<MatchRoute>` exist for matching outside a `Link`, and `useLocation({ select: (l) => l.pathname })` is the literal `asPath` replacement ([useLocation](https://tanstack.com/router/latest/docs/framework/react/api/router/useLocationHook), checked 2026-07-27) — but needing either here would mean the migration went wrong.

**Net: `ActiveLink.tsx` is deleted, and `NavLink.tsx` collapses into a thin Tailwind-styled `Link`.** Also note the deep import `next/dist/client/router` — a Next internal that was never a public API — goes away with it.

### 6. Global CSS imports

`_app.tsx`'s three side-effect imports (`styles.css`, `global.css`, and Chakra's theme via provider) are the least disrupted part of the migration. Start documents a three-way choice ([CSS styling](https://tanstack.com/start/latest/docs/framework/react/guide/css-styling), checked 2026-07-27) — "TanStack Start supports the CSS patterns your bundler supports, and adds SSR-aware route asset discovery on top":

| Pattern | SSR behavior | Production features |
| --- | --- | --- |
| `import css from './app.css?url'` | rendered from `head().links` | dynamic Early Hints |
| `import './global.css'` | discovered from the Start manifest for matched routes | static Early Hints, `transformAssets`, CSS inlining |
| `import styles from './card.module.css'` | discovered from the Start manifest for matched routes | static Early Hints, `transformAssets`, CSS inlining |

So **bare side-effect imports are a like-for-like swap** and keep more production features (CSS inlining, `transformAssets` CDN rewriting) than the `?url` route. The `?url` + `head().links` form is what the Tailwind integration guide and `start-basic` example happen to show ([tailwind integration](https://tanstack.com/start/latest/docs/framework/react/guide/tailwind-integration), checked 2026-07-27):

```tsx
/// <reference types="vite/client" />
import appCss from '../styles/app.css?url'

head: () => ({ links: [{ rel: 'stylesheet', href: appCss }] })
```

Either is correct. Given Tailwind v4 collapses everything into one entry stylesheet with `@import 'tailwindcss'`, the question is nearly moot — there will be roughly one CSS file, not three.

For completeness, the Tailwind wiring is `@tailwindcss/vite` in the plugin list. From `examples/react/start-basic/vite.config.ts` at `main`:

```ts
plugins: [
  tailwindcss(),
  tanstackStart({ srcDirectory: 'src' }),
  viteReact(),
  nitro(),
]
```

Note `nitro()` from `nitro/vite` — consistent with the Vercel finding in [Target stack: versions and release status](./target-stack-versions.md).

## Consequences

Ordered by how much they change the plan.

1. **`revalidate: 604800` is the only item without an equivalent.** It becomes either "prerender and refresh on deploy" or "SSR + `Cache-Control: s-maxage`". This is a rendering-mode decision and belongs to [Choose the deployment target and rendering mode](https://github.com/viniciusoliveiras/portfolio/issues/9), not to a mechanical port.

2. **Three files are deleted rather than migrated.** `_document.tsx` → a `shellComponent` function; `404.tsx` → a route *option*; `ActiveLink.tsx` → nothing at all. `NavLink.tsx` shrinks to near-nothing. That is a meaningful slice of the ~1,584 lines gone before any redesign work starts.

3. **Nothing in the Next surface is a blocker.** No `next/image` (never used), no `next/font`, no middleware, no API routes, no dynamic routes, no ISR-on-dynamic-params. Every one of the eight APIs has a documented answer. The migration risk lives in Chakra→Tailwind and the redesign, not in the framework swap.

4. **Prerendering is one line.** `prerender: { enabled: true }` plus `autoStaticPathsDiscovery` covers all six pages with no per-route configuration, because the repo has zero dynamic segments.

5. **`routeTree.gen.ts` is new surface to have opinions about** — Biome ignore, `.gitignore` (commit it), and a CI step if not committed. Feeds [Fix the Biome ruleset and the TypeScript compiler baseline](https://github.com/viniciusoliveiras/portfolio/issues/7).

6. **Per-page `head()` is a capability the current site lacks.** Today one hardcoded title serves all six pages. Start makes per-page titles and descriptions the default path, which the IA and SEO-parity work should assume rather than treat as a stretch goal.

## Newly sharp questions

Recorded here for the map, not answered here.

- **Does the home page move to `/`?** If IA keeps `/home`, the redirect ports as a `beforeLoad` throw; if it moves to `routes/index.tsx`, the redirect is deleted and only an inbound-link-preservation redirect might remain. → [Settle the information architecture](https://github.com/viniciusoliveiras/portfolio/issues/5).
- **Server function or plain `fetch` in the loader?** No secret to protect, so plain `fetch` is the leaning. → [Specify GitHub API fetching with fetch, replacing axios](https://github.com/viniciusoliveiras/portfolio/issues/10).
- **Prerender-only, or SSR with cache headers?** The `revalidate` successor. → [Choose the deployment target and rendering mode](https://github.com/viniciusoliveiras/portfolio/issues/9).
- **Do the jsDelivr `devicon` stylesheet and the Google Fonts link survive as `head().links`, or get replaced?** Both are third-party render-blocking requests being ported by reflex. Belongs to the asset-and-image fog on the map.

## Sources

All checked 2026-07-27.

- [Routing | TanStack Start React Docs](https://tanstack.com/start/latest/docs/framework/react/guide/routing)
- [Static Prerendering | TanStack Start React Docs](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering)
- [Incremental Static Regeneration (ISR) | TanStack Start React Docs](https://tanstack.com/start/latest/docs/framework/react/guide/isr)
- [Server Functions | TanStack Start React Docs](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions)
- [Static Server Functions | TanStack Start React Docs](https://tanstack.com/start/latest/docs/framework/react/guide/static-server-functions)
- [Selective Server-Side Rendering (SSR) | TanStack Start React Docs](https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr)
- [CSS Styling | TanStack Start React Docs](https://tanstack.com/start/latest/docs/framework/react/guide/css-styling)
- [Tailwind Integration | TanStack Start React Docs](https://tanstack.com/start/latest/docs/framework/react/guide/tailwind-integration)
- [Document Head Management | TanStack Router React Docs](https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management)
- [Not Found Errors | TanStack Router React Docs](https://tanstack.com/router/latest/docs/framework/react/guide/not-found-errors)
- [Data Loading | TanStack Router React Docs](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading)
- [Navigation | TanStack Router React Docs](https://tanstack.com/router/latest/docs/framework/react/guide/navigation)
- [redirect function | TanStack Router React Docs](https://tanstack.com/router/latest/docs/framework/react/api/router/redirectFunction)
- [useLocation hook | TanStack Router React Docs](https://tanstack.com/router/latest/docs/framework/react/api/router/useLocationHook)
- `examples/react/start-basic/src/routes/__root.tsx` and `vite.config.ts`, [TanStack/router](https://github.com/TanStack/router) at `main`
