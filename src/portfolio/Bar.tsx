import { AUTHOR_INITIALS, AUTHOR_NAME, type Locale } from "~/config";
import type { Messages } from "~/content/pt";
import { BAR_ANCHORS } from "./anchors";
import { LocaleSwitch } from "./LocaleSwitch";
import { Sheet } from "./Sheet";

/**
 * The sticky bar. Translucent over the page rather than opaque — `bar-surface` mixes
 * 85% paper with transparent and blurs 12px behind it — which is what stops a full-ink
 * section rule appearing to vanish as it passes beneath.
 *
 * Its underside is `rule`, the hairline, NOT the superseded `rule-strong`. That token
 * existed to give an interactive surface's boundary the 3:1 WCAG non-text minimum, and
 * ADR-0006 retires it: the design uses one line value everywhere, and this edge
 * measures ~1.36:1. Recorded in ADR-0006 as accepted with a trigger to reopen, rather
 * than overlooked here.
 *
 * The name is now a MONOGRAM AND A LINK, both reversals. It read as a running head
 * before, deliberately unlinked because a self-link on a single-page site is noise; the
 * design makes it the way back to the top, which on a page this long is a real
 * destination rather than a self-reference. `AUTHOR_NAME` stays as the accessible name,
 * so the link is not announced as "V O period".
 *
 * BOTH NAVS SHIP IN THE PRERENDERED HTML with the breakpoint hiding one, because a JS
 * media query cannot survive prerendering — it would bake one branch into the static
 * output and mismatch on hydration for every visitor on the other side of the
 * breakpoint. The hidden one must be hidden with `display: none` so assistive
 * technology does not reach it, which is what `hidden`/`wide:hidden` compile to. There
 * is no id collision: the anchor ids live on the sections, not on these links.
 */
export function Bar({ locale, nav }: { locale: Locale; nav: Messages["nav"] }) {
	return (
		<header className="sticky top-0 z-40 border-b border-rule bar-surface">
			{/* `items-baseline` is what aligns a 21px serif monogram with an 11px mono
			    anchor — they share a baseline rather than a centre line, which is the
			    difference between this row reading as typeset and as laid out. It is also
			    why the height is COMPOSED from padding rather than set: an explicit height
			    on a baseline-aligned row moves the alignment.

			    So this `py-[14px]` is the origin of `--spacing-bar`, which the sheet's
			    header, `scroll-margin-top` and Skills' sticky mark all derive from. Change
			    it and change the token, or a browser test will tell you. */}
			<div className="page flex items-baseline justify-between gap-6 py-[14px]">
				<a
					href="#top"
					aria-label={AUTHOR_NAME}
					className="font-serif text-wordmark no-underline"
				>
					{AUTHOR_INITIALS.given}
					<em className="text-accent">{AUTHOR_INITIALS.family}</em>.
				</a>

				{/* No `aria-label`: `nav.menuLabel` names THE SHEET, and borrowing it here
				    would tell a screen reader that the bar is the mobile menu. Only one of
				    the two navs is ever reachable — the other is `display: none` — so there
				    are never two nav landmarks to tell apart. */}
				<nav className="hidden flex-wrap justify-end gap-x-[clamp(14px,2vw,26px)] gap-y-2 wide:flex">
					{BAR_ANCHORS.map((key) => (
						<a
							key={key}
							href={`#${key}`}
							className="font-mono text-mark text-muted uppercase no-underline hover:text-accent"
						>
							{nav.anchors[key]}
						</a>
					))}
					<LocaleSwitch locale={locale} compact />
				</nav>

				<div className="wide:hidden">
					<Sheet locale={locale} nav={nav} />
				</div>
			</div>
		</header>
	);
}
