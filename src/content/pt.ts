import { terms } from "./facts";

/**
 * A message that needs an inline link. Links only — there is deliberately no
 * emphasis kind, and JSX-valued messages are forbidden: a message typed as a node is
 * assignable to any other node, which switches `satisfies Messages` off for exactly
 * the strings most likely to diverge. See i18n §8.1c.
 *
 * ADR-0006's design sets several phrases in accent italic. That did NOT become an
 * emphasis segment kind: in every case the emphasised run is a fixed clause the
 * component can wrap, so the copy stays a plain string and the italic stays in the
 * component. A message that carried its own emphasis would reopen exactly the
 * any-node-is-assignable hole this type exists to close.
 */
export type Segment = string | { text: string; href: string };

/**
 * pt-BR is the CANONICAL locale, because ADR-0004's edge detector sends every
 * non-English visitor to `/pt` — including Spanish and French — so Portuguese is the
 * copy that must never have a hole. Making it the type makes a hole here structurally
 * impossible rather than merely caught.
 *
 * NO `as const`: literal types would make English unassignable (TS2322, measured).
 */
export const pt = {
	meta: {
		// Budgets from head-and-metadata §5, counted by code point, not estimated.
		title: "Vinicius Oliveira — Tech Lead e Desenvolvedor Full-Stack", // 56
		description:
			"Tech Lead no Rio de Janeiro. Lidero quatro desenvolvedores em dois produtos — um monorepo de ERP e a arquitetura de frontend de um BPO financeiro.", // 146
	},

	/**
	 * Page furniture that belongs to no single section. Both strings are the footer's,
	 * and the key is deliberately not called `footer`: the hero's eyebrow drew on this
	 * too until it was cut, and a section-shaped name would make restoring anything here
	 * feel like a violation.
	 *
	 * TWO STRINGS WERE DELETED WITH THAT EYEBROW: `kind` ("Portfólio", composed with
	 * `facts.year`) and `availability` ("Aberto a conversas"). The second matters beyond
	 * layout — with it gone the page makes NO AVAILABILITY CLAIM ANYWHERE again, which is
	 * the position [site copy](../../docs/site-copy.md) argued for and which ADR-0006 had
	 * relocated rather than reversed. Do not reintroduce one here without reading that
	 * argument: it holds that a portfolio owes a reader no statement of availability, and
	 * that such a line is the only sentence on the page able to go stale with no fact
	 * changing.
	 */
	chrome: {
		place: "Rio de Janeiro, BR",
		builtWith: "Feito com TanStack Start",
	},

	nav: {
		// The sheet's `aria-label` and its trigger's. Copy, so they live here rather
		// than hardcoded in the component. See the sheet spec §10.
		openMenu: "Abrir menu",
		menuLabel: "Menu de navegação",
		// A third key the sheet spec should have handed over alongside those two: an
		// icon-only close button needs an accessible name, and the sheet's close
		// affordance is the first focusable element inside it.
		closeMenu: "Fechar menu",
		/**
		 * The six sections that carry an id, named as their SECTION MARK reads — the
		 * `01 / Resumo` string in the left column.
		 *
		 * `Trabalhos selecionados` is now written in full. The short `Trabalhos` was a
		 * LAYOUT CONSTRAINT of the superseded direction's 128px rail, where the long
		 * form wrapped to three lines. ADR-0006's mark sits in a 260px column, so the
		 * constraint is retired and the copy is free to say what it means.
		 */
		sections: {
			summary: "Resumo",
			experience: "Experiência",
			work: "Trabalhos selecionados",
			skills: "Competências",
			education: "Formação",
			contact: "Contato",
		},
		/**
		 * The bar's FIVE anchors — what is worth jumping to — authored SEPARATELY from
		 * the section marks above rather than reusing them.
		 *
		 * Four of the five read identically to their mark today, which looks like
		 * duplication and is not: the bar abbreviates where the mark does not, and it
		 * does so in both locales. `Trabalhos` here against `Trabalhos selecionados`
		 * above is the case that proves the two roles need two strings; collapsing them
		 * would force the bar to carry the long form or the mark to carry the short one.
		 */
		anchors: {
			experience: "Experiência",
			work: "Trabalhos",
			skills: "Competências",
			education: "Formação",
			contact: "Contato",
		},
	},

	hero: {
		lede: "Lidero a arquitetura de frontend de uma plataforma de BPO financeiro e respondo por um monorepo de ERP modular em produção para clientes corporativos.",
		/**
		 * The three-column meta grid beneath the name, which replaces the superseded
		 * direction's single `roleLine`. That line said "Tech Lead · Desenvolvedor
		 * Full-Stack · Rio de Janeiro" — one string doing three jobs, with the city
		 * buried at the end; here the city moves to `chrome.place` and the two facts get
		 * labels.
		 *
		 * Each value is an ARRAY OF LINES, not a string with a `<br>`. The design breaks
		 * all three deliberately, and a message containing markup is the JSX-valued
		 * message the `Segment` type exists to forbid. The component joins them with a
		 * line break, so a locale wanting one line simply supplies one element.
		 */
		meta: {
			role: {
				label: "Cargo",
				value: ["Tech Lead ·", "Desenvolvedor Full-Stack"],
			},
			currently: {
				label: "Atualmente",
				value: ["Devex Soluções ·", "Inovasensor"],
			},
			since: {
				label: "Desde",
				value: ["Ago 2021 —", "de estagiário a lead"],
			},
		},
		// (voice) — the site copy fixes the hero's two ACTIONS but never authors their
		// labels. The résumé label reuses §Contact's, which names the language.
		actions: {
			contact: { label: "Entre em contato", href: "#contact" },
			resume: { label: "Currículo (em inglês)", href: "/resume-en.pdf" },
		},
	},

	summary: {
		/**
		 * The design sets `uma equipe de quatro desenvolvedores em dois produtos` in
		 * accent italic. That clause is not marked up here — the component matches and
		 * wraps it — so this stays one plain string. See the note on `Segment`.
		 */
		lede: "Entrei no grupo como estagiário em agosto de 2021 e hoje lidero uma equipe de quatro desenvolvedores em dois produtos, respondendo por direção técnica, padrões de código e planejamento de entregas. Trabalho com React, TypeScript, Node.js e Microsoft SQL Server, com experiência em modelagem de dados, conteinerização e automação de processos.",
		emphasis: "uma equipe de quatro desenvolvedores em dois produtos",
	},

	experience: {
		/**
		 * `DEVEX_URL` and `INOVASENSOR_URL` are UNFILLED INPUTS, like `SITE_ORIGIN`.
		 * Neither company has a public URL on file, so the clause degrades to a plain
		 * string exactly as the segment shape intends — the sentence renders in full,
		 * minus the anchors. To fill one, split this string and swap the company name
		 * for `{ text: "Devex Soluções", href: DEVEX_URL }`.
		 *
		 * The `as Segment[]` widening is load-bearing, not decoration: without it
		 * `typeof pt` infers `string[]` here, and English could then never carry a
		 * link that Portuguese does not — the shape would be locked shut by the
		 * canonical locale happening to have no anchor filled in yet.
		 *
		 * SHORTENED by ADR-0006. The superseded form opened "Os cargos abaixo são…",
		 * which the design's layout makes redundant: the note now sits inline on the
		 * section's own header row, to the right of the mark, where "below" no longer
		 * describes where the roles are.
		 */
		groupNote: [
			"Um só grupo de empresas — Devex Soluções e Inovasensor —, cujas equipes de engenharia atuam de forma conjunta entre os produtos.",
		] as Segment[],

		/** The suffix on the current role's decade marker: `2026 — hoje`. */
		now: "hoje",

		/**
		 * Keyed, not positional, on facts.ts's own precedent: an array would let English
		 * silently ship three roles against Portuguese's four.
		 *
		 * Every `period` uses an EM DASH and an abbreviated month, and is uppercased by
		 * the component rather than in the copy. This supersedes the hyphen rule the
		 * section layouts fixed: ADR-0006's design writes `ABR 2026 — PRESENTE`, and a
		 * hyphen inside a tracked mono caps line reads as a minus sign. Casing stays out
		 * of the string so a screen reader is not handed shouted text.
		 */
		roles: {
			lead: {
				period: "abr 2026 — presente",
				title: "Tech Lead, Devex Soluções · Líder Técnico, Inovasensor",
				bullets: [
					"Lidero uma equipe de quatro desenvolvedores em dois produtos, respondendo por direção técnica, padrões de código e planejamento de entregas.",
					"Mantenho um monorepo de ERP modular com 15 módulos, atendendo 8 clientes corporativos e mais de 400 usuários ativos.",
					"Defino a arquitetura de frontend de uma plataforma de BPO financeiro.",
					// "também abriga" is deliberate: it states adjacency to the AI layer
					// without implying authorship of it.
					"Contribuo com o backend em Node.js da plataforma, dentro de um monorepo que também abriga a camada de IA proprietária do produto.",
					"Conduzo code reviews e faço mentoria de desenvolvedores, apoiando seu crescimento técnico.",
				],
			},
			analyst: {
				period: "jan 2023 — abr 2026",
				title: "Analista de Sistemas",
				bullets: [
					"Construí e mantive módulos do ERP em React, TypeScript e Node.js sobre Microsoft SQL Server.",
					"Desenhei modelos de dados e fiz análise de sistemas para os módulos que chegam ao cliente.",
					"Conteinerizei serviços com Docker para padronizar desenvolvimento e deploy.",
					"Construí automações de processos internos com n8n, integrando sistemas internos a serviços de terceiros.",
				],
			},
			intern: {
				period: "ago 2021 — dez 2022",
				title: "Estagiário",
				bullets: [
					"Apoiei o time de desenvolvimento em tarefas de front-end e correção de bugs, aplicando React em bases de código em produção.",
				],
			},
		},

		// One line, no bullets, by decision — present so the site and the résumé do
		// not disagree about employment history, and given no prose because it
		// contributes nothing to problem, scale, stack or contribution.
		minorRole: {
			period: "mar 2019 — abr 2021",
			title: "Ancar Ivanhoe Shopping Centers — Jovem Aprendiz, Marketing",
		},
	},

	work: {
		// Two entries, asymmetric on purpose: one argues by SCALE, the other by
		// JUDGEMENT. That is a stronger pair than two of either, and inventing a
		// figure for the BPO platform would be the only claim here not tracing to the
		// résumé. See site copy §9.2.
		erp: {
			// The card's accent eyebrow. New under ADR-0006: the design gives each work
			// card a one-line status above its title, and this entry's argument is that
			// it is not a demo.
			eyebrow: "Em produção",
			title: "Monorepo de ERP modular",
			// Authored labels paired with `facts` values by KEY.
			figureLabels: {
				modules: "módulos",
				clients: "clientes corporativos",
				users: "usuários ativos",
			},
			prose:
				"Um ERP modular em produção para clientes corporativos. Respondo pelo monorepo: construí e mantenho os módulos em React, TypeScript e Node.js sobre Microsoft SQL Server, desenhei os modelos de dados dos módulos que chegam ao cliente e padronizei desenvolvimento e deploy com Docker.",
			stack: terms.erpStack,
		},
		bpo: {
			title: "Plataforma de BPO financeiro",
			/**
			 * The chosen architecture, in the position the other entry sets its figures —
			 * otherwise the skim layer carries scale but not judgement.
			 *
			 * `roles` are keyed to `terms.bpoArchitecture`, so each chip's role label
			 * cannot drift from the technology it labels. The `values` array this replaced
			 * paired them by index.
			 *
			 * ~~The entry's trailing stack line is suppressed when this lockup is present,
			 * or the page says "TanStack Start · TanStack Query" twice, eight lines
			 * apart.~~ **Overturned by ADR-0006:** the design prints BOTH, and the
			 * repetition it feared does not occur, because the chips and the stack line
			 * now sit in different columns of the same card and read as a lockup with a
			 * caption rather than as the same list twice. Both are composed from
			 * `terms.bpoArchitecture`, so they cannot disagree.
			 */
			lockup: {
				label: "Arquitetura escolhida",
				roles: {
					framework: "framework",
					serverState: "estado de servidor",
					backend: "backend",
				},
			},
			// The closing sentence — `Este site roda na mesma escolha.` — is **(voice)**:
			// the fact is true and traceable, but the decision to point at it is a
			// rhetorical one, so it can be rewritten without checking a source. It turns
			// "the site itself is the one live craft demo" from a claim the reader takes
			// on trust into one they are currently standing inside.
			prose:
				"Defino a arquitetura de frontend da plataforma. Escolhi TanStack Start, com TanStack Query cuidando de estado de servidor, cache e estados de carregamento e erro — em vez de uma biblioteca de estado de cliente, porque o produto é orientado a API. Também contribuo com o backend em Node.js, dentro de um monorepo que abriga a camada de IA proprietária do produto. Este site roda na mesma escolha.",
			// The same claim as the prose's last sentence, restated as a mono footnote
			// under the chips. It is NOT redundant: the prose sentence is read, this one
			// is skimmed, and the design puts them in different columns.
			sameStack: "Este site roda na mesma stack",
		},
	},

	skills: {
		// The résumé's seven groupings plus `Aprendendo`. Go is OUT of Languages: it
		// appears in no experience bullet, and listing it beside three languages he
		// demonstrably ships creates a false equivalence. The résumé is the weaker
		// document here and should follow the site.
		rows: {
			languages: { label: "Linguagens", values: terms.languages },
			frontend: { label: "Frontend", values: terms.frontend },
			backend: { label: "Backend", values: terms.backend },
			databases: { label: "Bancos de dados", values: terms.databases },
			// The two rows that genuinely translate, per site copy §9.3. `Infra` is
			// ADR-0006's abbreviation of `Infraestrutura`, which the design's 130px label
			// column cannot hold on one line.
			infrastructure: {
				label: "Infra",
				values: ["Docker", "Git", "Arquitetura de monorepo"],
			},
			automation: { label: "Automação", values: terms.automation },
			practices: {
				label: "Práticas",
				values: [
					"Modelagem de dados",
					"Análise de sistemas",
					"Code review",
					"Liderança técnica",
				],
			},
			learning: { label: "Aprendendo", values: terms.learning },
		},
	},

	education: {
		degree: {
			// `concluído` is explicit on purpose: the current site says "Janeiro 2020
			// até a data atual", which is false — the degree ended in 2022. Em dash and
			// sentence case per the note on `roles`; the component uppercases it.
			period: "2020 — 2022 · concluído",
			title: "Tecnólogo em Análise e Desenvolvimento de Sistemas",
			institution: "Centro Universitário UniCarioca — Rio de Janeiro, Brasil",
		},
		certifications: {
			// `Certs` is ADR-0006's abbreviation, for the same 130px column as `Infra`.
			label: "Certs",
			values: terms.certifications,
		},
		languages: {
			label: "Idiomas",
			values: [
				"Português (nativo)",
				"Inglês (proficiência profissional de trabalho)",
			],
		},
	},

	contact: {
		// (voice) — rewritten 2026-07-29, and NOT reversed by ADR-0006. This line used
		// to claim "Estou aberto a conversas sobre posições de liderança técnica", which
		// stopped being true. It still makes no availability claim, and now nothing else
		// on the page does either: ADR-0006's design put one in the hero eyebrow, and
		// that eyebrow was cut. So this sentence is not merely neutral to avoid saying it
		// twice — it is the whole of the page's position on the subject, which is silence.
		statement:
			"Gosto de conversar sobre arquitetura de frontend e liderança técnica. O caminho mais rápido é o e-mail.",
		// The design sets the second sentence in accent italic; matched and wrapped by
		// the component, so this stays a plain string.
		emphasis: "O caminho mais rápido é o e-mail.",
		// No form (ADR-0001), no Instagram (cut as off-message), and the résumé's
		// phone number is NOT published — it stays on the PDF.
		links: {
			email: {
				label: "E-mail",
				value: "vinitag190@gmail.com",
				// No space after the colon. The current site's `mailto: …` is malformed
				// per RFC 6068 and is retired rather than ported.
				href: "mailto:vinitag190@gmail.com",
			},
			linkedin: {
				label: "LinkedIn",
				value: "linkedin.com/in/viniciusoliveiras-01532",
				href: "https://www.linkedin.com/in/viniciusoliveiras-01532/",
			},
			github: {
				label: "GitHub",
				value: "github.com/viniciusoliveiras",
				href: "https://github.com/viniciusoliveiras",
			},
			resume: {
				// The Portuguese label names the language. One English PDF serves both
				// locales, because the résumé is the source of truth for every
				// experience claim on this page.
				label: "Currículo (em inglês)",
				value: "resume-en.pdf",
				href: "/resume-en.pdf",
			},
		},
	},

	// The one sanctioned flourish. Lives in the message modules so both halves of
	// the bilingual /404 stay compiler-enforced parallel.
	notFound: {
		whoops: "Whoops!",
		title: "404 | Página não encontrada",
		message: "Parece que esta página é tímida e não quer aparecer no portfólio",
		// Targets the LOCALE ROOT, not the deleted /home.
		back: "Voltar ao início",
	},
};

export type Messages = typeof pt;
