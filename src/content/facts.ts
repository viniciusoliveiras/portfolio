/**
 * Locale-neutral content. Plain data, no React import, `.ts` not `.tsx`.
 *
 * The hard numbers live here exactly once. Duplicating `400+` across two locale
 * modules puts it beyond the compiler's reach — two strings of the correct shape,
 * one of them typo'd, and nothing to report. See i18n §8.1d.
 */

/**
 * Keyed, never positional: under `noUncheckedIndexedAccess` a `figures[1]` is
 * `string | undefined`, and index-pairing also tolerates a locale supplying fewer
 * labels than there are figures. Keys make the pairing structural.
 *
 * `as const` is correct HERE and a hard build failure in the locale modules —
 * literal types would make English unassignable to Portuguese (TS2322). `facts` is
 * never compared by `satisfies`, so the narrowing is free.
 */
export const facts = {
	yearsInGroup: "5",
	teamSize: "4",
	products: "2",
	erpModules: "15",
	erpClients: "8",
	erpUsers: "400+",

	/**
	 * The year in the hero's eyebrow and the footer's copyright, WRITTEN RATHER THAN
	 * COMPUTED. `new Date().getFullYear()` would be evaluated at prerender time, which
	 * makes the static output a function of the build date — the year would change
	 * without a commit, and `tests/prerendered-output.test.ts` asserts against fixed
	 * strings. One edit a year in one place beats a snapshot that rots on New Year's
	 * Day in a way nobody notices until January.
	 */
	year: "2026",

	/**
	 * The decade marker set large beside each role — ADR-0006's occupant of the
	 * position the superseded direction gave to display figures.
	 *
	 * Locale-neutral and keyed to the same role names the locale modules use, so a
	 * marker cannot drift from its role. NOT derived by slicing the `period` string:
	 * the periods are authored per locale ("abr 2026 — presente"), and parsing copy to
	 * recover a number is how a pt-BR month abbreviation ends up rendered as a year.
	 */
	roleDecades: {
		lead: "2026",
		analyst: "2023",
		intern: "2021",
		minor: "2019",
	},
} as const;

/**
 * Locale-neutral proper nouns, referenced from BOTH locale modules.
 *
 * Site copy §9.3 established that the skills values are shared while their group
 * labels and the two genuinely translating rows (`Practices`, `Monorepo
 * architecture`) are not — but it never named a home for the shared half, and the
 * i18n decision's file list is exactly three modules. `facts.ts` is the only
 * locale-neutral content module, so it takes them. Recorded as a corpus gap in the
 * effort's notes rather than decided locally.
 */
export const terms = {
	languages: ["TypeScript", "JavaScript", "SQL"],
	frontend: ["React", "TanStack Start", "TanStack Query"],
	backend: ["Node.js"],
	databases: ["Microsoft SQL Server (MSSQL)"],
	automation: ["n8n"],
	learning: ["Go"],
	certifications: ["Ignite – ReactJS", "Learn Go Course"],
	erpStack: ["TypeScript", "React", "Node.js", "Microsoft SQL Server"],

	/**
	 * The BPO entry's chosen architecture, as a KEYED MAP rather than the flat
	 * `bpoStack` array it replaces.
	 *
	 * ADR-0006's design pairs each of these three with a role label — framework,
	 * server state, backend — in its own chip, and the locale modules supply those
	 * labels under these same keys. An array could not express the pairing without
	 * index-matching, which is the failure mode `facts` exists to prevent.
	 *
	 * The card's trailing stack line is composed from `Object.values` of this map, so
	 * the chips and the stack line cannot disagree and Node.js cannot appear in one
	 * but not the other. INSERTION ORDER IS THE DISPLAY ORDER for both.
	 */
	bpoArchitecture: {
		framework: "TanStack Start",
		serverState: "TanStack Query",
		backend: "Node.js",
	},
} as const;
