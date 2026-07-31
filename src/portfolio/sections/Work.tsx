import type { ReactNode } from "react";

import { facts, terms } from "~/content/facts";
import type { Messages } from "~/content/pt";

// The pairing is by KEY, never by position: a `figures[1]` would be
// `string | undefined` under `noUncheckedIndexedAccess`, and index-pairing tolerates a
// locale supplying fewer labels than there are figures. A missing `users` label in
// English is TS2741 instead.
const ERP_FIGURES = [
	{ key: "modules", value: facts.erpModules },
	{ key: "clients", value: facts.erpClients },
	{ key: "users", value: facts.erpUsers },
] as const;

/**
 * The three architecture chips, keyed to `terms.bpoArchitecture` so a role label cannot
 * drift from the technology it labels.
 *
 * The third is `false` for `chosen`: the design draws TanStack Start and TanStack Query
 * in accent and Node.js in muted, because the first two are the DECISION being reported
 * and Node.js is the surrounding context. Rendering all three the same would flatten
 * the one thing this card exists to say.
 */
const BPO_CHIPS = [
	{ key: "framework", value: terms.bpoArchitecture.framework, chosen: true },
	{
		key: "serverState",
		value: terms.bpoArchitecture.serverState,
		chosen: true,
	},
	{ key: "backend", value: terms.bpoArchitecture.backend, chosen: false },
] as const;

/**
 * One card: a fixed left panel — accent eyebrow, serif title, muted prose, a `·`-joined
 * stack line pinned to the foot — and whatever the entry puts beside it.
 *
 * THE SHARED EDGE IS THE CARD'S OWN BUSINESS, not something the second card remembers to
 * ask for. `not-first:border-t-0` is what makes the stack read as one block: every card
 * after the first drops its top border so the pair draw one line between them rather than
 * two. Written here rather than passed as a prop because it is a property of the LIST,
 * and a third entry should join the block without anyone editing the second.
 *
 * The 6px radius stays on all of them, which leaves the shared edges square while the
 * outer corners round — that is what the design does.
 */
function WorkCard({
	eyebrow,
	title,
	prose,
	stack,
	children,
}: {
	eyebrow: string;
	title: string;
	prose: string;
	/** The `·`-joined technologies. A string, because the two entries compose it
	 *  differently: the ERP joins an authored list, the BPO joins the same map its chips
	 *  read, so that the caption and the chips cannot disagree. */
	stack: string;
	/** The right-hand panel. The two entries are ASYMMETRIC ON PURPOSE, and this slot is
	 *  the whole of the difference between them. */
	children: ReactNode;
}) {
	return (
		<article className="overflow-hidden rounded-md border border-ink bg-surface not-first:border-t-0">
			<div className="grid wide:grid-cols-[1.1fr_1fr]">
				{/* The panel divider runs BELOW the prose when stacked and BESIDE it when
				    wide — one hairline either way, never both and never neither. */}
				<div className="flex flex-col gap-6 border-b border-rule p-[clamp(22px,4vw,48px)] wide:border-r wide:border-b-0">
					<div className="font-mono text-mark text-accent uppercase">
						{eyebrow}
					</div>
					<h3 className="font-serif text-entry">{title}</h3>
					<p className="text-value text-muted text-pretty">{prose}</p>
					{/* `mt-auto` pins the stack line to the bottom of the panel regardless of
					    how the prose wraps, so it aligns with the metric panel's last row. */}
					<div className="mt-auto font-mono text-caption text-muted">
						{stack}
					</div>
				</div>

				{children}
			</div>
		</article>
	);
}

/**
 * Two entries, and they are ASYMMETRIC ON PURPOSE: the ERP argues by scale, the BPO by
 * judgement. That is a stronger pair than two of either, and inventing a figure for the
 * BPO platform would be the only claim on the page not tracing to the résumé. That
 * asymmetry is the whole reason `WorkCard` takes its right-hand panel as `children`
 * rather than a shape: there is no shape the two share.
 *
 * ADR-0006 makes these CARDS, on `surface`, bordered in full `ink` with a 6px radius —
 * reversing the superseded direction, which rejected card grids outright as a
 * SaaS-landing device. The two stack into one block; how that block draws one line
 * between them rather than two is `WorkCard`'s business, above.
 *
 * DISPLAY FIGURES MOVED. They used to sit large above the prose; here they occupy a
 * dedicated right-hand panel of three equal rows, one figure per row, each paired with
 * its label on the same baseline. They are still read before the prose — the panel is
 * to the right of it, and 72px type wins attention over 16px — so the skimmability
 * argument survives the relocation, but "above its prose" is no longer true of them and
 * `CONTEXT.md` says so.
 */
export function Work({ copy }: { copy: Messages["work"] }) {
	return (
		<div>
			<WorkCard
				eyebrow={copy.erp.eyebrow}
				title={copy.erp.title}
				prose={copy.erp.prose}
				stack={copy.erp.stack.join(" · ")}
			>
				<div className="grid grid-rows-3">
					{ERP_FIGURES.map(({ key, value }, i) => (
						<div
							key={key}
							className={[
								"flex items-baseline justify-between px-[clamp(20px,4vw,48px)] py-[clamp(18px,3vw,28px)]",
								// No divider under the last row: the card's own border is
								// already there, and a rule beside it reads as a 2px edge.
								i < ERP_FIGURES.length - 1 ? "border-b border-rule" : "",
							].join(" ")}
						>
							{/* `tabular-nums` documents intent and costs nothing here. It is NOT
							    load-bearing: the three figures sit in separate rows and are
							    left-aligned, so there are no columns of digits to align. */}
							<span className="font-serif text-figure tabular-nums text-accent">
								{value}
							</span>
							<span className="font-mono text-mark text-muted uppercase">
								{copy.erp.figureLabels[key]}
							</span>
						</div>
					))}
				</div>
			</WorkCard>

			{/* The stack line is composed from the SAME map the chips read, so the caption
			    and the chips cannot disagree and Node.js cannot appear in one but not the
			    other. Both are present, which overturns the superseded rule that suppressed
			    one of them — they sit in different columns here and read as a lockup with a
			    caption rather than as the same list twice. */}
			<WorkCard
				eyebrow={copy.bpo.lockup.label}
				title={copy.bpo.title}
				prose={copy.bpo.prose}
				stack={Object.values(terms.bpoArchitecture).join(" · ")}
			>
				<div className="flex flex-col justify-center gap-3.5 p-[clamp(22px,4vw,48px)]">
					{BPO_CHIPS.map(({ key, value, chosen }) => (
						<div
							key={key}
							className={[
								"flex justify-between rounded-full border px-6 py-3.5 font-mono text-chip",
								chosen ? "border-accent text-accent" : "border-rule text-muted",
							].join(" ")}
						>
							<span>{value}</span>
							<span>{copy.bpo.lockup.roles[key]}</span>
						</div>
					))}
					{/* `text-mark` outright, where this used to override the token's tracking
					    down to 0.08em. That value is outside the four the design uses, so it
					    was the implementation artifact the mono collapse exists to remove —
					    and half-overriding a token is the shape that hides the next one. */}
					<div className="mt-2 font-mono text-mark text-muted uppercase">
						<span aria-hidden="true">↳</span> {copy.bpo.sameStack}
					</div>
				</div>
			</WorkCard>
		</div>
	);
}
