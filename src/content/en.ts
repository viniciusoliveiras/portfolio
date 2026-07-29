// `import type`, not `import` — plain `import` here is TS1484 under
// `verbatimModuleSyntax`.

import { terms } from "./facts";
import type { Messages, Segment } from "./pt";

/**
 * The English is a COUNTERPART, not a translation. `satisfies Messages` makes the
 * structure compiler-enforced parallel, so the only remaining freedom is wording:
 * omitting a key is TS2741, adding one Portuguese lacks is TS2353. A pt-BR recruiter
 * and an English-speaking engineering manager are being addressed differently.
 */
export const en = {
	meta: {
		title: "Vinícius Oliveira — Tech Lead & Full-Stack Developer", // 52
		// The first draft of this came out at exactly 155, sitting on the ceiling with
		// no margin; dropping one word bought three characters of headroom.
		description:
			"Tech Lead in Rio de Janeiro. I lead four developers across two products — a modular ERP monorepo and frontend architecture for a financial BPO platform.", // 152
	},

	nav: {
		openMenu: "Open menu",
		menuLabel: "Navigation menu",
		closeMenu: "Close menu",
		sections: {
			summary: "Summary",
			experience: "Experience",
			// 13 characters — the widest rail label in either locale, measured at 106px
			// against a 128px rail, leaving 22px of headroom.
			work: "Selected work",
			skills: "Skills",
			education: "Education",
			contact: "Contact",
		},
	},

	hero: {
		roleLine: "Tech Lead · Full-Stack Developer · Rio de Janeiro",
		// `own` is deliberate — it is the résumé's own verb, and a stronger claim than
		// "worked on".
		lede: "I lead frontend architecture for a financial BPO platform and own a modular ERP monorepo running in production for enterprise clients.",
		// (voice) — see the pt module.
		actions: {
			contact: { label: "Get in touch", href: "#contact" },
			resume: { label: "Résumé (PDF)", href: "/resume-en.pdf" },
		},
	},

	summary: {
		lede: "I joined the group as an intern in August 2021 and now lead a team of four developers across two products, owning technical direction, code standards, and delivery planning. I work with React, TypeScript, Node.js, and Microsoft SQL Server, with experience in data modeling, containerization, and workflow automation.",
	},

	experience: {
		groupNote: [
			"The roles below are within one company group — Devex Soluções and Inovasensor — whose engineering teams operate jointly across products.",
		] as Segment[],

		// Hyphens, not the en dashes the site copy writes — see the note on the pt
		// module's `roles`.
		roles: {
			lead: {
				period: "April 2026 - Present",
				title: "Tech Lead, Devex Soluções · Technical Lead, Inovasensor",
				bullets: [
					"I lead a team of four developers across two products, owning technical direction, code standards, and delivery planning.",
					"I maintain a modular ERP monorepo of 15 modules serving 8 enterprise clients and 400+ active users.",
					"I define frontend architecture for a financial BPO platform.",
					// "also houses" keeps the résumé's adjacency framing.
					"I contribute to the platform's Node.js backend, inside a monorepo that also houses the product's proprietary AI layer.",
					"I run code reviews and mentor developers, supporting their technical growth.",
				],
			},
			analyst: {
				period: "January 2023 - April 2026",
				title: "Systems Analyst",
				bullets: [
					"I built and maintained ERP modules using React, TypeScript, and Node.js on Microsoft SQL Server.",
					"I designed data models and performed systems analysis for client-facing modules.",
					"I containerized services with Docker to standardize development and deployment.",
					"I built internal process automations with n8n, integrating internal systems with third-party services.",
				],
			},
			intern: {
				period: "August 2021 - December 2022",
				title: "Intern",
				bullets: [
					"I supported the development team on front-end tasks and bug fixing, applying React within production codebases.",
				],
			},
		},

		minorRole: {
			period: "March 2019 - April 2021",
			title: "Ancar Ivanhoe Shopping Centers — Youth Apprentice, Marketing",
		},
	},

	work: {
		erp: {
			title: "Modular ERP monorepo",
			figureLabels: {
				modules: "modules",
				clients: "enterprise clients",
				users: "active users",
			},
			// No client is named, in either locale. The constraint is
			// architecture-and-scale, never client data.
			prose:
				"A modular ERP running in production for enterprise clients. I own the monorepo: I build and maintain the modules in React, TypeScript and Node.js on Microsoft SQL Server, I designed the data models for the client-facing modules, and I standardised development and deployment with Docker.",
			stack: terms.erpStack,
		},
		bpo: {
			title: "Financial BPO platform",
			lockup: { values: terms.bpoStack, label: "Chosen architecture" },
			// The strongest sentence available to the site, and the reason is
			// structural: it is a documented architectural decision with its rationale
			// attached, which is precisely what a Tech Lead is assessed on.
			// "This site runs on the same choice." is (voice) — the fact is true and
			// traceable, but pointing at it is a rhetorical decision.
			prose:
				"I define the platform's frontend architecture. I selected TanStack Start, with TanStack Query handling server state, caching, and loading and error states — over a client-state library, because the product is API-driven. I also contribute to the Node.js backend, inside a monorepo that houses the product's proprietary AI layer. This site runs on the same choice.",
		},
	},

	skills: {
		rows: {
			languages: { label: "Languages", values: terms.languages },
			frontend: { label: "Frontend", values: terms.frontend },
			backend: { label: "Backend", values: terms.backend },
			databases: { label: "Databases", values: terms.databases },
			infrastructure: {
				label: "Infrastructure",
				values: ["Docker", "Git", "Monorepo architecture"],
			},
			automation: { label: "Automation", values: terms.automation },
			practices: {
				label: "Practices",
				values: [
					"Data Modeling",
					"Systems Analysis",
					"Code Review",
					"Technical Leadership",
				],
			},
			learning: { label: "Learning", values: terms.learning },
		},
	},

	education: {
		degree: {
			period: "2020 - 2022 · completed",
			title: "Technologist Degree in Systems Analysis and Development",
			institution: "Centro Universitário UniCarioca — Rio de Janeiro, Brazil",
		},
		certifications: {
			label: "Certifications",
			values: terms.certifications,
		},
		languages: {
			label: "Languages",
			values: [
				"Portuguese (native)",
				"English (professional working proficiency)",
			],
		},
	},

	contact: {
		// (voice)
		statement:
			"I'm open to conversations about technical leadership roles. Email is the fastest route.",
		links: {
			email: {
				label: "Email",
				value: "vinitag190@gmail.com",
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
				label: "Résumé (PDF)",
				value: "resume-en.pdf",
				href: "/resume-en.pdf",
			},
		},
	},

	notFound: {
		whoops: "Whoops!",
		title: "404 | Page not found",
		// (voice) — a counterpart, not a translation. A literal rendering of the
		// Brazilian phrasing does not land.
		message:
			"Looks like this page is shy and would rather not show up in the portfolio",
		back: "Back to the start",
	},
} satisfies Messages;
