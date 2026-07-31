import type { Messages } from "~/content/pt";

/**
 * The eight rows, in the résumé's order. Keyed rather than mapped over
 * `Object.entries`, so the display order is written down rather than inherited from
 * object insertion order in a content module.
 */
const ROWS = [
	"languages",
	"frontend",
	"backend",
	"databases",
	"infrastructure",
	"automation",
	"practices",
	"learning",
] as const;

/**
 * A two-column list of label/value rows, wrapping into two columns of four at `wide`.
 *
 * `gap-x-12` with NO row gap is deliberate: the rows are separated by their own bottom
 * hairline, and adding row spacing on top would double the gap and detach each rule
 * from the row it belongs to.
 *
 * Values join with `, ` rather than the ` · ` used in Education and the card stack
 * lines. That looks inconsistent and is the design's own distinction: these are lists
 * of things you would say in a sentence, where the other two are enumerations of
 * discrete items.
 */
export function Skills({ copy }: { copy: Messages["skills"] }) {
	return (
		<div className="grid gap-x-12 wide:grid-cols-2">
			{ROWS.map((key) => (
				<div key={key} className="label-row border-b border-rule py-[18px]">
					<span className="pt-[3px] font-mono text-mark text-muted uppercase">
						{copy.rows[key].label}
					</span>
					{/* `learning` is the one row set in accent serif italic. It is the only
					    forward-looking entry in a list of things already shipped, and the
					    design marks that difference typographically rather than with a label
					    like "in progress". */}
					<span
						className={
							key === "learning"
								? "font-serif text-[16px] italic text-accent"
								: "text-value"
						}
					>
						{copy.rows[key].values.join(", ")}
					</span>
				</div>
			))}
		</div>
	);
}
