# Migration strategy and cutover order

Resolves [Decide the migration strategy and cutover order](https://github.com/viniciusoliveiras/portfolio/issues/19). Decided 2026-07-28.

**ADR-shaped, deliberately unnumbered.** By the test [Assemble the deliverable](https://github.com/viniciusoliveiras/portfolio/issues/22) records — *a document that declines a named alternative for a stated reason is an ADR* — this qualifies: it declines in-place refactoring, declines a parallel Vercel project, and declines `git filter-repo`. But that ticket owns which documents take which numbers, so this one is registered there as a candidate rather than claiming `0005` unilaterally.

---

## 1. Decisions

| Question | Decision |
| --- | --- |
| Greenfield or in-place | **Greenfield.** No argument remains for in-place |
| Mechanism | **Orphan branch** in the same repo |
| How it becomes `main` | **Force-push, replacing `main`** |
| Chakra / Tailwind coexistence | **None.** The switch is atomic |
| `.yarn/` deletion | **No deletion commit.** An orphan branch never creates it |
| `git filter-repo` | **Not performed.** Made redundant by the force-push |
| Vercel project | **Same project, build settings changed *before* the push** |
| Old URLs | **308 all four to `/`** |
| Custom domain | **After** the cutover, as a separate later event — `viniciusoliveiras.com`, done 2026-07-31 |

### Greenfield needed no arguing

ADR-0001 collapses four pages into one. The design brief changes the palette, both typefaces, the breakpoints and the layout, so nothing in `src/styles/` survives. ADR-0002 rewrites the tsconfig rather than migrating it and replaces ESLint plus Prettier with Biome. ADR-0003 replaces Yarn Berry with pnpm. ADR-0004 replaces Next with TanStack Start on static output. Of the current 27 files in `src/`, the API map already found that three are deleted rather than migrated and the dependency verdicts found two more are dead code.

There is no in-place path through that. And because the switch is atomic, **Chakra and Tailwind never coexist** — the question only arises for an incremental port, which this is not.

### The orphan branch inverts the whole deletion inventory

Four decisions handed this ticket a list of deletions: `public/manifest.json` and `public/icons/` (head and metadata), `public/images/avatar.svg` (section layouts), `images/vercel-icon-dark.svg` (an already-orphaned Create Next App leftover), the `robots.txt` block, the italic `woff2`, and `.yarn/` at 735 tracked files.

**On an orphan branch none of those are deletions.** The branch starts with no tree at all, so each is simply *not created*. The inventory inverts into a carry-over list, which is both shorter and safer to check:

| Carried over | Why |
| --- | --- |
| `docs/` — **every file** | **This is the deliverable.** The entire spec this map produced |
| `AGENTS.md` | Repo conventions for agent sessions |
| `public/robots.txt` | Cleaned to its two useful lines, per the head-and-metadata decision |
| `public/favicon.svg` | Settled by [its own ticket](https://github.com/viniciusoliveiras/portfolio/issues/21): 332 bytes, authored fresh rather than carried — see [the favicon spec](research/favicon-and-asset-serving.md) §1.5 |
| `public/resume-en.pdf` | **Not currently in the repo** — lives at `~/Documentos/resume-en.pdf`, 40.6 KB, untracked. Linked from the hero and the contact list in both locales, so its absence is a double 404 at launch. See [the favicon spec](research/favicon-and-asset-serving.md) §4.1 |
| `README.md` | **Added 2026-07-29.** The deliverable's entry point — reading order for the whole spec, plus how to run the project. Written by [Assemble the deliverable](https://github.com/viniciusoliveiras/portfolio/issues/22), which §1 below had already assigned it to |
| `CONTEXT.md` | **Added 2026-07-29.** The glossary `docs/agents/domain.md` promises at the repo root, binding agents to the spec's vocabulary. Same ticket |

Everything else is authored fresh.

> **The list is seven items, not five.** The two root files were added by the closing ticket, and they are the *second* time this list grew after being written — the résumé PDF was the first. Both grew for the same structural reason: **the list was built by inverting a deletion inventory, so anything that was never in the tree could never invert into it.** A file this map creates from nothing is invisible to that construction. Nothing else in the map creates a root file, so the list is now closed.

> **The highest-risk step in this document is carrying `docs/` onto the orphan branch.** A force-push that omits it destroys every decision this effort made, irrecoverably from `main`.
>
> **Verify by computing both sides, never against a written number.** A literal count goes stale every time the map adds a document, and it goes stale silently — which is the one thing this check exists to prevent. It already happened once: this document was written claiming 18 files, in the commit that made it 19 by adding itself.
>
> ```sh
> git ls-files docs/ | wc -l                           # on main — the source of truth
> git ls-tree -r --name-only rebuild docs/ | wc -l      # must match
> ```
>
> **Extended 2026-07-29: the count above cannot see the root files.** `docs/` matching exactly would still pass with `README.md` and `CONTEXT.md` missing — and losing the README loses the only document that says in what order to read the rest. Check the carried paths by name, not just the directory by count:
>
> ```sh
> for f in README.md CONTEXT.md AGENTS.md public/robots.txt public/favicon.svg public/resume-en.pdf; do
>   git ls-tree -r --name-only rebuild -- "$f" | grep -q . || echo "MISSING on rebuild: $f"
> done
> ```
>
> **Two entries will not be on `main` to compare against**, so run this check against the rebuild branch only — on `main` both report missing, correctly:
>
> - **`public/resume-en.pdf`** is untracked today; it must be added from `~/Documentos/`.
> - **`public/favicon.svg`** does not exist at that path either. Today's file is `public/images/favicon.svg` — the recoloured icon-pack export the [favicon spec](research/favicon-and-asset-serving.md) §1 found is not his — and the replacement is **authored fresh, not carried**. It appears in the table above because it must exist on the rebuild branch, not because it comes from here.

Also noted while checking: the repo has **no `README.md` and no `LICENSE`**. ~~Neither is created by any decision so far.~~ `README.md` belongs to [Assemble the deliverable](https://github.com/viniciusoliveiras/portfolio/issues/22), which owns the entry-point document.

> **Updated 2026-07-29.** `README.md` now exists, written by that ticket, along with `CONTEXT.md`. **`LICENSE` still does not, and nothing in the map creates one** — deliberately left alone: licensing a personal portfolio is the author's call, not a migration decision, and the map's destination does not reach it.

### `git filter-repo` is not performed

ADR-0003 specified it as an irreversible, separately-performed step:

```sh
git filter-repo --path .yarn/ --invert-paths
```

**The force-push achieves the same outcome, so the step is redundant.** An orphan branch's history never contained `.yarn/`, so replacing `main` with it removes those blobs from the reachable history without a rewrite tool.

Two facts recorded rather than assumed. First, **ADR-0003's stated precondition has expired**: it justified the rewrite as *"safe here at 0 forks / 0 stars, no open PRs, one branch, one author"*, measured 2026-07-27. Verified 2026-07-28, the repo has **1 fork** — `mirkosalvato1-ctrl/portfolio`, created the day after. Second, and this applies to **both** approaches equally: the fork retains the old history and GitHub keeps those objects reachable through the **fork network**. So a fresh clone drops from 72 MB to roughly 2 MB, which was always the real benefit, but the `.yarn/` blobs do not leave GitHub. Only detaching the fork network, via GitHub Support, would do that, and it is not worth asking for.

Measured today, for the record: `.yarn/` is **735 tracked files / 78 MB**, and `.git` is **72 MB** — against ADR-0003's 736 / 75 MB / ~71 MB. Close enough that its conclusion stands.

**The cost, accepted knowingly:** replacing `main` removes five years of commits from the default branch, and GitHub counts contributions from the default branch. The contribution history that corroborates the résumé's five-year tenure claim does not survive on this repo. This was raised and the decision reaffirmed.

### Same Vercel project, and the settings go first

A parallel project was attractive — attach the new domain, verify on the real host, leave production untouched — but one requirement rules it out. The head-and-metadata decision wants **the old `*.vercel.app` origins to keep working so existing shared links survive**. ~~On the same project those hostnames automatically serve the new production deployment, so that comes free~~; a parallel project would mean keeping the old project alive purely to redirect, or letting the old links die.

> **Corrected 2026-07-29 at cutover — it does not come free.** The conclusion (same project) still holds; the reason given for it is wrong for one of the two hosts.
>
> `viniciusoliveiras.vercel.app` is an attached project **domain** and does track production automatically. `portfolio-viniciusoliveiras.vercel.app` is a manually pinned **alias created 2021-08-19** which never tracked production at all: immediately after the force-push it was still serving the 2021 site — `/pt` 404, `/en` 404, `/home` 200. It had to be assigned to the new production deployment by hand via `POST /v2/deployments/{id}/aliases`.
>
> Vercel refuses to add it as a project domain while it exists as an alias (`409 duplicate-team-registration`), so it was pointed at production with `POST /v2/deployments/{id}/aliases` instead.
>
> **A third host was found while checking that**, which no document names: `portfolio-git-main-viniciusoliveiras.vercel.app`, a legacy git-branch alias under Vercel's old naming scheme, was *also* pinned to the 2021 deployment and serving the old site. It carried `x-robots-tag: noindex`, so it was never an indexing problem, but it was a public URL serving the exact page this migration exists to retire. **So the count is three `*.vercel.app` hosts, not two** — which matters at Phase 4, where all three should end up 308-ing into the custom domain.
>
> **Superseded 2026-07-31 at the domain swap — they do not 308, they 404.** All three
> were removed from the project rather than redirected, and re-attaching them was
> considered and declined. The mechanism below is still correct and still the reason
> there was no recurring chore while those hosts lived; it simply no longer applies to
> any host. See Phase 4.
>
> ### The mechanism, established by testing across three production deploys
>
> Two earlier versions of this block generalised from a single observation and were each wrong. The rule is:
>
> **A project domain tracks production. A bare alias stays pinned wherever it was last assigned.**
>
> Assigning an alias with `POST /v2/deployments/{id}/aliases` is a *one-shot* operation — it does not by itself make the host follow anything. `portfolio-viniciusoliveiras.vercel.app` appeared to follow after being assigned only because it was *also* promoted to a project domain in the process; `portfolio-git-main-…`, assigned identically, stayed frozen and was still serving the previous build's copy one deploy later. The reliable operation is to add the host as a project domain:
>
> ```
> POST /v10/projects/{projectId}/domains   { "name": "<host>" }
> ```
>
> which returns `gitBranch: null` — i.e. targets production — and re-points the host immediately. All three hosts are now project domains, all three follow production, and **there is no recurring chore.** Verify with `GET /v9/projects/{id}/domains` (which lists only production-tracking domains) rather than `GET /v4/aliases` (which lists every alias, pinned or not); the difference between those two responses is exactly the set of hosts that will go stale.

**The ordering is load-bearing and not obvious: settings change before any push.** Preview builds use the *project's* settings, so a preview of the rebuild branch under the auto-detected TanStack Start preset would fail — and validating that preview is the entire gate before the force-push. Changing settings first means previews build correctly. In the window between, a push to old `main` would fail to build, which is harmless: **Vercel keeps serving the last successful production deployment**, and nothing is pushed to `main` in that window anyway.

---

## 2. URL disposition

| URL | Goes to | Status | Source |
| --- | --- | --- | --- |
| `/` | edge-detected locale | **307** | ADR-0004 — 307 because it varies by `Accept-Language` |
| `/home` | `/` | **308** | this document |
| `/about` | `/` | **308** | this document |
| `/projects` | `/` | **308** | this document |
| `/resume` | `/` | **308** | this document |
| anything unmatched | `/404` | **404** | ADR-0004 — one bilingual page, zero-config |

**`/home` is not a hypothetical.** The repo's own `homepageUrl` field points at `https://viniciusoliveiras.vercel.app/home`, and the résumé cites the bare origin, which currently redirects there. It carries whatever inbound equity this site has, so 404ing it would be self-inflicted.

**The target is `/`, never `/pt`.** Redirecting old URLs straight to a locale would hard-code Portuguese for an English visitor, which is exactly the privileging ADR-0001 forbade by making both locales prefixed.

**`permanent: true` is correct here for the inverse of ADR-0004's reasoning.** That ADR forced 307 on `/` because a permanent redirect would freeze a visitor's locale in browser cache forever — the rule varies by header. These four do not vary at all, so a cacheable permanent redirect is exactly right.

Section anchors were considered and rejected: `/about` has no clean counterpart, since its content is split across Summary and Experience, and `/resume` maps to the whole page. On a single scrolling page, landing at the top loses nothing.

---

## 3. The ordered cutover

### Phase 0 — pre-work, no repo changes

1. **Verify whether `viniciusoliveiras.vercel.app` and `portfolio-viniciusoliveiras.vercel.app` are two domains on one project or two separate projects.** This changes the work in Phase 1 and cannot be determined from the repo. Both currently serve the same content.
2. **Vendor the fonts.** The one-off subset from the token layer §6, requiring `fontTools` and `brotli` on the machine that runs it. Produces **two** committed binaries in `public/fonts/`, not three — the italic face was deleted by the section-layouts decision.
3. **Regenerate the résumé PDF** with the `Languages` grouping fix, moving Go out of the working languages and into learning, per the copy decision. **The cited site URL needs no change at this stage** — see Phase 4.

> **Done 2026-07-29, and the step is now repeatable.** This phase assumed the author would regenerate the PDF in whatever produced it. Nothing had — the file was generated once and only the binary survived, so there was no source to edit anywhere. It is now authored as `resume/resume-en.html` and rendered by `node resume/build.mjs`, on the same one-off-step-producing-a-committed-binary footing as the font vendoring. Go sits in its own `Learning` grouping. **Phase 4 step 21 is therefore one line plus a re-render**, rather than a hunt for the original tool.

### Phase 1 — Vercel project settings, before any push

4. Framework Preset → **Other**. Vercel auto-detects TanStack Start and fills in Nitro-shaped settings, which would reintroduce exactly what ADR-0004 removes. `vercel.json`'s `framework: null` also selects this.
5. Output Directory → **`dist/client`**.
6. Install Command → ~~**`npm i -g pnpm@11 && pnpm install --frozen-lockfile`**~~. Vercel supports pnpm 6 through 10, not 11, and falls back to pnpm 6 when nothing matches.
7. Node version → **pin 24.x in Project Settings**, not in `package.json`. ADR-0003 made `engines` a floor that never needs editing; Vercel maps ranges to the newest *available* major, so an unpinned project floats to Node 26 the day it ships.

> **Corrected 2026-07-29 — this phase is FIVE settings, not four, and two of the commands above are wrong.** Full reasoning and the build logs are in [ADR-0004](adr/0004-deployment-target-and-rendering-mode.md)'s correction block; the ordered steps are:
>
> 6. Install Command → `npm i -g pnpm@11 && P="$(npm prefix -g)/bin/pnpm" && "$P" --version && "$P" install --frozen-lockfile`. Installing pnpm 11 is not enough — the bare name `pnpm` still resolves to the build image's own copy, whose single-document YAML parser cannot read a pnpm 11 lockfile.
> 8. **Build Command → `P="$(npm prefix -g)/bin/pnpm" && "$P" build`.** New, and not optional. This document says to leave Build Command alone; that is wrong. Vercel cannot parse the pnpm 11 lockfile, so it treats the project as npm and runs `npm run build` — and npm 11 enforces `devEngines.packageManager`, so it refuses to run anything at all.
>
> **Found the measured way:** this phase was performed, the branch pushed, and the first two preview builds failed — which is precisely the value the Phase 3 gate exists to deliver, since neither defect is reachable from a green local build. **A third finding softens the phase's urgency:** `vercel.json` carries `framework`, `outputDirectory`, `installCommand` and `buildCommand`, and it *overrides* the dashboard — so steps 4, 5, 6 and 8 are belt-and-braces with the branch. **Only the Node version (step 7) is expressible nowhere but the dashboard**, and it was the setting that would have failed the build outright: the project was pinned to **`14.x`**, four LTS lines below the `>=22.12` the stack requires — not merely unpinned, as ADR-0004 anticipated.

### Phase 2 — the orphan branch

8. `git switch --orphan rebuild`
9. **Carry over `docs/` (verify by computing both counts — see the warning in §1), `AGENTS.md`, `public/robots.txt` cleaned, and `public/resume-en.pdf`.** The PDF has to be copied into the repo from `~/Documentos/` first; it has never been tracked.
10. Author the new project: `package.json`, `pnpm-workspace.yaml`, `tsconfig.json`, `biome.json`, `lefthook.yml`, `vite.config.ts`, `vercel.json`, `.nvmrc`, `.gitignore`, `.github/workflows/ci.yml`, `src/**`, `public/**`.
    - **Land `pnpm-workspace.yaml` and the CI workflow together**, so the fresh-clone install canary exists from the first push rather than after it. Without `allowBuilds: { lefthook: true }` the install fails outright.
11. `src/config.ts` → `SITE_ORIGIN = 'https://viniciusoliveiras.vercel.app'`. The shorter of the two hosts, and the one the repo already advertises.
12. Push the branch. Each push produces a preview deployment under the corrected settings.

### Phase 3 — validate, then replace `main`

13. **Validate the preview.** At minimum: both locales render; `/` detects and 307s; the bilingual `/404` returns 404 on a cold unknown URL *and* `/404` itself returns `noindex`; the four old-URL 308s; prerendered output contains all content on first paint; both fonts load with no third-party request; dark mode via `prefers-color-scheme`; the mobile sheet opens and traps focus below `md`; **and no nav links are visible in the prerendered HTML** — the `open:flex` specificity trap from the sheet spec.
14. Verify `ADR-0004`'s recorded open risk: that `/`'s 307 is evaluated per-request rather than served from cache to the wrong locale. Mitigation if it bites is `Vary: Accept-Language` on `/`.
15. `git push --force origin rebuild:main`
16. Confirm the production deployment succeeded and serves the new site on both vercel.app hosts.
17. Update the repo's `homepageUrl` field to `https://viniciusoliveiras.vercel.app` — dropping `/home`, which no longer exists.

### Phase 4 — the domain swap, a separate later event

18. ~~Choose and register the domain.~~ **`viniciusoliveiras.com`, registered and configured 2026-07-31.** The spec has no unfilled values left.
19. Attach it in Vercel and set it primary, ~~so both vercel.app hostnames 308 to it and the origins consolidate~~ — the second clause was **not** performed; see below.
20. `SITE_ORIGIN` → the new domain. One line, then redeploy.
21. **Regenerate the résumé PDF** with the new URL.
22. Update `homepageUrl` again.
23. Re-verify `canonical`, the three `hreflang` alternates, `x-default` and `og:url` all name the new host.

> **Performed 2026-07-31.** Three things this phase did not anticipate.
>
> **The domain has a `www`/apex split, and `SITE_ORIGIN` takes the `www` form.** Vercel
> serves production on `www.viniciusoliveiras.com`; the apex 308s to it. Step 20 says
> "the new domain" as though that were one value. It is two, and only one of them
> answers 200 — so an apex `SITE_ORIGIN` would put the canonical, both `hreflang`
> alternates, `x-default`, `og:url`, the `twitter` URLs and the JSON-LD `url` on a
> redirecting host. That is a variant of the duplicate-origin defect this constant was
> introduced to retire, which is why it is worth naming rather than treating as a typo.
>
> **The résumé PDF prints the bare apex, and the asymmetry with `SITE_ORIGIN` is
> deliberate.** Step 21 assumed one URL serves both purposes. In the PDF the URL is
> display text a reader types or copies, and the 308 carries them; only machine-read
> URLs need the host that answers 200. `viniciusoliveiras.com` on a résumé line also
> reads better than the `www` form, at no cost.
>
> **Step 19's consolidation clause is reversed, not pending.** All three `*.vercel.app`
> hosts were removed from the project during the swap, so they now serve
> `DEPLOYMENT_NOT_FOUND` — a 404, not the 308 this document asked for. Re-attaching them
> as project domains (the mechanism §1 established) would have restored it. **It was
> raised with the author and declined.** The costs, accepted knowingly:
>
> - **Résumé PDFs already in circulation cite `viniciusoliveiras.vercel.app`** and now
>   404. Every copy sent before today points at nothing.
> - **This reverses a requirement, not a nice-to-have.** The head-and-metadata decision
>   wanted the old origins to keep working so existing shared links survive, and §1 cites
>   that requirement as the reason the *same* Vercel project was used at all. The reason
>   is now spent; the decision it justified is not revisited, because the force-push
>   already happened.
> - **§4's continuity argument is abandoned.** It argued for launching on the vercel.app
>   origin precisely so its crawl history would consolidate into the new domain via those
>   308s. Without them the new domain starts from zero authority — the outcome §4 said
>   domain-first would have caused, arrived at by another route.
> - **The `viniciusoliveiras.vercel.app` subdomain returns to Vercel's namespace**, where
>   another account can claim it.
>
> **Phase 4 is complete. Every step 18–23 done, and 23 verified against production**, not
> only the local prerender. 19 is done for the domain and declined for the vercel.app
> hosts. Measured on `www.viniciusoliveiras.com` immediately after the deploy:
>
> | Checked | Result |
> | --- | --- |
> | `canonical` on `/pt` and `/en`, three `hreflang`, `x-default`, `og:url`, `og:image`, `twitter:image`, JSON-LD `url` | all name `https://www.viniciusoliveiras.com` |
> | any `vercel.app` string in the served HTML | **zero**, on all three pages |
> | `/` | 307 → `/pt` (locale detected per-request) |
> | `/home`, `/about`, `/projects`, `/resume` | 308 → `/`, all four |
> | a cold unknown URL | 404; `/404` itself 200 with `<meta name="robots" content="noindex">` |
> | apex `viniciusoliveiras.com` | 308 → `www` |
> | `/resume-en.pdf` | 200, **byte-identical to `public/resume-en.pdf`** at 42 171 bytes, and its contact line reads `viniciusoliveiras.com` |
> | `/og.png`, `/robots.txt` | 200 |
> | `/fonts/*.woff2` | 200, `cache-control: public, max-age=31536000, immutable` |
>
> **This closes the cutover.** The document's remaining forward references are all to the
> reversal above, not to unfinished work.

**Not performed at any point:** `git filter-repo`.

---

## 4. Why the domain comes second

This was decided against my recommendation, and two of the three arguments I raised for domain-first do not survive contact with the choice. Recording both, so the reasoning is not re-litigated from a false premise.

**The résumé PDF does not need two content rewrites.** With `SITE_ORIGIN` starting as `viniciusoliveiras.vercel.app`, the URL the PDF already cites becomes *correct* at launch. The Phase 0 refresh is only the `Languages` grouping fix; the URL line changes in Phase 4, which it would need to do whenever the domain arrived regardless.

**The indexing argument partly runs the other way.** `viniciusoliveiras.vercel.app` already has crawl history from the old site. Launching the new site on that same origin means a known host is re-crawled and the four 308s consolidate into it, whereas launching straight onto a fresh domain starts from zero authority *and* abandons the old origin's history. A re-index happens either way; this ordering keeps continuity.

> **Withdrawn 2026-07-31.** The continuity this argument promised was carried entirely by
> the vercel.app → domain 308s, and those were declined at Phase 4. The old origin's crawl
> history is abandoned, not consolidated, so the new domain starts from zero authority —
> exactly the cost this paragraph attributed to domain-*first*. The ordering decision
> itself stands, having already been spent; this particular argument for it does not.

**What genuinely does cost something**, and is accepted: the site spends its first period advertising a canonical, three `hreflang` links and an `og:url` on a host it intends to leave, and Phase 4 is therefore a real domain migration rather than a one-line change. The mitigation is already in Phase 4 step 19 — set the domain primary so the vercel.app hosts 308 into it, which is the standard consolidation path.

**A side benefit worth noting:** because the head-and-metadata decision routes everything through one `SITE_ORIGIN`, the canonical on *both* vercel.app hostnames points at the same one from launch — which fixes the duplicate-content defect that decision identified, immediately, rather than at domain-swap time.

---

## 5. What this hands to other tickets

- **[Assemble the deliverable: ADR promotions and the spec's final shape](https://github.com/viniciusoliveiras/portfolio/issues/22)** — this document is a **fourth ADR candidate**, and ADR-shaped by that ticket's own test. It also inherits one fact: the repo has **no `README.md`**, which matters because that ticket owns the entry-point document. (The `docs/` count it was also handed is withdrawn — §1's check now computes both sides, precisely so that adding a document cannot invalidate it.)
- ~~**[Settle the favicon and where the résumé PDF is served from](https://github.com/viniciusoliveiras/portfolio/issues/21)**~~ — **resolved**, in [the favicon spec](research/favicon-and-asset-serving.md). No placeholder is needed: the favicon is 332 bytes of paste-ready source. It corrected this document in three places — the carry-over list gains `public/resume-en.pdf` (§4.1: it was never tracked, so it never inverted from a deletion into a carry-over), the `docs/` count check becomes computed rather than literal (§6: the count was stale in the commit that wrote it), and `vercel.json` gains a `headers` block for `/fonts/(.*)` (§5, resolving ADR-0004's open handoff).
- **Both unfilled inputs are unchanged and non-blocking**: `DEVEX_URL` and `INOVASENSOR_URL` degrade to plain strings by the message-module decision's design, so the copy ships without them.
