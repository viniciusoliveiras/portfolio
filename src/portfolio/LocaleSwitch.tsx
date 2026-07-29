import { Link, useRouterState } from "@tanstack/react-router";

import { documentLang, type Locale, localeName, localePath } from "~/config";

/**
 * `/pt` ↔ `/en` is the ONLY route change on the entire site — the four bar anchors
 * are same-page hash links — and a peculiar one: the layout is byte-identical and
 * every string is replaced. Left instant, every word changes in one frame, which reads
 * as a rendering glitch rather than a navigation. Hence the 200ms cross-fade, via
 * same-document View Transitions retimed in the base layer. One router prop, no JS.
 *
 * `resetScroll={false}` holds the reader's scroll offset and the carried hash lands
 * them on the right SECTION — both are needed, because the two locales are the same
 * layout with different text and so never land at identical pixel offsets.
 */
export function LocaleSwitch({
	locale,
	onNavigate,
}: {
	locale: Locale;
	onNavigate?: () => void;
}) {
	// Only the hash is read from router state. The locale itself travels as a prop
	// rather than being string-matched off `pathname`, which the route file already
	// knows for certain.
	const hash = useRouterState({ select: (s) => s.location.hash });
	const other: Locale = locale === "en" ? "pt" : "en";

	return (
		<Link
			to={localePath[other]}
			hash={hash || undefined}
			resetScroll={false}
			hrefLang={documentLang[other]}
			viewTransition
			onClick={onNavigate}
			className="font-mono text-label text-muted uppercase hover:text-ink"
		>
			{localeName[other]}
		</Link>
	);
}
