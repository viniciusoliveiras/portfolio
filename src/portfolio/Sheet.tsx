import { useRef } from "react";

import { AUTHOR_NAME, type Locale } from "~/config";
import type { Messages } from "~/content/pt";
import { SHEET_ANCHORS } from "./anchors";
import { LocaleSwitch } from "./LocaleSwitch";

/**
 * The mobile navigation sheet: a full-bleed overlay on the native `<dialog>`, opened
 * with `showModal()`. No dependency and no hand-rolled focus trap — `showModal()`
 * supplies the focus trap (via `inert` on everything outside), focus restoration to
 * the trigger, `Escape`, and `aria-modal`. `<dialog open>` is NOT a substitute: a
 * dialog opened via the attribute is non-modal and none of those four apply.
 *
 * It holds ZERO React state. The DOM's `open` attribute IS the state, which removes
 * the mandatory `close`-event listener the controlled shape needs — `Escape` closes
 * through the platform without telling React, and the resulting desync is the single
 * most common `<dialog>`-in-React bug. Nothing needs the state anyway: `showModal()`
 * puts the sheet in the top layer covering the trigger and marks it `inert`, so a
 * hamburger-to-X swap is both impossible and pointless. The close affordance lives
 * inside the sheet.
 *
 * Full-bleed rather than side-anchored is what removes the light-dismiss requirement
 * altogether: `closedby="any"` is at 0% on iOS Safari, which is precisely where a
 * mobile-only primitive lives, and a sheet with no visible backdrop has no "outside"
 * to tap.
 *
 * TWO accepted warts, recorded rather than overlooked.
 *
 * 1. `close()` restores focus to the trigger while native hash navigation only
 *    scrolls, so a keyboard user who picks a section lands visually at it with focus
 *    back on the menu button in the bar. Fixing it means imperative focus management
 *    on the target heading, which is more machinery than the wart costs.
 *
 * 2. Crossing `md` while the sheet is open leaves the `open` attribute set on an
 *    element the breakpoint has hidden — reachable on a phone, because rotating a
 *    390px portrait screen to 844px landscape crosses the breakpoint. MEASURED, and
 *    the page does not break: the sheet stops rendering, everything behind it stays
 *    visible and clickable rather than inert, and `Escape` still clears the attribute.
 *    The one visible consequence is that rotating BACK re-reveals the sheet unasked.
 *    Not fixed, because the only fix is a `matchMedia` listener calling `close()` —
 *    the first effect in the tree, in the one component the spec keeps free of state,
 *    to tidy a recoverable cosmetic glitch after a double rotation. Left for the
 *    author to rule on rather than decided here.
 */
export function Sheet({
	locale,
	nav,
}: {
	locale: Locale;
	nav: Messages["nav"];
}) {
	const ref = useRef<HTMLDialogElement>(null);
	const close = () => ref.current?.close();

	return (
		<>
			<button
				type="button"
				onClick={() => ref.current?.showModal()}
				aria-label={nav.openMenu}
				className="text-ink"
			>
				<svg
					aria-hidden="true"
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
				>
					<path d="M2 5h16M2 10h16M2 15h16" />
				</svg>
			</button>

			{/*
			  `open:flex` IS LOAD-BEARING, NOT STYLING. The UA stylesheet's only
			  mechanism for hiding a closed dialog is `dialog:not([open]) { display:
			  none }`. An unconditional `display` overrides it and the dialog no longer
			  stays hidden when closed — and under prerendering there is no `open`
			  attribute and no JavaScript has run, so the failure is not a flash on
			  hydration: it is the nav links sitting in the page on first paint, on
			  every mobile visit. `open:flex` compiles to specificity 0,2,0 and beats a
			  bare `.flex` at 0,1,0, while the closed state falls through to the UA rule.
			  Do not "simplify" this to `flex`.

			  The explicit sizing is not optional either: the UA gives `dialog`
			  `width/height: fit-content` and Preflight does not reset them, so
			  `inset-0` alone does NOT stretch the box. `max-w-none max-h-none` undoes
			  `dialog:modal`'s `calc(100% - 6px - 2em)` caps. `bg-paper text-ink` are
			  required because the UA's `Canvas`/`CanvasText` system colours ignore the
			  palette entirely. `w-full` rather than `w-dvw`, which includes the
			  scrollbar width and would overflow horizontally.

			  Motion is a FADE, not a slide: mid-slide the sheet's left edge becomes a
			  hard boundary against the live page, resurrecting for 200ms exactly the
			  edge a full-bleed sheet exists to avoid. `starting:` is required or the
			  transition never runs, because the element leaves `display: none` with no
			  "before" value. `transition-discrete` is required for `display` and
			  `overlay`, which are discrete. `backdrop:bg-transparent` zeroes the UA's
			  `rgba(0,0,0,0.1)` wash, which would otherwise tint the cross-fade.
			*/}
			<dialog
				ref={ref}
				aria-label={nav.menuLabel}
				className="inset-0 h-dvh max-h-none w-full max-w-none flex-col overscroll-contain bg-paper text-ink opacity-0 backdrop:bg-transparent transition-[opacity,display,overlay] transition-discrete duration-200 open:flex open:opacity-100 starting:open:opacity-0 motion-reduce:duration-0"
			>
				{/* The sheet's own header row. `rule` rather than the retired `rule-strong`
				    — ADR-0006 collapses the two into one line value; see the note in
				    `Bar.tsx`. Matching the bar's height is what stops the menu button and
				    the close button appearing to jump, and the bar is now 54px, so this is
				    `h-[54px]` rather than the old `h-14`. */}
				<div className="flex h-[54px] shrink-0 items-center justify-between border-b border-rule px-4">
					{/* The monogram's full name, spelled out: the sheet has the width the bar
					    does not, and this is the one place the reader sees the name whole. */}
					<span className="font-serif text-[21px] leading-none">
						{AUTHOR_NAME}
					</span>
					<button
						type="button"
						onClick={close}
						aria-label={nav.closeMenu}
						className="text-ink"
					>
						<svg
							aria-hidden="true"
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
						>
							<path d="M4 4l12 12M16 4L4 16" />
						</svg>
					</button>
				</div>

				{/* No `aria-label` here: the sheet spec assigns `nav.menuLabel` to the
				    `<dialog>` and to nothing else, and the dialog already carries it —
				    labelling this nav too makes a screen reader announce the same name
				    twice on entering one overlay. */}
				<nav className="flex flex-col gap-6 px-4 py-8">
					{SHEET_ANCHORS.map((key) => (
						// Every anchor closes the sheet. Without this the visitor jumps to
						// the section and stares at the sheet still covering it.
						<a
							key={key}
							href={`#${key}`}
							onClick={close}
							className="font-mono text-mark text-muted uppercase no-underline hover:text-accent"
						>
							{nav.sections[key]}
						</a>
					))}
				</nav>

				<div className="px-4">
					<LocaleSwitch locale={locale} onNavigate={close} />
				</div>
			</dialog>
		</>
	);
}
