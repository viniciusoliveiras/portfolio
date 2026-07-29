import type { ReactNode } from "react";

/**
 * A rail column plus a centred measure — the one layout primitive every section
 * shares.
 *
 * At `lg`+ the grid is an 8rem rail, a 2.5rem gutter and the measure. Section rules
 * span the FULL grid, per the brief's "rules dividing the seven sections stay inside
 * the rail-plus-measure grid" — a rule stopping at the measure would leave the rail
 * label floating outside the structure. Below `lg` the rail collapses, the label sits
 * static above the content, and the rules span the measure because the measure is the
 * whole shell.
 *
 * The measure container carries `text-body` because `min(65ch, …)` resolves `ch`
 * against the container's OWN font size — at any other size the measure is not the
 * 65ch the brief specifies.
 */
export function Section({
	id,
	label,
	rule = true,
	children,
}: {
	id?: string;
	label?: string;
	rule?: boolean;
	children: ReactNode;
}) {
	return (
		<section id={id}>
			<div
				className={[
					"mx-auto w-full max-w-[min(65ch,100%-2rem)] py-16 text-body",
					"lg:grid lg:max-w-[min(calc(65ch_+_10.5rem),100%-2rem)] lg:grid-cols-[8rem_2.5rem_minmax(0,1fr)] lg:py-24",
					rule ? "border-t border-rule" : "",
				].join(" ")}
			>
				{/* The rail is MARGINALIA, NOT NAVIGATION: it names the section the
				    reader is currently inside, it lists no destinations, and it is never
				    clickable. Six sections carry a label; the bar carries four anchors.
				    That asymmetry is correct, not an inconsistency. */}
				<div className="lg:col-start-1">
					{label ? (
						// `sticky` scoped to this column, whose height is the section's, so
						// the label travels with its section and is released at its end.
						// `top` is the 56px bar plus 1.75rem. No scroll-spy and no
						// IntersectionObserver: per-section marginalia needs neither.
						<p className="mb-3 font-mono text-label text-muted uppercase lg:sticky lg:top-21 lg:mb-0">
							{label}
						</p>
					) : null}
				</div>
				<div className="lg:col-start-3">{children}</div>
			</div>
		</section>
	);
}
