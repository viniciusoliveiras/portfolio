# Site copy — all seven sections, pt-BR and English

Resolves [Author the site copy for all seven sections, in both locales](https://github.com/viniciusoliveiras/portfolio/issues/14). Written 2026-07-28.

**Every factual claim below traces to a line in `Documentos/resume-en.pdf`.** Nothing is invented. The handful of lines that are *interpretive* rather than factual — voice, not claim — are marked **(voice)** so they can be overwritten without checking anything.

Structured exactly as `src/content/{pt,en,facts}.ts` will be, per the planning-only preference. Portuguese is the canonical module; English is `satisfies Messages`, so the two are structurally identical by compiler enforcement and differ in **wording only**.

---

## 1. The seven decisions

| # | Decision |
| --- | --- |
| 1 | **Voice is first person, restrained** — present tense, no greeting, no small talk. The 404 joke is the one sanctioned flourish. |
| 2 | **Hero carries scope; Summary carries progression.** Real dates shown in Experience. |
| 3 | **Ancar Ivanhoe gets one line, no bullets** — chronological completeness only. |
| 4 | **Selected work is two entries** — the ERP monorepo and the BPO platform. n8n stays in the Systems Analyst bullets. |
| 5 | **The AI layer keeps the résumé's adjacency framing** — an internal system, not built directly by him, so no authorship is implied. The TanStack Start decision is told in full. |
| 6 | **Go sits in its own *learning* grouping**, separate from the three working languages. |
| 7 | **One English résumé PDF**, linked from both locales, with the Portuguese label naming the language. |

### Why the voice dropped the greeting

The surviving line was *"Olá, eu sou o Vinícius, sou do Rio de Janeiro, Brasil"*. The map's standing preference is to reuse the **voice, not the sentences**, and the greeting is the part that had to go: it is the 2021 portfolio-template opener, which is the exact register ADR-0001 is escaping, and it reads as a collision under Source Serif 4 beside a 400+-users figure. First person survives, because third-person self-description reads as a bio written by somebody else on what is explicitly a personal site.

### Why the hero does not carry the tenure

Tech Lead since **April 2026**; the group tenure runs from the **August 2021** internship. So the title is ~4 months old and the five years belong to the *group*, not the role. ADR-0001 gives two sections here, so the split does the work: scope lands first as the strongest verifiable claim, and the intern → lead climb arrives afterwards as depth. The one-group tenure therefore never leads — it reads as commitment rather than as a ceiling — and the newest, thinnest claim is never load-bearing.

---

## 2. `src/content/facts.ts` — locale-neutral, keyed

```ts
export const facts = {
  yearsInGroup: '5',
  teamSize:     '4',
  products:     '2',
  erpModules:   '15',
  erpClients:   '8',
  erpUsers:     '400+',
} as const
```

`as const` is correct **here** and a build failure in the locale modules — the message-module decision measured that, since literal types make English unassignable to Portuguese. `facts` is never compared by `satisfies`, so the narrowing is free.

**Keyed, not positional**, per that same decision: under `noUncheckedIndexedAccess` a `figures[1]` is `string | undefined`.

### How the numbers reach the page — and why no message needs interpolation

The design brief settled this without the copy ticket noticing: **metrics are display figures above prose**, because ADR-0001 makes the numbers the argument and skimmability beats editorial purity. So a figure is a `facts` value rendered as a display number beside an authored **label** — it never appears inside a sentence.

That is what makes the message shape sufficient. Messages are strings or arrays of `string | { text, href }` segments with **no interpolation kind at all**, and had the numbers lived in prose, one would have been needed. They don't, so none is.

---

## 3. `meta` — the head strings

Budgets from the head-and-metadata decision: title ≤60, description ≤155.

```ts
// pt (canonical)
meta: {
  title: 'Vinícius Oliveira — Tech Lead e Desenvolvedor Full-Stack',   // 56
  description:
    'Tech Lead no Rio de Janeiro. Lidero quatro desenvolvedores em dois produtos — um monorepo de ERP e a arquitetura de frontend de um BPO financeiro.',  // 146
}

// en
meta: {
  title: 'Vinícius Oliveira — Tech Lead & Full-Stack Developer',       // 52
  description:
    'Tech Lead in Rio de Janeiro. I lead four developers across two products — a modular ERP monorepo and frontend architecture for a financial BPO platform.',  // 152
}
```

All four lengths **counted, not estimated** — by code-point count, which matters because `Vinícius` and the em dashes are multi-byte. The English description first came out at **exactly 155**, sitting on the ceiling with no margin; dropping one word bought three characters of headroom.

Both titles carry the role, which the current *"Vinícius Oliveira - Portfólio"* asserts nothing about. Both descriptions replace *"Portfólio pessoal construído com React.js"*, which described the build tool rather than the person.

---

## 4. Hero — scope

No anchor; it is the top of the page. The name and `Tech Lead | Full-Stack Developer` are rendered as-is from the résumé's own header, so they are not copy.

**pt** — `Lidero a arquitetura de frontend de uma plataforma de BPO financeiro e respondo por um monorepo de ERP modular em produção para clientes corporativos.`

**en** — `I lead frontend architecture for a financial BPO platform and own a modular ERP monorepo running in production for enterprise clients.`

*Traces to:* the summary's "Owns a modular ERP monorepo … and leads frontend architecture for a financial BPO platform." `respondo por` / `own` is deliberate — it is the résumé's verb, and it is a stronger claim than "worked on".

This replaces a typewriter that cycled `Estudante de TI` and `Desenvolvedor React`, both false.

---

## 5. Summary — progression · `#summary`

**pt** — `Entrei no grupo como estagiário em agosto de 2021 e hoje lidero uma equipe de quatro desenvolvedores em dois produtos, respondendo por direção técnica, padrões de código e planejamento de entregas. Trabalho com React, TypeScript, Node.js e Microsoft SQL Server, com experiência em modelagem de dados, conteinerização e automação de processos.`

**en** — `I joined the group as an intern in August 2021 and now lead a team of four developers across two products, owning technical direction, code standards, and delivery planning. I work with React, TypeScript, Node.js, and Microsoft SQL Server, with experience in data modeling, containerization, and workflow automation.`

*Traces to:* the professional summary in full, plus the intern start date from the experience block. This section **does not exist on the current site at all** — it is the highest-value net-new block on the page.

---

## 6. Experience — four roles · `#experience`

### The group note — the two-link clause

This is the sentence the message-module decision's segment shape exists for: **two links in one clause**.

```ts
// pt
groupNote: [
  'Os cargos abaixo são no mesmo grupo de empresas — ',
  { text: 'Devex Soluções', href: DEVEX_URL },
  ' e ',
  { text: 'Inovasensor', href: INOVASENSOR_URL },
  ' —, cujas equipes de engenharia atuam de forma conjunta entre os produtos.',
]

// en
groupNote: [
  'The roles below are within one company group — ',
  { text: 'Devex Soluções', href: DEVEX_URL },
  ' and ',
  { text: 'Inovasensor', href: INOVASENSOR_URL },
  ' — whose engineering teams operate jointly across products.',
]
```

**`DEVEX_URL` and `INOVASENSOR_URL` are unfilled inputs**, like `SITE_ORIGIN`. If either company has no public site, the segment degrades exactly as that decision intended: the entry becomes a plain string and the English sentence renders minus its anchor rather than breaking.

### Role 1 — `abril de 2026 – presente` / `April 2026 – Present`

`presente` / `present` stays **per-locale**, per the message-module decision.

Title **pt**: `Tech Lead, Devex Soluções · Líder Técnico, Inovasensor`
Title **en**: `Tech Lead, Devex Soluções · Technical Lead, Inovasensor`

**pt**
- `Lidero uma equipe de quatro desenvolvedores em dois produtos, respondendo por direção técnica, padrões de código e planejamento de entregas.`
- `Mantenho um monorepo de ERP modular com 15 módulos, atendendo 8 clientes corporativos e mais de 400 usuários ativos.`
- `Defino a arquitetura de frontend de uma plataforma de BPO financeiro.`
- `Contribuo com o backend em Node.js da plataforma, dentro de um monorepo que também abriga a camada de IA proprietária do produto.`
- `Conduzo code reviews e faço mentoria de desenvolvedores, apoiando seu crescimento técnico.`

**en**
- `I lead a team of four developers across two products, owning technical direction, code standards, and delivery planning.`
- `I maintain a modular ERP monorepo of 15 modules serving 8 enterprise clients and 400+ active users.`
- `I define frontend architecture for a financial BPO platform.`
- `I contribute to the platform's Node.js backend, inside a monorepo that also houses the product's proprietary AI layer.`
- `I run code reviews and mentor developers, supporting their technical growth.`

The AI-layer bullet keeps *"também abriga"* / *"also houses"* deliberately. It is an internal system he does not build directly, and that construction states adjacency without implying authorship.

Note these bullets **do** carry the numbers inline, unlike the Selected-work entries. Experience is a chronological record read in prose; the display-figure treatment belongs to the showcase.

### Role 2 — `janeiro de 2023 – abril de 2026` / `January 2023 – April 2026`

Title: `Analista de Sistemas` / `Systems Analyst`

**pt**
- `Construí e mantive módulos do ERP em React, TypeScript e Node.js sobre Microsoft SQL Server.`
- `Desenhei modelos de dados e fiz análise de sistemas para os módulos que chegam ao cliente.`
- `Conteinerizei serviços com Docker para padronizar desenvolvimento e deploy.`
- `Construí automações de processos internos com n8n, integrando sistemas internos a serviços de terceiros.`

**en**
- `I built and maintained ERP modules using React, TypeScript, and Node.js on Microsoft SQL Server.`
- `I designed data models and performed systems analysis for client-facing modules.`
- `I containerized services with Docker to standardize development and deployment.`
- `I built internal process automations with n8n, integrating internal systems with third-party services.`

The n8n bullet is where the automation work lives, rather than being promoted into a third Selected-work slot it could not fill.

### Role 3 — `agosto de 2021 – dezembro de 2022` / `August 2021 – December 2022`

Title: `Estagiário` / `Intern`

**pt** — `Apoiei o time de desenvolvimento em tarefas de front-end e correção de bugs, aplicando React em bases de código em produção.`

**en** — `I supported the development team on front-end tasks and bug fixing, applying React within production codebases.`

### Role 4 — one line, no bullets

**pt** — `Ancar Ivanhoe Shopping Centers — Jovem Aprendiz, Marketing · março de 2019 – abril de 2021`

**en** — `Ancar Ivanhoe Shopping Centers — Youth Apprentice, Marketing · March 2019 – April 2021`

No prose, by decision. Its only job here is that the site and the résumé do not disagree about employment history; it contributes nothing to problem, scale, stack or contribution. Cutting it would have left **no chronology gap** — Ancar ends April 2021, the internship starts August 2021, and the degree covers 2020–2022 — so it is kept for consistency rather than necessity.

---

## 7. Selected work — two entries · `#work`

### Entry 1 — argues by scale

Title: `Monorepo de ERP modular` / `Modular ERP monorepo`

Figures — `facts` value plus authored label:

| `facts` key | pt label | en label |
| --- | --- | --- |
| `erpModules` | `módulos` | `modules` |
| `erpClients` | `clientes corporativos` | `enterprise clients` |
| `erpUsers` | `usuários ativos` | `active users` |

**pt** — `Um ERP modular em produção para clientes corporativos. Respondo pelo monorepo: construí e mantenho os módulos em React, TypeScript e Node.js sobre Microsoft SQL Server, desenhei os modelos de dados dos módulos que chegam ao cliente e padronizei desenvolvimento e deploy com Docker.`

**en** — `A modular ERP running in production for enterprise clients. I own the monorepo: I build and maintain the modules in React, TypeScript and Node.js on Microsoft SQL Server, I designed the data models for the client-facing modules, and I standardised development and deployment with Docker.`

No client is named, in either locale. The constraint is architecture-and-scale, never client data — and `8 clientes corporativos` is already a figure he circulates on a résumé.

### Entry 2 — argues by judgement

Title: `Plataforma de BPO financeiro` / `Financial BPO platform`

**Figures: none.** See §9.2 — this is deliberate, not an omission.

**pt** — `Defino a arquitetura de frontend da plataforma. Escolhi TanStack Start, com TanStack Query cuidando de estado de servidor, cache e estados de carregamento e erro — em vez de uma biblioteca de estado de cliente, porque o produto é orientado a API. Também contribuo com o backend em Node.js, dentro de um monorepo que abriga a camada de IA proprietária do produto. Este site roda na mesma escolha.`

**en** — `I define the platform's frontend architecture. I selected TanStack Start, with TanStack Query handling server state, caching, and loading and error states — over a client-state library, because the product is API-driven. I also contribute to the Node.js backend, inside a monorepo that houses the product's proprietary AI layer. This site runs on the same choice.`

This is the strongest sentence available to the site, and the reason is structural rather than stylistic: it is a **documented architectural decision with its rationale attached**, which is precisely what a Tech Lead is assessed on, and it is the one thing on the page that scale figures cannot substitute for.

`Este site roda na mesma escolha.` / `This site runs on the same choice.` turns ADR-0001's *"the site itself is the one live craft demo"* from a claim the reader has to take on trust into one they are currently standing inside. **(voice)** — the fact is true and traceable, but the decision to point at it is a rhetorical one.

---

## 8. Skills · `#skills` · Education · `#education` · Contact · `#contact`

### Skills — the seven résumé groupings, plus Learning

| pt label | en label | Values |
| --- | --- | --- |
| `Linguagens` | `Languages` | TypeScript, JavaScript, SQL |
| `Frontend` | `Frontend` | React, TanStack Start, TanStack Query |
| `Backend` | `Backend` | Node.js |
| `Bancos de dados` | `Databases` | Microsoft SQL Server (MSSQL) |
| `Infraestrutura` | `Infrastructure` | Docker, Git, `Arquitetura de monorepo` / `Monorepo architecture` |
| `Automação` | `Automation` | n8n |
| `Práticas` | `Practices` | `Modelagem de dados, Análise de sistemas, Code review, Liderança técnica` / `Data Modeling, Systems Analysis, Code Review, Technical Leadership` |
| `Aprendendo` | `Learning` | Go |

**Go is out of `Languages` and into `Aprendendo` / `Learning`.** It appears **nowhere in any experience bullet** — all four roles are React, TypeScript, Node.js, MSSQL, Docker and n8n — and its only other appearance is the *Learn Go Course* certification. Listing it beside three languages he demonstrably ships creates a false equivalence, and the downside is asymmetric: a Tech Lead who lists Go and cannot discuss production Go loses more than the line ever earned.

**This makes the site diverge from the résumé's grouping.** The résumé is the weaker document here; it should follow the site. See §9.

### Education & certifications

**pt**
- `Centro Universitário UniCarioca — Rio de Janeiro, Brasil`
- `Tecnólogo em Análise e Desenvolvimento de Sistemas · 2020 – 2022 (concluído)`
- Certificações: `Ignite – ReactJS`, `Learn Go Course`
- Idiomas: `Português (nativo) · Inglês (proficiência profissional de trabalho)`

**en**
- `Centro Universitário UniCarioca — Rio de Janeiro, Brazil`
- `Technologist Degree in Systems Analysis and Development · 2020 – 2022 (completed)`
- Certifications: `Ignite – ReactJS`, `Learn Go Course`
- Languages: `Portuguese (native) · English (professional working proficiency)`

**`(concluído)` / `(completed)` is explicit on purpose.** The current site says *"Janeiro 2020 até a data atual"*, which is false — the résumé's `2020 – 2022` has no open end. The ticket asked for this confirmation and the answer is that the degree is finished.

### Contact

**pt** — `Estou aberto a conversas sobre posições de liderança técnica. O caminho mais rápido é o e-mail.` **(voice)**

**en** — `I'm open to conversations about technical leadership roles. Email is the fastest route.` **(voice)**

| Link | pt label | en label | Target |
| --- | --- | --- | --- |
| Email | `E-mail` | `Email` | `mailto:vinitag190@gmail.com` |
| LinkedIn | `LinkedIn` | `LinkedIn` | `https://www.linkedin.com/in/viniciusoliveiras-01532/` |
| GitHub | `GitHub` | `GitHub` | `https://github.com/viniciusoliveiras` |
| Résumé | `Currículo (em inglês)` | `Résumé (PDF)` | `/resume-en.pdf` |

**No form** (ADR-0001), **no Instagram** (cut as off-message), and **the phone number is not published** in the HTML — it stays on the PDF.

The Portuguese label names the language. One English PDF serves both locales because the résumé is the source of truth for every experience claim on this page, and two hand-maintained copies is the `facts.ts` hazard at document scale **with no compiler watching** — the message-module decision put the numbers in one locale-neutral file precisely because *"a `400+` typo'd in one of two locale modules is beyond the compiler's reach."*

### 404

The surviving joke, which is kept because it has voice:

**pt** — `Whoops!` · `404 | Página não encontrada` · `Parece que esta página é tímida e não quer aparecer no portfólio`

**en** — `Whoops!` · `404 | Page not found` · `Looks like this page is shy and would rather not show up in the portfolio` **(voice)**

The English is a *counterpart*, not a translation — the joke has to land, and a literal rendering of Brazilian phrasing usually doesn't. Back link targets the **locale root**, not the deleted `/home`. The page is bilingual on one file per ADR-0004, so its English half needs a per-element `lang`.

---

## 9. Findings

### 9.1 The English is not a translation, and did not need deciding

The ticket asked whether the English is translated or written independently. The message-module decision had already narrowed this to **wording only**: `en satisfies Messages` makes the *structure* compiler-enforced parallel, so the only remaining freedom is phrasing. Every entry above takes it — the résumé's own English is reused verbatim where it is already good, and the 404 joke is rewritten rather than translated.

### 9.2 The two work entries are asymmetric, and one inherited assumption is wrong

The message-module decision recorded that per work entry this ticket authors *"the title, the prose and the three figure labels."* **The BPO entry has no figures at all** — the résumé gives it no numbers, only an architectural decision.

This is not a gap to fill. **One entry argues by scale and the other by judgement**, which is a stronger pair than two of either, and inventing a figure for the BPO platform would be the only place in this document where a claim did not trace to the résumé. **Handoff to [the prototypes](https://github.com/viniciusoliveiras/portfolio/issues/17): the figure group is per-entry optional, and the two entries will not be visually symmetric.**

### 9.3 Skills values are mixed, so they cannot all be locale-neutral

Most values are proper nouns that do not translate — React, Docker, n8n, Microsoft SQL Server. But **`Practices` translates in full** and `Monorepo architecture` translates too. So the skills block is neither wholly `facts` nor wholly copy: group labels and those two rows live in the locale modules, the proper nouns are shared. Worth knowing before someone tries to lift the whole section into `facts.ts`.

### 9.4 The résumé PDF is stale in two ways at cutover

1. It cites **`viniciusoliveiras.vercel.app`** as the site URL, which the head-and-metadata decision supersedes with a custom domain — so a visitor downloading it is sent to a redirect at best.
2. Its `Languages: TypeScript, JavaScript, SQL, Go` grouping is the one §8 deliberately diverges from.

Both mean the PDF needs a refresh **as part of the cutover**, not after it — it is linked from the contact section of the page it disagrees with.

### 9.5 What the current site got factually wrong

Recorded so no reviewer reintroduces any of it from memory: `Estudante de TI` (a Tech Lead), `Meu foco atual é o React.js integrado com o Next.js` (the stack is TanStack Start and the migration deletes Next), `Janeiro 2020 até a data atual` for a degree that ended in 2022, and an `/about` bio fetched live from the GitHub API which rendered a broken sentence.

---

## 10. What this hands to other tickets

- **[Prototype the seven sections within the fixed design system](https://github.com/viniciusoliveiras/portfolio/issues/17)** — has real text to lay out rather than lorem ipsum, which was the reason this ticket was not blocked. Three inputs: the figure group is **per-entry optional** (§9.2); the group note is a **two-link segment array** and needs to render inline links inside prose; and the Experience section carries numbers *inline* while Selected work carries them as **display figures**, so the two sections treat the same facts differently by design.
- **[Decide the migration strategy and cutover order](https://github.com/viniciusoliveiras/portfolio/issues/19)** — inherits the **résumé PDF refresh** (§9.4) as a cutover step rather than a follow-up, and two unfilled inputs: `DEVEX_URL` and `INOVASENSOR_URL`.
- **The asset-strategy fog patch** — **the résumé PDF question is now half answered.** It is *one* file, English, linked from both locales. Where it is served from is still open, but the answer is constrained: it must sit at a stable path the PDF's own footer can cite, which argues for `public/resume-en.pdf` unhashed, exactly as the fonts resolved.
- **The italic-face question** — this copy **never asks for an inline italic**. There is no pull quote and no figure caption in any of the seven sections. Combined with the message shape having no emphasis segment kind, that is now two independent reasons the third `woff2` file may delete; the prototypes are the last chance for display-level italics to earn it.
