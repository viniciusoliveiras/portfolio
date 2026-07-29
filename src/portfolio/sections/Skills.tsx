import type { Messages } from "~/content/pt";

// The résumé's seven groupings plus Learning. Order fixed here; keyed in the content.
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
 * A DEFINITION LIST — mono label in a 10.5rem column, serif values — collapsing to
 * stacked label-over-values below 40rem. The aligned label column is the idiom the
 * figure labels and date lines already use.
 *
 * On the brief's ambiguity: its typography section lists "the skills groups" among the
 * mono items. That is read here as the LABELS, not the values. The alternative reading
 * turns this section into a dense grey block in the middle of a serif page.
 *
 * Clustering the eight rows into three chunks was built and rejected: the
 * super-grouping is an editorial reading of how the skills relate rather than the
 * résumé's own, and structure is a claim too. Recorded as available if the grouping
 * ever turns out to be how the author actually thinks about it.
 *
 * `Aprendendo` / `Learning` carries Go alone. It appears in NO experience bullet — all
 * four roles are React, TypeScript, Node.js, MSSQL, Docker and n8n — so listing it
 * beside three languages he demonstrably ships would create a false equivalence, and
 * the downside is asymmetric. This makes the site diverge from the résumé's grouping;
 * the résumé is the weaker document here and should follow the site.
 */
export function Skills({ copy }: { copy: Messages["skills"] }) {
	return (
		<dl className="space-y-5">
			{ROWS.map((key) => {
				const row = copy.rows[key];
				return (
					<div key={key} className="sm:flex sm:gap-6">
						<dt className="font-mono text-label text-muted uppercase sm:w-42 sm:shrink-0 sm:pt-2">
							{row.label}
						</dt>
						<dd className="mt-1 text-body sm:mt-0">{row.values.join(", ")}</dd>
					</div>
				);
			})}
		</dl>
	);
}
