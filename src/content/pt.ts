import { terms } from "./facts";

/**
 * A message that needs an inline link. Links only — there is deliberately no
 * emphasis kind, and JSX-valued messages are forbidden: a message typed as a node is
 * assignable to any other node, which switches `satisfies Messages` off for exactly
 * the strings most likely to diverge. See i18n §8.1c.
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
		 * The six sections that carry an id. Each label serves twice — as the rail's
		 * marginalia label (uppercased by the `label` role) and as the anchor text.
		 * The bar takes FOUR of these six; the sheet takes all six. That asymmetry is
		 * correct: the rail names where the reader IS, the bar lists what is worth
		 * jumping TO.
		 *
		 * `Trabalhos` is the short pt-BR form as a LAYOUT CONSTRAINT, not a copy
		 * preference — `TRABALHOS SELECIONADOS` is 22 characters and wraps to three
		 * lines in a 128px rail. See section layouts §3.
		 */
		sections: {
			summary: "Resumo",
			experience: "Experiência",
			work: "Trabalhos",
			skills: "Competências",
			education: "Formação",
			contact: "Contato",
		},
	},

	hero: {
		roleLine: "Tech Lead · Desenvolvedor Full-Stack · Rio de Janeiro",
		lede: "Lidero a arquitetura de frontend de uma plataforma de BPO financeiro e respondo por um monorepo de ERP modular em produção para clientes corporativos.",
		// (voice) — the site copy fixes the hero's two ACTIONS but never authors their
		// labels. The résumé label reuses §Contact's, which names the language.
		actions: {
			contact: { label: "Entre em contato", href: "#contact" },
			resume: { label: "Currículo (em inglês)", href: "/resume-en.pdf" },
		},
	},

	summary: {
		lede: "Entrei no grupo como estagiário em agosto de 2021 e hoje lidero uma equipe de quatro desenvolvedores em dois produtos, respondendo por direção técnica, padrões de código e planejamento de entregas. Trabalho com React, TypeScript, Node.js e Microsoft SQL Server, com experiência em modelagem de dados, conteinerização e automação de processos.",
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
		 */
		groupNote: [
			"Os cargos abaixo são no mesmo grupo de empresas — Devex Soluções e Inovasensor —, cujas equipes de engenharia atuam de forma conjunta entre os produtos.",
		] as Segment[],

		/**
		 * Keyed, not positional, on facts.ts's own precedent: an array would let English
		 * silently ship three roles against Portuguese's four.
		 *
		 * Every `period` below uses a HYPHEN, where the site copy writes an en dash.
		 * The section layouts §6 supersede it: "Date ranges did move to hyphens, where
		 * the rule is typographically right anyway." That is a general statement about
		 * date ranges, and the same document's own Education line — `2020 - 2022 ·
		 * concluído` — is written with a hyphen, so applying it to only one of the two
		 * kinds of date line would leave the page inconsistent with itself.
		 */
		roles: {
			lead: {
				period: "abril de 2026 - presente",
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
				period: "janeiro de 2023 - abril de 2026",
				title: "Analista de Sistemas",
				bullets: [
					"Construí e mantive módulos do ERP em React, TypeScript e Node.js sobre Microsoft SQL Server.",
					"Desenhei modelos de dados e fiz análise de sistemas para os módulos que chegam ao cliente.",
					"Conteinerizei serviços com Docker para padronizar desenvolvimento e deploy.",
					"Construí automações de processos internos com n8n, integrando sistemas internos a serviços de terceiros.",
				],
			},
			intern: {
				period: "agosto de 2021 - dezembro de 2022",
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
			period: "março de 2019 - abril de 2021",
			title: "Ancar Ivanhoe Shopping Centers — Jovem Aprendiz, Marketing",
		},
	},

	work: {
		// Two entries, asymmetric on purpose: one argues by SCALE, the other by
		// JUDGEMENT. That is a stronger pair than two of either, and inventing a
		// figure for the BPO platform would be the only claim here not tracing to the
		// résumé. See site copy §9.2.
		erp: {
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
			// The figure slot takes the CHOSEN ARCHITECTURE instead, in mono, in the
			// exact position the other entry sets its figures — otherwise the skim
			// layer carries scale but not judgement. The entry's trailing stack line
			// is suppressed when this lockup is present, or the page says
			// "TanStack Start · TanStack Query" twice, eight lines apart.
			lockup: { values: terms.bpoStack, label: "Arquitetura escolhida" },
			// The closing sentence — `Este site roda na mesma escolha.` — is **(voice)**:
			// the fact is true and traceable, but the decision to point at it is a
			// rhetorical one, so it can be rewritten without checking a source. It turns
			// "the site itself is the one live craft demo" from a claim the reader takes
			// on trust into one they are currently standing inside.
			prose:
				"Defino a arquitetura de frontend da plataforma. Escolhi TanStack Start, com TanStack Query cuidando de estado de servidor, cache e estados de carregamento e erro — em vez de uma biblioteca de estado de cliente, porque o produto é orientado a API. Também contribuo com o backend em Node.js, dentro de um monorepo que abriga a camada de IA proprietária do produto. Este site roda na mesma escolha.",
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
			// The two rows that genuinely translate, per site copy §9.3.
			infrastructure: {
				label: "Infraestrutura",
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
			// até a data atual", which is false — the degree ended in 2022.
			period: "2020 - 2022 · concluído",
			title: "Tecnólogo em Análise e Desenvolvimento de Sistemas",
			institution: "Centro Universitário UniCarioca — Rio de Janeiro, Brasil",
		},
		certifications: {
			label: "Certificações",
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
		// (voice) — rewritten 2026-07-29. This line used to claim "Estou aberto a
		// conversas sobre posições de liderança técnica", which stopped being true.
		// It now makes NO availability claim in either direction: neither soliciting
		// roles nor announcing that none are wanted. Saying the latter out loud put a
		// negative in the page's last sentence and dated the site to a passing state,
		// which is worse than saying nothing — and nothing is what a portfolio owes a
		// reader here. The statement itself stays, because the section layouts require
		// a closing `lede` before the link list.
		statement:
			"Gosto de conversar sobre arquitetura de frontend e liderança técnica. O caminho mais rápido é o e-mail.",
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
