import { AUTHOR_FAMILY, AUTHOR_GIVEN } from "~/config";
import type { Messages } from "~/content/pt";

/**
 * The hero. It carries NO SECTION MARK and NO ID: it is the top of the page, so it has
 * no ordinal position to announce and is not a destination distinct from the page
 * itself. That is also why it does not go through `Section` — its shape is unique (one
 * rule, below the name rather than above it) and forcing it through a wrapper built for
 * the other six would mean escape-hatch props.
 *
 * THE EYEBROW IS GONE. The design opened with a three-part mono row above the name —
 * `Portfolio — 2026` · `● Open to conversation` · `Rio de Janeiro, BR` — with a full-ink
 * rule under it. Cut on the author's call after seeing it rendered. Three consequences
 * worth knowing before anyone restores it:
 *
 * 1. The name now opens the page, with the section's own 88px above it. The `mt-12` the
 *    `<h1>` used to carry was spacing FROM the eyebrow, so it went with it rather than
 *    being left as an orphan 48px.
 * 2. `chrome.kind` and `chrome.availability` existed only for that row and are deleted
 *    from both message modules. `place` and `builtWith` survive in the footer.
 * 3. THE PAGE ONCE AGAIN MAKES NO AVAILABILITY CLAIM ANYWHERE, which restores the
 *    position `docs/site-copy.md` argued for and its claim that no string on the page
 *    asserts availability. ADR-0006 had moved that claim here rather than reversing it;
 *    this removes it outright.
 *
 * THE NAME IS SPLIT ACROSS TWO LINES with the surname in accent italic and indented
 * 0.6em — a typographic decision, not a copy one, which is why it reads from
 * `AUTHOR_GIVEN`/`AUTHOR_FAMILY` in config rather than from the message modules. The
 * name never varies by locale.
 *
 * `text-wrap: pretty` on the lede rather than `balance`: this is a three-line paragraph
 * where the goal is avoiding a one-word last line, not centring the ragged edge.
 */
export function Hero({ copy }: { copy: Messages["hero"] }) {
	return (
		<section className="pt-[88px]">
			<h1 className="font-serif text-[clamp(72px,12.5vw,176px)] leading-[0.94] tracking-[-0.02em]">
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
