import { facts } from "~/content/facts";
import type { Messages } from "~/content/pt";

// The pairing is by KEY, never by position: a `figures[1]` would be
// `string | undefined` under `noUncheckedIndexedAccess`, and index-pairing tolerates a
// locale supplying fewer labels than there are figures. A missing `users` label in
// English is TS2741 instead.
const ERP_FIGURES = [
	["modules", facts.erpModules],
	["clients", facts.erpClients],
	["users", facts.erpUsers],
] as const;

/**
 * Two entries, and they are ASYMMETRIC ON PURPOSE: the ERP argues by scale, the BPO
 * by judgement. That is a stronger pair than two of either, and inventing a figure for
 * the BPO platform would be the only claim on the page not tracing to the résumé.
 *
 * Entries separate with a rule spanning THE MEASURE ONLY, where the section rules span
 * the full rail-plus-measure grid. Two levels of horizontal rule at two different
 * spans stay legible as a hierarchy; the same span at both levels would not.
 */
export function Work({ copy }: { copy: Messages["work"] }) {
	return (
		<div className="space-y-9">
			<article>
				<h3 className="text-entry">{copy.erp.title}</h3>

				{/* Display figures: set large ABOVE the prose, so a skimmer reads them
				    first. With no public code the metrics ARE the argument, so
				    skimmability beats editorial purity — and a number never appears
				    inside a sentence here. */}
				{/* `items-start`, NOT the `items-end` the section layouts and the token
				    layer both hand over. Their stated purpose is "so figures share a
				    baseline across differing digit counts", and rendered, `items-end`
				    does the opposite of that: with the figure ABOVE a label that wraps,
				    aligning the bottoms of blocks of unequal height pushes the
				    one-line-label figure DOWN. Measured at 1280px, `15` sat 17px below
				    `8` and `400+`, because `MÓDULOS` is one line while
				    `CLIENTES CORPORATIVOS` and `USUÁRIOS ATIVOS` are two. `items-start`
				    delivers the property the documents ask for. Recorded as a defect in
				    both rather than followed to the letter against its own reason. */}
				<div className="mt-8 flex flex-wrap items-start gap-x-8 gap-y-6">
					{ERP_FIGURES.map(([key, value]) => (
						<div key={key}>
							{/* `tabular-nums` documents intent and costs nothing, but is not
							    load-bearing: Source Serif 4's default figures are already
							    tabular lining — verified in the binary, digits uniformly 500
							    units, and still 500 after subsetting. */}
							<p className="text-figure tabular-nums">{value}</p>
							{/* Capped at 9ch so a long label wraps UNDER ITS OWN NUMBER
							    instead of pushing the row wide enough to break the
							    three-figure row onto two lines.

							    `min-w-min` is the other half of that cap and is load-bearing.
							    9ch of 12px mono is ~65px, but `CORPORATIVOS` is a single
							    unbreakable 12-character word ~98px wide — so the cap alone
							    sized the box below its own text and the word painted OVER the
							    next lockup, rendering as "CORPORATIVOSATIVOS". A
							    `min-width: min-content` floor keeps the box at least as wide
							    as its longest word while the cap still stops the label going
							    to full max-content on one line. The section layouts measured
							    the cap against the shorter label the i18n sketch used
							    (`clientes`); the authored copy is `clientes corporativos`. */}
							<p className="mt-2 min-w-min max-w-[9ch] font-mono text-label text-muted uppercase">
								{copy.erp.figureLabels[key]}
							</p>
						</div>
					))}
				</div>

				<p className="mt-8 text-body">{copy.erp.prose}</p>
				<p className="mt-3 font-mono text-label text-muted uppercase">
					{copy.erp.stack.join(" · ")}
				</p>
			</article>

			<article className="border-t border-rule pt-9">
				<h3 className="text-entry">{copy.bpo.title}</h3>

				{/* The figure slot takes the CHOSEN ARCHITECTURE, in mono, in the exact
				    position the other entry sets its figures. Leaving it empty was built
				    and rejected: the skim layer then carried scale but not judgement, and
				    the TanStack Start decision is the only evidence on the page about how
				    its author thinks. Mono is the brief's data face and a chosen stack is
				    data, so this needs no exception.

				    THE TRAILING STACK LINE IS SUPPRESSED while this lockup is present, or
				    the page says "TanStack Start · TanStack Query" twice, eight lines
				    apart. That is what makes the two entries structurally different
				    rather than one a superset of the other. */}
				<div className="mt-8">
					{copy.bpo.lockup.values.map((value) => (
						<p key={value} className="font-mono text-body text-ink">
							{value}
						</p>
					))}
					<p className="mt-2 font-mono text-label text-muted uppercase">
						{copy.bpo.lockup.label}
					</p>
				</div>

				<p className="mt-8 text-body">{copy.bpo.prose}</p>
			</article>
		</div>
	);
}
