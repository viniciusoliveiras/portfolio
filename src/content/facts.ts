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
	bpoStack: ["TanStack Start", "TanStack Query"],
} as const;
