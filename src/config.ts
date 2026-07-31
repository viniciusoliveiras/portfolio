/**
 * The canonical origin, written EXACTLY ONCE. Canonical, both `hreflang`
 * alternates, `x-default`, `og:url`, `twitter` URLs and the JSON-LD `url` all derive
 * from it — which retires the live defect where the site served from two origins
 * with `rel="canonical"` appearing nowhere.
 *
 * This took the shorter of the two existing `*.vercel.app` hosts at launch, and the
 * custom domain in Phase 4 of the cutover. That is a one-line change here, not
 * eleven tags.
 *
 * **Phase 4 performed 2026-07-31. It is the `www` host, deliberately.** The apex
 * `viniciusoliveiras.com` 308s to `www`, which is the domain Vercel serves production
 * on — so the apex cannot be this value. A `canonical` naming a host that redirects is
 * the defect this constant exists to prevent, pointed at a different host. The résumé
 * PDF still prints the bare apex, because there it is display text a human types and
 * the 308 carries them; only machine-read URLs need the host that answers 200.
 */
export const SITE_ORIGIN = "https://www.viniciusoliveiras.com";

/**
 * Not copy: the name is rendered as-is from the résumé's own header, so it never
 * varies by locale and does not belong in the message modules.
 *
 * SPLIT INTO ITS TWO PARTS because ADR-0006's hero sets them on separate lines with
 * the surname in accent italic, and the bar's monogram takes an initial from each.
 * `AUTHOR_NAME` is composed rather than written a second time, so the full name and
 * its parts cannot disagree — and note there is no accent on the `i`, which a
 * previous pass got wrong and had to correct.
 */
export const AUTHOR_GIVEN = "Vinicius";
export const AUTHOR_FAMILY = "Oliveira";
export const AUTHOR_NAME = `${AUTHOR_GIVEN} ${AUTHOR_FAMILY}`;

/**
 * The monogram in the bar: `V`, an italic accent `O`, and a full stop. `charAt`
 * rather than `[0]`, which is `string | undefined` under
 * `noUncheckedIndexedAccess` and would need a non-null assertion to render.
 */
export const AUTHOR_INITIALS = {
	given: AUTHOR_GIVEN.charAt(0),
	family: AUTHOR_FAMILY.charAt(0),
};

/** The locale tag travels as an explicit prop, never string-matched off the path. */
export type Locale = "pt" | "en";

/**
 * The document language per locale — `pt-BR`, not `pt`, matching the résumé's
 * audience, while the URL segment stays the shorter `/pt`. The two are deliberately
 * different and both are right.
 */
export const documentLang: Record<Locale, string> = {
	pt: "pt-BR",
	en: "en",
};

/** The Open Graph form of each locale, which is neither the URL segment nor `lang`. */
export const ogLocale: Record<Locale, string> = {
	pt: "pt_BR",
	en: "en_US",
};

/**
 * What the language switcher CALLS the other locale — each name written in the
 * language it leads to, which is the whole convention of a language switcher.
 *
 * These three maps replace what were ternaries on `Locale` scattered across the
 * switcher, the head builder and the shell. Anything that varies by locale and is not
 * copy belongs beside them.
 */
export const localeName: Record<Locale, string> = {
	pt: "Português",
	en: "English",
};

/**
 * The two-letter form the BAR shows — ADR-0006's design renders the switch as `PT →`
 * rather than spelling the language out, because the bar's anchor row has no width to
 * spare once it carries five anchors.
 *
 * This is a display abbreviation, NOT an accessible name. The switch keeps
 * `localeName` on its `aria-label`, so a screen reader is told "Português" and never
 * "P T arrow" — and the sheet, which has room, uses `localeName` visibly.
 */
export const localeCode: Record<Locale, string> = {
	pt: "PT",
	en: "EN",
};

/** The route path for a locale, kept literal so `Link`'s `to` stays type-checked. */
export const localePath = { pt: "/pt", en: "/en" } as const;
