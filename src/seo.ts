import {
	AUTHOR_NAME,
	documentLang,
	type Locale,
	ogLocale,
	SITE_ORIGIN,
} from "./config";
import type { Messages } from "./content/pt";

/**
 * A minimal `Person` block, declared in exactly one place.
 *
 * `script:ld+json` entries are handled by their own branch BEFORE the dedupe branch
 * and carry no `name`/`property`, so they are NEVER deduplicated — declaring one on
 * the root and one on a locale route ships two competing descriptions of the same
 * person. This therefore goes on the locale routes only.
 *
 * `jobTitle` does not vary, deliberately: "Tech Lead" is the title used in Portuguese
 * too. That leaves `url` as the only locale-varying field, which is why this takes a
 * locale at all. Instagram is not in `sameAs` — ADR-0001 dropped it as off-message.
 */
const personLd = (locale: Locale) => ({
	"@context": "https://schema.org",
	"@type": "Person",
	name: AUTHOR_NAME,
	url: `${SITE_ORIGIN}/${locale}`,
	jobTitle: "Tech Lead",
	knowsLanguage: ["pt-BR", "en"],
	sameAs: [
		"https://github.com/viniciusoliveiras",
		"https://www.linkedin.com/in/viniciusoliveiras-01532/",
	],
});

/**
 * Everything that varies by locale. Built here rather than inline in each route file
 * so a mistyped `property` key is made ONCE rather than twice — which is the only
 * available mitigation, because `MetaDescriptor`'s union ends in
 * `Record<string, unknown>` and accepts anything: a typo in a meta key is caught by
 * nothing, not the compiler, not Biome, not the build.
 */
export function localeHead(locale: Locale, m: Messages) {
	const url = `${SITE_ORIGIN}/${locale}`;

	return {
		meta: [
			{ title: m.meta.title },
			{ name: "description", content: m.meta.description },
			{ property: "og:title", content: m.meta.title },
			{ property: "og:description", content: m.meta.description },
			{ property: "og:url", content: url },
			{ property: "og:locale", content: ogLocale[locale] },
			{
				property: "og:locale:alternate",
				content: ogLocale[locale === "en" ? "pt" : "en"],
			},
			// `name`, not `property` — the Twitter/X card spec says `name`, and since
			// the dedupe key is `m.name ?? m.property`, mixing the two forms across
			// routes would produce two independent entries that never override.
			{ name: "twitter:title", content: m.meta.title },
			{ name: "twitter:description", content: m.meta.description },
			{ "script:ld+json": personLd(locale) },
		],
		links: [
			// Self-referential per locale: two locales are ALTERNATES, not duplicates,
			// and pointing both at one URL would deindex the other.
			{ rel: "canonical", href: url },
			// Reciprocity is required — each page lists both locales plus `x-default`,
			// including itself. `x-default` points at the bare origin so it resolves
			// through the edge `Accept-Language` detector rather than hard-coding a
			// preferred locale.
			{
				rel: "alternate",
				hrefLang: documentLang.pt,
				href: `${SITE_ORIGIN}/pt`,
			},
			{
				rel: "alternate",
				hrefLang: documentLang.en,
				href: `${SITE_ORIGIN}/en`,
			},
			{ rel: "alternate", hrefLang: "x-default", href: SITE_ORIGIN },
		],
	};
}
