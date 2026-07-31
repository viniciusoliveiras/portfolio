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
/**
 * THE LAYOUT IS A DISCRIMINANT, NOT A FLAG BESIDE TWO OPTIONAL PROPS.
 *
 * `split` puts the mark in the left column of the mark grid beside the content, which is
 * what Summary, Skills and Education do. `stacked` gives the mark its own full-width row
 * above the content, which is what Experience, Work and Contact do because their content
 * spans the whole page width.
 *
 * Passed rather than inferred: the choice is per-section and visible in the design, and
 * a component guessing it from its children would be a worse kind of magic than a
 * five-character prop.
 *
 * The two other props are each meaningful under exactly ONE of those, and as a flat prop
 * bag that was true only in prose — `<Section layout="split" note={…}>` compiled and
 * silently dropped the note. A union makes the misuse unrepresentable and deletes the
 * paragraph that used to have to say so.
 */
type SectionProps = {
	id: string;
	/** The two-digit index, `01`–`06`. Locale-neutral, so it is passed, not authored. */
	mark: string;
	label: string;
	children: ReactNode;
} & (
	| {
			layout: "split";
			/** Skills alone holds its mark as the reader scrolls its long row list. */
			sticky?: boolean;
	  }
	| {
			layout: "stacked";
			/**
			 * Content set beside the mark on the header row. Only Experience uses it, for
			 * the company-group note. There is no `split` counterpart: the mark's column
			 * has no room for a second thing.
			 */
			note?: ReactNode;
	  }
);

export function Section(props: SectionProps) {
	const { id, mark, label, children } = props;
	const sticky = props.layout === "split" && props.sticky === true;

	const markEl = (
		<p
			className={[
				"font-mono text-mark text-muted uppercase",
				// The bar, plus 36px of air. Derived from `--spacing-bar` rather than
				// written as the 90px it resolves to: the mark holding BELOW THE BAR is
				// the property, and the number is only today's arithmetic.
				sticky ? "wide:sticky wide:top-[calc(var(--spacing-bar)+36px)]" : "",
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
			{props.layout === "split" ? (
				/* THE MARK IS THE GRID ITEM — do not wrap it in a `<div>`.
				 *
				 * `sticky` resolves its travel against its containing block, which is its
				 * PARENT'S content box. As a direct grid child that parent is this grid
				 * container, whose height is the whole section, so the mark can travel.
				 * Wrapped in a div, the containing block becomes that div — and under
				 * `items-start` the div shrinks to the mark's own ~15px, leaving nothing to
				 * travel within. MEASURED: the wrapped form put Skills' mark at -177px
				 * instead of holding it at 90px, i.e. the sticky silently did nothing. */
				<div className="mark-grid wide:items-start">
					{markEl}
					<div>{children}</div>
				</div>
			) : (
				<>
					<div className="mb-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
						{markEl}
						{props.note}
					</div>
					{children}
				</>
			)}
		</section>
	);
}
