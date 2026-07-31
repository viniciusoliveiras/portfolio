import { Link, useRouterState } from "@tanstack/react-router";

import {
	documentLang,
	type Locale,
	localeCode,
	localeName,
	localePath,
} from "~/config";

/**
 * `/pt` ↔ `/en` is the ONLY route change on the entire site — the five bar anchors are
 * same-page hash links — and a peculiar one: the layout is byte-identical and every
 * string is replaced. Left instant, every word changes in one frame, which reads as a
 * rendering glitch rather than a navigation. Hence the 200ms cross-fade, via
 * same-document View Transitions retimed in the base layer. One router prop, no JS.
 *
 * `resetScroll={false}` holds the reader's scroll offset and the carried hash lands
 * them on the right SECTION — both are needed, because the two locales are the same
 * layout with different text and so never land at identical pixel offsets.
 *
 * TWO PRESENTATIONS, ONE ACCESSIBLE NAME. `compact` renders ADR-0006's `PT →` for the
 * bar, where five anchors leave no width to spell a language out; the sheet takes the
 * default and says `Português`. `aria-label` is the full name in both cases, so the
 * compact form is never announced as "P T arrow" — and it is set unconditionally
 * rather than only under `compact`, because an `aria-label` that appears and disappears
 * with a prop is the kind of thing that gets half-removed later.
 */
export function LocaleSwitch({
	locale,
	compact = false,
	onNavigate,
}: {
	locale: Locale;
	compact?: boolean;
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
			aria-label={localeName[other]}
			viewTransition
			onClick={onNavigate}
			className={[
				"font-mono text-mark uppercase no-underline",
				// The switch is the one accent-coloured item in the bar's anchor row, which
				// is how it reads as an action rather than as a sixth destination.
				compact ? "text-accent" : "text-muted hover:text-accent",
			].join(" ")}
		>
			{compact ? `${localeCode[other]} →` : localeName[other]}
		</Link>
	);
}
