import { AUTHOR_NAME, type Locale } from "~/config";
import type { Messages } from "~/content/pt";
import { BAR_ANCHORS } from "./anchors";
import { LocaleSwitch } from "./LocaleSwitch";
import { Sheet } from "./Sheet";

/**
 * The sticky 56px bar. Its underside is `rule-strong`, not `rule`: it bounds an
 * interactive surface, so it carries a WCAG obligation of 3:1 rather than a shade
 * preference.
 *
 * BOTH NAVS SHIP IN THE PRERENDERED HTML with the breakpoint hiding one, because a JS
 * media query cannot survive prerendering — it would bake one branch into the static
 * output and mismatch on hydration for every visitor on the other side of the
 * breakpoint. The hidden one must be hidden with `display: none` so assistive
 * technology does not reach it, which is what `hidden`/`md:hidden` compile to. There
 * is no id collision: the anchor ids live on the sections, not on these links.
 */
export function Bar({ locale, nav }: { locale: Locale; nav: Messages["nav"] }) {
	return (
		<header className="sticky top-0 z-40 border-b border-rule-strong bg-paper">
			<div className="measure-rail flex h-14 w-full items-center justify-between text-body">
				{/* The name, not a link: this is a running head, and a self-link on a
				    single-page site is noise. */}
				<span className="text-body-sm text-ink optical-16">{AUTHOR_NAME}</span>

				{/* No `aria-label`: `nav.menuLabel` names THE SHEET, and borrowing it
				    here would tell a screen reader that the bar is the mobile menu. Only
				    one of the two navs is ever reachable — the other is `display: none` —
				    so there are never two nav landmarks to tell apart. */}
				<nav className="hidden items-center gap-6 md:flex">
					{BAR_ANCHORS.map((key) => (
						<a
							key={key}
							href={`#${key}`}
							className="font-mono text-label text-muted uppercase hover:text-ink"
						>
							{nav.sections[key]}
						</a>
					))}
					<LocaleSwitch locale={locale} />
				</nav>

				<div className="md:hidden">
					<Sheet locale={locale} nav={nav} />
				</div>
			</div>
		</header>
	);
}
