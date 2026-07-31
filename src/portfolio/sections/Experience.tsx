import { facts } from "~/content/facts";
import type { Messages } from "~/content/pt";

/**
 * Keyed, never positional — the same discipline as `facts`. An array here would let one
 * locale silently ship three roles against the other's four, and pairing a role with
 * its decade marker by index would let a marker drift onto the wrong role.
 *
 * `current` is what earns the lead role its accent marker and its `— now` suffix. It is
 * a flag rather than "the first element", because the first element is only the current
 * role by coincidence of ordering.
 */
const ROLES = [
	{ key: "lead", decade: facts.roleDecades.lead, current: true },
	{ key: "analyst", decade: facts.roleDecades.analyst, current: false },
	{ key: "intern", decade: facts.roleDecades.intern, current: false },
] as const;

/**
 * Four roles, three with bullets and one without.
 *
 * THE DECADE MARKER REPLACES THE DISPLAY FIGURE in this position. The superseded
 * direction set each entry's metrics large above its prose; ADR-0006's design sets the
 * year large in a left column and moves the metrics into the Work section's card panel.
 * The consequence worth naming: this section no longer carries any numbers a skimmer
 * reads first, and the skimmable-evidence argument now rests entirely on Work.
 *
 * Row dividers are the hairline `rule`, where the section boundary above is full
 * `ink`. Two levels of horizontal rule at two different strengths stay legible as a
 * hierarchy; the same strength at both levels would not.
 */
export function Experience({ copy }: { copy: Messages["experience"] }) {
	return (
		<div className="flex flex-col">
			{ROLES.map(({ key, decade, current }) => (
				<div key={key} className="mark-grid border-t border-rule py-9">
					<div>
						<div
							className={[
								"font-serif text-decade",
								current ? "text-accent" : "",
							].join(" ")}
						>
							{decade}
							{/* The suffix is set at a fixed 20px against a clamping 36–44px
							    marker, so it deliberately does NOT scale with it — it is an
							    annotation on the year, not part of it. */}
							{current ? (
								<span className="text-[20px] text-muted"> — {copy.now}</span>
							) : null}
						</div>
						{/* Uppercased HERE rather than in the copy, so a screen reader is handed
						    sentence case instead of shouted text. */}
						<div className="mt-2.5 font-mono text-meta text-muted uppercase">
							{copy.roles[key].period}
						</div>
					</div>

					<div>
						<h3 className="mb-[18px] font-serif text-role">
							{copy.roles[key].title}
						</h3>
						<ul className="flex max-w-[720px] list-disc flex-col gap-1.5 pl-[18px] text-prose text-muted">
							{copy.roles[key].bullets.map((bullet) => (
								<li key={bullet}>{bullet}</li>
							))}
						</ul>
					</div>
				</div>
			))}

			{/* One line, no bullets, by decision — present so the site and the résumé do not
			    disagree about employment history, and given no prose because it contributes
			    nothing to problem, scale, stack or contribution. Its title takes `muted`
			    rather than `ink`, which is how the design says "this one counts less"
			    without omitting it. */}
			<div className="mark-grid border-t border-rule py-9">
				<div>
					<div className="font-serif text-decade">
						{facts.roleDecades.minor}
					</div>
					<div className="mt-2.5 font-mono text-meta text-muted uppercase">
						{copy.minorRole.period}
					</div>
				</div>
				<div>
					<h3 className="font-serif text-[24px] leading-[1.2] text-muted">
						{copy.minorRole.title}
					</h3>
				</div>
			</div>
		</div>
	);
}
