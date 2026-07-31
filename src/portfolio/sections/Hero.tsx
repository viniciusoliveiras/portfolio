import { AUTHOR_FAMILY, AUTHOR_GIVEN } from "~/config";
import { facts } from "~/content/facts";
import type { Messages } from "~/content/pt";

/**
 * The hero. It carries NO SECTION MARK and NO ID: it is the top of the page, so it has
 * no ordinal position to announce and is not a destination distinct from the page
 * itself. That is also why it does not go through `Section` — its shape is unique
 * (eyebrow rule below, meta rule above, no rule at the top) and forcing it through a
 * wrapper built for the other six would mean three escape-hatch props.
 *
 * THE NAME IS SPLIT ACROSS TWO LINES with the surname in accent italic and indented
 * 0.6em — a typographic decision, not a copy one, which is why it reads from
 * `AUTHOR_GIVEN`/`AUTHOR_FAMILY` in config rather than from the message modules. The
 * name never varies by locale.
 *
 * `text-wrap: pretty` on the lede rather than `balance`: this is a three-line paragraph
 * where the goal is avoiding a one-word last line, not centring the ragged edge.
 */
export function Hero({
	copy,
	chrome,
}: {
	copy: Messages["hero"];
	chrome: Messages["chrome"];
}) {
	return (
		<section className="pt-[88px]">
			{/* The eyebrow. `border-b border-ink` at full strength — this is a section
			    boundary in the design's grammar, not an internal divider. */}
			<div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1.5 border-b border-ink pb-[14px] font-mono text-mark text-muted uppercase">
				{/* Composed from `facts.year` so the year exists once in the codebase. */}
				<span>
					{chrome.kind} — {facts.year}
				</span>
				<span className="text-accent">
					{/* Decorative status dot, hidden from assistive technology: a screen
					    reader announcing "black circle" before the claim adds nothing, and
					    the claim itself is the content. */}
					<span aria-hidden="true">●</span> {chrome.availability}
				</span>
				<span>{chrome.place}</span>
			</div>

			<h1 className="mt-12 font-serif text-[clamp(72px,12.5vw,176px)] leading-[0.94] tracking-[-0.02em]">
				{AUTHOR_GIVEN}
				<br />
				<em className="ml-[0.6em] text-accent">{AUTHOR_FAMILY}</em>
			</h1>

			{/* Three labelled facts and the lede, on one rule. The fourth column is 1.4fr
			    rather than 1fr: the lede is a paragraph beside three short values, and equal
			    columns would set it too narrow to read at a comfortable measure. */}
			<div className="mt-[clamp(40px,6vw,64px)] grid gap-[clamp(20px,2.6vw,32px)] border-t border-ink pt-[22px] wide:grid-cols-[1fr_1fr_1fr_1.4fr]">
				{(["role", "currently", "since"] as const).map((key) => (
					<div key={key}>
						<div className="font-mono text-micro text-muted uppercase">
							{copy.meta[key].label}
						</div>
						{/* Each value is an ARRAY OF LINES joined with real line breaks, rather
						    than a string containing markup — see the note in the pt module. The
						    index key is safe and necessary here: these arrays are static, never
						    reorder, and the lines are not guaranteed unique. */}
						<div className="mt-2 text-body">
							{copy.meta[key].value.map((line, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: static, never reordered, lines are not unique
								<span key={i} className="block">
									{line}
								</span>
							))}
						</div>
					</div>
				))}

				<div>
					<p className="text-lede text-pretty">{copy.lede}</p>
					<div className="mt-6 flex flex-wrap gap-3">
						<a
							href={copy.actions.contact.href}
							className="pill-solid px-6 py-3 text-action no-underline"
						>
							{copy.actions.contact.label}
						</a>
						{/* Outline pill, but bordered in INK rather than the hairline `rule`,
						    which is what pairs it visually with the filled action beside it.
						    The design draws this one border darker than every other pill on the
						    page for that reason. */}
						<a
							href={copy.actions.resume.href}
							className="pill border-ink px-6 py-3 text-action no-underline"
						>
							{copy.actions.resume.label}
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
