# ADR-0004: Deployment target and rendering mode

- **Status**: Accepted
- **Date**: 2026-07-27
- **Resolves**: [Choose the deployment target and rendering mode](https://github.com/viniciusoliveiras/portfolio/issues/9), on [the migration map](https://github.com/viniciusoliveiras/portfolio/issues/1)
- **Supersedes in part**: [ADR-0001](0001-information-architecture.md)'s `throw redirect()` mechanism for `/`

## Context

The ticket framed this as the load-bearing decision the data-fetching and routing specs hang off: Next 10's `getStaticProps` on Vercel meant "static HTML, GitHub data frozen at build time", and TanStack Start being a server framework meant that assumption had to be made deliberately again.

**Three of the ticket's six questions were already void when it was opened.** [ADR-0001](0001-information-architecture.md) cut the contribution calendar and the recent-projects strip, the only two consumers of `src/services/api.ts`. With them went the site's entire remote-data surface. So "how does the site rebuild when the GitHub data goes stale", "what's the caching layer for SSR", and "does anything need to be a server-only secret" have no subject. There is no data, no HTTP client, no form, and no secret. The site is seven sections of typography.

What remained was genuinely open: **which host, whether a server runtime exists at all, and — because a static site cannot read a request header — how `/` chooses a locale.**

Four facts, checked 2026-07-27, decided it.

**Vercel's TanStack Start path is broken, in both directions.** [TanStack/router#6562](https://github.com/TanStack/router/issues/6562) — opened 31 Jan 2026, still open, last activity 1 Mar 2026 — reports that Nitro's Vercel *web* entry does `req.runtime = { name: 'vercel', vercel: { context } }`, clobbering the `runtime.node = { req, res }` srvx had set. `renderRouterToStream` then crashes on `this.runtime.node.req`:

```
TypeError: Cannot destructure property 'req' of 'this.runtime.node' as it is undefined.
    at get _abortController (srvx/dist/adapters/node.mjs:207:13)
```

This fires **at build time during prerender and at request time during SSR**. A workaround exists (`nitro({ preset: 'vercel', vercel: { entryFormat: 'node' } })`) and the one-line upstream fix — merge into `req.runtime` instead of replacing it — is sitting unmerged in the thread. The first commenter's advice was *"disable prerender when deploying to Vercel"*, which is the opposite of this site's plan. [Pin the target stack versions](https://github.com/viniciusoliveiras/portfolio/issues/2) had already flagged that `nitro/vite` is the path Vercel needs and that its own docs call it *"still under active development"*; this is that risk arriving.

**But none of it is a reason to leave Vercel, because a prerendered build needs no adapter.** Start's static-generation docs deploy `dist/client` directly — their own examples are `netlify deploy --dir=dist/client` and `aws s3 sync dist/client s3://…`. No Nitro, no server bundle, no preset. [TanStack/router#5149](https://github.com/TanStack/router/issues/5149) ("enabling prerender stops the server bundle being emitted", open, `revisit-after-rc`) stops being a bug and becomes the intended outcome.

**Vercel can detect a locale at the edge with no runtime.** `vercel.json` `redirects` accept `has` conditions of `type: "header"`, with `value` as a string or a `{ pre, suf }` matcher. Vercel's own documented example is locale-shaped — `x-vercel-ip-country: GB` → `/uk/…`.

**Cloudflare was evaluated and declined.** Its free tier is better on paper — Workers free is 100,000 requests/day, and *"requests to static assets are free and unlimited"*. But the tidy redirect is unavailable there: `_redirects` documents conditional redirects as **not supported** (❌ by country, ❌ by cookie/header), and `http.request.accepted_languages` is documented as *"only available in Transform Rules"*, not Redirect Rules — and those rules live in the Cloudflare dashboard, outside version control. The remaining option is a Worker with `run_worker_first: ["/"]`: in-repo and effectively free, but a runtime to own where Vercel needs a JSON block. Since the Nitro bug only bites the server path, static output dodges it on either host, so the choice came down to migration cost and DX — and the incumbent wins both.

## Decision

**Vercel, fully prerendered to static output, with no server runtime.**

`prerender: { enabled: true }` in `tanstackStart()`. The build emits `dist/client`; Vercel serves it as static files. `nitro/vite` is never installed, so #6562 cannot reach this project and neither can the next Nitro-preset regression. Vercel's git integration is unchanged: production on `main`, preview per branch. Preview deployments carry `X-Robots-Tag: noindex` automatically — the documented exception is a custom domain assigned to a non-production branch, which this project will not have.

### Vercel's framework auto-detection must be overridden

Vercel detects TanStack Start and fills in Nitro-shaped build settings, which would reintroduce exactly what this ADR removes. The project must declare its own:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "outputDirectory": "dist/client"
}
```

and the Framework Preset must not be left as the auto-detected TanStack Start. `vercel.json`'s `framework` property overrides the dashboard setting; `null` selects "Other".

**This is the easiest line in the deployment config to omit**, and omitting it fails in the most confusing way available — a green build that deploys a Nitro server nobody asked for.

### `/` picks a locale at the edge, in `vercel.json`

```json
{
  "redirects": [
    {
      "source": "/",
      "has": [{ "type": "header", "key": "accept-language", "value": { "pre": "en" } }],
      "destination": "/en",
      "permanent": false
    },
    { "source": "/", "destination": "/pt", "permanent": false }
  ]
}
```

First rule wins for an `en`-preferring browser; everything else falls through to `/pt`. A `pt-BR,pt;q=0.9,en;q=0.8` browser does not match the `en` prefix and lands on `/pt`, correctly.

**`permanent: false` is load-bearing.** Vercel's default is `permanent: true`, which is a **308** — cached by the browser indefinitely. A 308 on `/` would freeze a visitor's locale on first visit, permanently, with no way to correct it short of them clearing their cache. It must be 307.

Note also: `has` conditions do not work under `vercel dev` locally, only when deployed. Documented, and a source of false "it's broken" reports.

### 404 is a single bilingual page

```json
{ "cleanUrls": true }
```

with `prerender: { autoSubfolderIndex: false }`.

Vercel serves a custom 404 zero-config **if and only if `404.html` sits at the output root**; renaming it requires the legacy `routes` API with a `status: 404` fallback. Start will not produce that file by default — `notFoundComponent` is a route *option*, not a path, so the prerenderer has nothing to render — and with `autoSubfolderIndex: true` (the default) a `/404` route emits `dist/client/404/index.html`, which is not where Vercel looks.

Turning `autoSubfolderIndex` off emits `pt.html`, `en.html` and `404.html` at the root; `cleanUrls: true` then serves `/pt` from `pt.html`. No `routes` rules needed.

The spec therefore needs **a real `/404` route**, sharing its component with the root route's `notFoundComponent`. Both are required and they catch different failures: `notFoundComponent` handles a bad client-side navigation, `404.html` handles a cold HTTP request to a URL that isn't in the build.

The page is bilingual — the surviving 404 joke in pt-BR alongside its English counterpart. Vercel's zero-config path serves exactly one `404.html` and cannot know the visitor's locale; localising it would mean three-plus legacy `routes` rules to translate a page nobody should reach. On a deliberately bilingual portfolio, both languages on one page reads as intentional.

### Node is pinned in Vercel's Project Settings, not in `package.json`

Vercel maps `engines.node` ranges to the newest **available** major — its own table shows `>=20.0.0` → *latest 24.x*. [ADR-0003](0003-package-manager-and-node-baseline.md)'s `">=22.13.0"` therefore resolves to 24.x today, matching `.nvmrc`'s `24.18.0` by luck rather than design. The day Vercel adds 26.x, the build floats to Node 26 while `.nvmrc` still says 24 — drift with no commit behind it.

Pin **24.x** in Vercel's Project Settings. ADR-0003 deliberately made `engines` a floor that never needs editing; this keeps that intact and puts the host-specific pin where it belongs.

### Vercel cannot install this project without an `installCommand` override

```json
{ "installCommand": "npm i -g pnpm@11 && pnpm install --frozen-lockfile" }
```

**Vercel's supported pnpm versions are 6, 7, 8, 9 and 10** (package-managers doc, updated 2026-07-01). Not 11. It selects the version by reading `lockfileVersion` out of `pnpm-lock.yaml`, and its documented fallback when nothing matches is **pnpm 6**.

pnpm 11 writes a **multi-document** `pnpm-lock.yaml` — an env-lockfile document carrying `configDependencies` integrity and `packageManagerDependencies`, then the project lockfile. Third-party parsers are already failing on that shape ([dependabot-core#14919](https://github.com/dependabot/dependabot-core/issues/14919), `dependency_file_not_parseable`). The Vercel version of the failure was reported on 25 May 2026: Vercel fell back to pnpm 9 and died with `ERROR packages field missing or empty`, because pnpm 9 cannot read a v11 `pnpm-workspace.yaml`.

That is precisely ADR-0003's stack — pnpm 11.17.0, every setting in `pnpm-workspace.yaml`, `allowBuilds: { lefthook: true }`, no `.npmrc`.

The community fix is `ENABLE_EXPERIMENTAL_COREPACK=1` plus a `packageManager` field. **Rejected**: it reintroduces Corepack, which ADR-0003 went out of its way to eliminate and which does not exist in Node 25+, so it is borrowed time tied to Vercel's build image — and it adds a second version pin to keep in sync with `devEngines`.

The override instead installs any pnpm 11 and lets `devEngines.packageManager` plus `pmOnFail: download` correct to the pinned `11.17.0`. Single source of truth preserved, no Corepack, one line, **deletable the day Vercel's table lists pnpm 11**.

> **Corrected 2026-07-29**, by the first real preview build of the `rebuild` branch. **The command as written above does not work**, and the reason is not the one this section anticipated: `npm i -g pnpm@11` succeeds, but the `pnpm` that then runs is *not* the one it just installed. Vercel's build image resolves `pnpm` to its own earlier-on-`PATH` copy, which fails on the pnpm 11 lockfile with
>
> ```
> ERR_PNPM_BROKEN_LOCKFILE  The lockfile at "/vercel/path0/pnpm-lock.yaml" is broken:
> expected a single document in the stream, but found more
> ```
>
> — a single-document YAML parser meeting the two-document lockfile this ADR correctly predicted (`---` at lines 1 and 199; pnpm 11.18.0 reads it without complaint). Vercel's own CLI also logs `Error while parsing config file: "/vercel/path0/pnpm-lock.yaml"` one line earlier, which is the same incompatibility seen from the host's side.
>
> So the failure mode this section describes is real, but the mitigation was one step short: installing the right pnpm is not enough if the wrong one is what gets invoked. The command must name the binary it just installed rather than trusting `PATH`:
>
> ```json
> "installCommand": "npm i -g pnpm@11 && P=\"$(npm prefix -g)/bin/pnpm\" && \"$P\" --version && \"$P\" install --frozen-lockfile"
> ```
>
> The `--version` is deliberate and stays: it prints which pnpm actually ran into the build log, so the next person debugging an install does not have to infer it from a YAML parser error. Everything else about the decision stands — still no Corepack, still one line, still deletable the day Vercel's table lists pnpm 11.

### CI lints and typechecks; Vercel builds

CI runs `biome check` and `tsc --noEmit`, and does not build. ADR-0003 already defined `build` as `vite build && tsc --noEmit` in that order, so Vercel's build *is* the authoritative typecheck against a freshly generated route tree, and a failed build blocks the deploy and surfaces as a failed check on the PR. CI is the fast pre-check and the net for anything that bypassed Lefthook's pre-commit hook.

Detail belongs to [Specify the CI workflow](https://github.com/viniciusoliveiras/portfolio/issues/18); this ADR fixes only its scope.

### No cache-header configuration

Static files are *"automatically cached on Vercel's global network for the lifetime of the deployment after the first request"*, and hashed filenames let cached values persist across deployments, with `max-age=N, immutable` to the browser. No `headers` block. The only scenario that would need one is fonts served unhashed from `public/`, which belongs to the map's asset-strategy patch.

> **Resolved 2026-07-28 — it does need one, for the fonts and nothing else.** Vercel's static default is `public, max-age=0, must-revalidate`, so both preloaded `woff2` files spend a conditional request on every visit, on the render-blocking path. `vercel.json` gains a single `headers` entry giving `/fonts/(.*)` `max-age=31536000, immutable`, with the rule that changing a font means changing its filename. `favicon.svg`, `og.png`, `robots.txt` and `resume-en.pdf` keep the revalidating default on purpose. See [the favicon spec](../research/favicon-and-asset-serving.md) §5.

## Consequences

**ADR-0001's `throw redirect()` for `/` is superseded.** It requires the server runtime this ADR removes, and under prerendering it is worse than unavailable: `maxRedirects: 5` means the prerenderer *follows* redirects, so `/` would take `/pt`'s HTML — two URLs serving identical content and no detection at all. (The prerender docs do not state redirect behaviour explicitly; this is inference from `maxRedirects`. Either branch is disqualifying.)

**ADR-0001 deferred "detected or fixed default" to the i18n ticket; it is now answered.** Detection happens, at the edge, for free. What remains for [the i18next setup](https://github.com/viniciusoliveiras/portfolio/issues/12) is only the tie-break: which locale a Spanish or French visitor gets. Under the rule above they land on `/pt`.

**The i18n ticket inherits a prerender constraint.** ADR-0001 recorded that a locale segment makes prerendering no longer fully automatic. That holds only if the locale is a path param: literal `/pt` and `/en` route files stay inside `autoStaticPathsDiscovery`, while a `$locale` param requires `pages` to enumerate both. Route shape is that ticket's call; this one records the consequence either way.

**The migration-strategy fog patch is now specifiable.** Its stated blocker was "still depends on where it deploys". Graduated to [Decide the migration strategy and cutover order](https://github.com/viniciusoliveiras/portfolio/issues/19), which inherits three concrete cutover steps: the 736-file `.yarn/` deletion, the optional `git filter-repo` purge ADR-0003 flagged as a separate deliberate act, and the Vercel project's build-settings change from Next.js to static output.

**One risk recorded rather than resolved.** Vercel's cacheable-response criteria explicitly include **307**, and this redirect varies by `Accept-Language`. Config-level redirects are evaluated in the routing layer, which should mean per-request, but the docs do not say so plainly. If a Portuguese visitor is ever served a cached `→ /en`, the mitigation is `Vary: Accept-Language` on `/`. Verify at implementation.

**Two escape hatches, both cheap.** If Vercel ships pnpm 11 support, delete the `installCommand`. If #6562 is fixed and SSR ever becomes desirable, the Nitro path reopens — but nothing in the current spec wants it.

### ADR numbering

This takes `0004`. The design brief was promoted to [ADR-0005](0005-visual-direction.md) on 2026-07-29 by [Assemble the deliverable](https://github.com/viniciusoliveiras/portfolio/issues/22), which this line correctly anticipated. It is the last ADR the migration effort produces; the sheet primitive, the cutover plan and the message-module decision were all considered and declined, on the ground that reversing them invalidates no other document.
