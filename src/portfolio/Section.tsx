import type { ReactNode } from "react";

/**
 * The section wrapper every one of the six id-carrying sections shares: the top rule,
 * the rhythm above it, and the section mark.
 *
 * THE MARK IS NOT THE SUPERSEDED RAIL. The rail was per-section marginalia — sticky,
 * scoped to its section's height, released at its end, never numbered, 8rem wide, and
 * explicitly not a list of destinations. This is a numbered index entry (`01 /
 * Summary`) in a 260px column, static by default. It occupies the rail's position on
 * the page and shares nothing else about its behaviour, which is why ADR-0006 renames
 * it rather than redefining "rail".
 *
 * THE TOP RULE IS `border-ink`, NOT `border-rule`. The design draws the six section
 * boundaries at full ink strength and reserves the hairline `rule` for dividers INSIDE
 * a section — the experience rows, the skills rows, the card panels. Getting these two
 * the wrong way round is the most visible single way to make this page look like a
 * different design: full-ink section rules are most of what gives it the editorial
 * register.
 */
export function Section({
	id,
	mark,
	label,
	layout,
	note,
	sticky = false,
	children,
}: {
	id: string;
	/** The two-digit index, `01`–`06`. Locale-neutral, so it is passed, not authored. */
	mark: string;
	label: string;
	/**
	 * `split` puts the mark in the left column of a 260px/1fr grid beside the content,
	 * which is what Summary, Skills and Education do. `stacked` gives the mark its own
	 * full-width row above the content, which is what Experience, Work and Contact do
	 * because their content spans the whole page width.
	 *
	 * Passed rather than inferred: the choice is per-section and visible in the design,
	 * and a component guessing it from its children would be a worse kind of magic
	 * than a five-character prop.
	 */
	layout: "split" | "stacked";
	/**
	 * Content set beside the mark on a `stacked` section's header row. Only Experience
	 * uses it, for the company-group note. Ignored under `split`, where the mark's
	 * column has no room for a second thing.
	 */
	note?: ReactNode;
	/** Skills alone holds its mark as the reader scrolls its long row list. */
	sticky?: boolean;
	children: ReactNode;
}) {
	const markEl = (
		<p
			className={[
				"font-mono text-mark text-muted uppercase",
				sticky ? "wide:sticky wide:top-[90px]" : "",
			].join(" ")}
		>
			{/* The number is decorative NUMBERING rather than content, but it is
			    deliberately not `aria-hidden`: a screen reader announcing "01 slash
			    Summary" conveys the same ordinal position a sighted reader gets, and
			    hiding it would drop the only cue that these six are a sequence. */}
			<span className="text-accent">{mark}</span> / {label}
		</p>
	);

	return (
		<section
			id={id}
			className="mt-[clamp(64px,9vw,96px)] border-t border-ink pt-[22px]"
		>
			{layout === "split" ? (
				/* THE MARK IS THE GRID ITEM — do not wrap it in a `<div>`.
				 *
				 * `sticky` resolves its travel against its containing block, which is its
				 * PARENT'S content box. As a direct grid child that parent is this grid
				 * container, whose height is the whole section, so the mark can travel.
				 * Wrapped in a div, the containing block becomes that div — and under
				 * `items-start` the div shrinks to the mark's own ~15px, leaving nothing to
				 * travel within. MEASURED: the wrapped form put Skills' mark at -177px
				 * instead of holding it at 90px, i.e. the sticky silently did nothing. */
				<div className="grid gap-[clamp(20px,3.5vw,40px)] wide:grid-cols-[260px_1fr] wide:items-start">
					{markEl}
					<div>{children}</div>
				</div>
			) : (
				<>
					<div className="mb-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
						{markEl}
						{note}
					</div>
					{children}
				</>
			)}
		</section>
	);
}
