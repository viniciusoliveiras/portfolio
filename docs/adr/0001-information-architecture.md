# ADR-0001: Information architecture for the redesigned portfolio

- **Status**: Accepted
- **Date**: 2026-07-27
- **Resolves**: [Settle the information architecture — what pages exist and how they're organised](https://github.com/viniciusoliveiras/portfolio/issues/5), on [the migration map](https://github.com/viniciusoliveiras/portfolio/issues/1)

## Context

The redesign was scoped to rethink the information architecture, not just reskin. Settling it first was necessary because the page list determines how much the rest of the migration spec has to describe.

Reading the current site alongside `Documentos/resume-en.pdf` surfaced the decisive fact: **the site's content is roughly five years out of date, and it argues for a person who no longer exists.**

The résumé says **Tech Lead / Full-Stack Developer**, five years at one company group, progressing intern → Systems Analyst → Tech Lead:

| Role | Period |
| --- | --- |
| Tech Lead, Devex Soluções · Technical Lead, Inovasensor | April 2026 – present |
| Systems Analyst, Devex Soluções | January 2023 – April 2026 |
| Intern, Devex Soluções | August 2021 – December 2022 |
| Youth Apprentice (Marketing), Ancar Ivanhoe Shopping Centers | March 2019 – April 2021 |

With describable, NDA-safe work carrying real scale: a modular **ERP monorepo of 15 modules serving 8 enterprise clients and 400+ active users**; **frontend architecture for a financial BPO platform**, where TanStack Start with TanStack Query was selected over a client-state library given the API-driven design; contributions to a Node.js backend in a monorepo that also houses a proprietary AI layer; internal process automation with n8n; and technical leadership of **4 developers**.

The site, meanwhile, claims:

- a typewriter hero cycling *"Estudante de TI"* and *"Desenvolvedor React"*
- *"Meu foco atual é o React.js integrado com o Next.js"*
- a degree *"Janeiro 2020 até a data atual"* (actually complete: UniCarioca, Technologist in Systems Analysis and Development, 2020–2022)
- a tech wall of HTML5, CSS3, JavaScript, React, Next.js, TypeScript, with tools Ubuntu, VS Code, Vercel
- professional experience ending April 2021, at Ancar Ivanhoe
- six hand-picked projects, all 2021 Rocketseat course work
- a "recent projects" strip pulling the two most-recently-*pushed* public repos

Public GitHub corroborates the gap rather than filling it: the last substantive public repo is `github-explorer` (October 2022). Everything since is this portfolio, a `tanstack-start-sandbox` (April 2026), and a profile README. Nothing exceeds one star. **So the evidence a hiring-signal site would normally lean on — public code — does not exist for the professional years.**

Two further findings shaped the structure:

- **The current four pages carry about one page of substance**, and repeat themselves doing it. `/home`'s hero and `/about`'s `KnowWhoIAm` open with near-identical lines. "Ver Currículo" appears on both `/home` and `/resume`, pointing at `my.indeed.com` rather than a PDF — so `/resume` shows inline résumé content *and* links out to a competing résumé. `/home` and `/projects` show two unrelated project sets.
- **`src/services/api.ts` has exactly two consumers**: `RecentProjects` (via `home.tsx`) and the `/about` bio (via `about.tsx`). The bio interpolation currently renders a broken sentence on the live site, because the GitHub bio field ends mid-clause: `"…na @dvx-solutions e "` lands inside `"…sou do Rio de Janeiro, Brasil. {bio}."`

## Decision

### Purpose

The site's job is **hiring signal for a working Tech Lead**. Audience: recruiters and engineering managers. The one thing a visitor should do is grasp real professional capability, then make contact. Every decision below is subordinate to that.

Because the professional work is not public, **evidence is experience-led**: the Devex/Inovasensor work, written as NDA-safe descriptions of problem, scale, stack and contribution — architecture and numbers, not client data. The site itself is the one live craft demonstration, which is reinforced by the fact that TanStack Start was chosen *at work, for a financial platform*. The migration is evidence of the judgment the site describes.

### Structure: one scrolling page

The narrative is single and coherent, so it gets a single page with anchored sections — matching how a recruiter actually reads, and mirroring why a résumé fits on one page. No work-detail routes: with one employer group and three roles, the substance is inline.

Sections, in order:

1. **Hero** — name, "Tech Lead / Full-Stack Developer", Rio de Janeiro; one positioning line; primary actions are contact and the résumé PDF.
2. **Summary** — the professional-summary paragraph: five years, intern → lead, 4 developers, ERP scale, BPO frontend architecture. This block **does not exist on the current site at all**, and is the highest-value content on the page.
3. **Experience** — the four roles as a timeline. The left-border timeline in today's `ResumeItem` is the one structural idea from the current `/resume` worth carrying forward.
4. **Selected work** — 2–3 NDA-safe entries with their metrics: the ERP monorepo (15 modules / 8 clients / 400+ users), the financial BPO platform's frontend architecture and the TanStack Start + Query rationale, the n8n automations. These do the job the project cards used to, and do it better.
5. **Skills** — the real stack, grouped as the résumé groups it: languages (TypeScript, JavaScript, SQL, Go); frontend (React, TanStack Start, TanStack Query); backend (Node.js); databases (MSSQL); infrastructure (Docker, Git, monorepo architecture); automation (n8n); practices (data modeling, systems analysis, code review, technical leadership). Text-led, not an icon wall.
6. **Education & certifications** — UniCarioca 2020–2022, complete; Ignite ReactJS; Learn Go.
7. **Contact** — email, LinkedIn, GitHub, résumé PDF. **No contact form** — a form needs a backend, which the fully-static outcome below precludes, and links are what this audience uses anyway. **Instagram is dropped** (absent from the résumé, off-message for this audience) and **the résumé's phone number is not published** (public phone numbers attract spam; it stays on the PDF).

The header nav becomes scroll anchors plus a language switcher. `ActiveLink` was already slated for deletion; the four-way page nav goes with it.

### URLs

| URL | Purpose |
| --- | --- |
| `/pt` | The page, Brazilian Portuguese |
| `/en` | The page, English |
| `/` | Redirects — via `throw redirect()` in a route, not a `next.config.js` rule |
| not-found | A `notFoundComponent` route option, keeping today's 404 voice (*"Parece que esta página é tímida e não quer aparecer no portfólio"*), pointing at the locale root rather than `/home` |

Both locales are prefixed, so no locale is privileged and the active language is unambiguous in every URL. Whether `/` redirects to a **detected** locale or a **fixed default** is deliberately left to the i18n ticket.

Today's `/home`, `/about`, `/projects` and `/resume` all cease to exist.

### Language: both, via i18next

The site ships in **pt-BR and English**. This **overturns the map's "i18n / an English version" out-of-scope entry**, which was an assumption made while charting rather than a decision.

What made it live again: the résumé is in English, the audience for a Tech Lead role often is too, and — critically — **almost none of the existing pt-BR copy survives this IA anyway.** The project descriptions go with the projects; the focus claim, the typewriter strings and the degree dates are false; the tech-wall labels change. What genuinely survives is a handful of section headings and the 404 joke. Writing new copy in English therefore costs about what writing new copy in Portuguese costs, which makes two locales an incremental rather than doubling cost.

`i18next` is the chosen library. Its integration is a separate decision.

### What is cut

| Cut | Why |
| --- | --- |
| GitHub contribution calendar | Reflects side projects, and those stop in 2022 — it understates production work living in private repos. It was also the only section forcing a remote fetch. |
| "Recent projects" from the GitHub API | Sorted by most-recently-pushed, not by quality — today it would surface this portfolio and a sandbox rather than the ERP or BPO work. Uncurated by construction. |
| Tech and tool icon wall | HTML5 and CSS3 badges read junior directly beneath a Tech Lead summary. Replaced by the grouped skills list. |
| Typewriter hero | Both strings it cycles are false, and `typewriter-effect` is the last CJS-only dependency in the stack for ~25 lines of `setTimeout`. |
| The six 2021 project cards | The strongest bootcamp-graduate signal on the site, and they would sit immediately below the Tech Lead summary. |
| `/about`'s GitHub bio fetch | The summary is authored copy now. This also fixes the live broken sentence. |
| Instagram links; the Indeed résumé link | Off-message for the audience; "Ver Currículo" points at the actual PDF. |

## Consequences

### The site becomes fully static, which simplifies three other tickets

Dropping the calendar and the recent-projects strip removes **both** consumers of `src/services/api.ts`. There is then no remote data anywhere on the site, and:

- **`axios` dies with its call sites.** [Specify GitHub API fetching with fetch, replacing axios](https://github.com/viniciusoliveiras/portfolio/issues/10) has nothing left to specify — the new stack needs no HTTP client at all. Closed as invalidated.
- **`revalidate: 604800` stops mattering.** It was the single Next API the API-map ticket found to have *no* TanStack Start counterpart, and it existed purely to refresh GitHub data. [Choose the deployment target and rendering mode](https://github.com/viniciusoliveiras/portfolio/issues/9) loses its hardest open question.
- **Replacing `react-github-calendar` evaporates.** The [dependency verdicts](https://github.com/viniciusoliveiras/portfolio/issues/4) recommended `react-activity-calendar` plus a loader fetch, because v5 cannot server-render. Moot. So is the accidental coupling that ticket found, where the tech-grid tooltips work off a global `react-tooltip` instance mounted *inside* `GithubCalendar`.

Two further dependency verdicts shift with it. `typewriter-effect` moves from *hand-roll* to *drop*. And `date-fns` — kept in that ticket — had exactly one use: formatting `updated_at` on the recent-projects cards. Those are cut, and the experience timeline uses static period strings from the résumé, so unless something else formats a date, `date-fns` and its pt-BR locale drop too.

### The component layer may need no primitives at all

The dependency-verdicts ticket concluded the Tailwind component layer needed **exactly one** primitive — an accessible tooltip — and **no** dialog, since `WarningAlertDialog` is dead code. Dropping the icon wall and the calendar removes both tooltip consumers, and a single scrolling page may not need the mobile `Drawer` either. The token layer's third-party-primitive question (shadcn/ui vs headless vs hand-rolled) may therefore answer itself as *none*.

### Prerendering is no longer fully automatic

The API-map ticket established that `prerender: { enabled: true }` auto-discovers every page *because this repo has zero dynamic segments*. A locale route reintroduces one, so the locale set must be enumerated explicitly. With two known locales this is trivial, but it is now a fact the deployment-and-rendering decision owns.

### Assets shrink

Cutting the six project cards removes every Sirv-hosted screenshot. Cutting the icon wall removes the render-blocking jsDelivr `devicon` stylesheet and the `raw.githubusercontent.com` icon URLs. What remains to decide: which avatar (the GitHub photo used on `/home`, or the `images/avatar.svg` illustration used on `/about` — currently *both* ship), the Google Fonts / Heebo stylesheet, and where the résumé PDF is served from.

### Copy is now the largest outstanding risk

The hero, summary, experience and selected-work text must be authored, in both locales, and only the résumé holds the source material. The map's "reuse the pt-BR copy" standing preference is substantially void — it now means *reuse the voice*, not the sentences.

### Two pre-existing bugs, noted in passing

Not part of this decision, but found while reading and worth not rediscovering: `Footer` hardcodes `© 2021` on desktop while computing the year on mobile, and `TechAndToolStacks` renders its headings `yellow.400` on desktop but `red.400` on mobile.
