/**
 * The canonical origin, written EXACTLY ONCE. Canonical, both `hreflang`
 * alternates, `x-default`, `og:url`, `twitter` URLs and the JSON-LD `url` all derive
 * from it — which retires the live defect where the site served from two origins
 * with `rel="canonical"` appearing nowhere.
 *
 * This takes the shorter of the two existing `*.vercel.app` hosts at launch, and the
 * custom domain in Phase 4 of the cutover. That is a one-line change here, not
 * eleven tags. Both vercel.app hostnames serve the same production deployment, so
 * pointing both canonicals at this one value fixes the duplicate-content defect
 * immediately rather than at domain-swap time.
 */
export const SITE_ORIGIN = "https://viniciusoliveiras.vercel.app";

/**
 * Not copy: the name is rendered as-is from the résumé's own header, so it never
 * varies by locale and does not belong in the message modules.
 */
export const AUTHOR_NAME = "Vinícius Oliveira";

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
