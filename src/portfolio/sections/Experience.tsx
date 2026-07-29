import type { Messages } from "~/content/pt";
import { Segments } from "../Segments";

// Keyed, not positional — so English cannot silently ship three roles against
// Portuguese's four. Order is fixed here because order is a layout decision.
const ROLES = ["lead", "analyst", "intern"] as const;

/**
 * RULES ONLY — no vertical timeline border. ADR-0001 carried `ResumeItem`'s left
 * border forward as "the one structural idea", but it does not survive contact with
 * the rail: the brief's separator idiom is HORIZONTAL rules instead of cards, a left
 * border would be the only vertical line on the page besides the rail's own column,
 * and below `lg` — where the rail collapses above the content — it would become the
 * sole left-edge element and so mean one thing at wide widths and another at narrow
 * ones. The mono date lines already sequence the roles.
 *
 * Numbers stay INLINE IN THE PROSE here. Experience is a chronological record read as
 * sentences; the display-figure treatment belongs to the showcase. The two sections
 * therefore treat the same facts differently, by design.
 */
export function Experience({ copy }: { copy: Messages["experience"] }) {
	return (
		<div>
			<p className="text-body-sm text-muted optical-16">
				<Segments segments={copy.groupNote} />
			</p>

			<ol className="mt-8">
				{ROLES.map((key) => {
					const role = copy.roles[key];
					return (
						<li
							key={key}
							className="border-t border-rule pt-9 first:border-t-0 first:pt-0"
						>
							<p className="font-mono text-label text-muted uppercase">
								{role.period}
							</p>
							<h3 className="mt-3 text-body font-semibold">{role.title}</h3>
							<ul className="mt-3 space-y-2">
								{role.bullets.map((bullet) => (
									<li
										key={bullet}
										className="text-body before:mr-2 before:text-muted before:content-['·']"
									>
										{bullet}
									</li>
								))}
							</ul>
						</li>
					);
				})}

				{/* A MINOR ROW: date line plus a lighter, muted title, no bullets. The
				    weight drop does the work the copy decision asked for — present for
				    chronological completeness, given no prose, because it contributes
				    nothing to problem, scale, stack or contribution. Cutting it would
				    have left no chronology gap; it is kept for consistency with the
				    résumé rather than out of necessity.

				    `body-sm` rather than the 1rem the section layouts name: the token
				    layer wiped `--text-*` so every size goes through one of the seven
				    named roles, and 1rem is not one of them. `body-sm` is the role that
				    means "captions, secondary lines", which is exactly the weight drop
				    intended. Recorded as a spec conflict resolved in the scale's favour. */}
				<li className="border-t border-rule pt-9">
					<p className="font-mono text-label text-muted uppercase">
						{copy.minorRole.period}
					</p>
					<h3 className="mt-3 text-body-sm text-muted optical-16">
						{copy.minorRole.title}
					</h3>
				</li>
			</ol>
		</div>
	);
}
