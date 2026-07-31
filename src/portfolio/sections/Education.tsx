import type { Messages } from "~/content/pt";

/**
 * One degree and two label/value rows.
 *
 * The period takes ACCENT here, where every other date on the page is `muted`. That is
 * the design's doing and it is defensible: this is the only date on the page attached
 * to a completed credential rather than to a span of employment, and `· Completed` is
 * the claim the section exists to make.
 *
 * The two rows reuse the 130px label column from Skills, so the label edges line up
 * down the page across two sections that are not in the same grid.
 */
export function Education({ copy }: { copy: Messages["education"] }) {
	return (
		<div className="flex flex-col gap-7">
			<div>
				{/* Uppercased here, not in the copy — same reason as the experience periods:
				    a screen reader should be handed sentence case. */}
				<div className="font-mono text-meta text-accent uppercase">
					{copy.degree.period}
				</div>
				<h3 className="mt-2.5 mb-1.5 font-serif text-[28px] leading-[1.2]">
					{copy.degree.title}
				</h3>
				<div className="text-body text-muted">{copy.degree.institution}</div>
			</div>

			<div className="grid grid-cols-[130px_1fr] gap-5 border-t border-rule pt-5">
				<span className="font-mono text-mark text-muted uppercase">
					{copy.certifications.label}
				</span>
				<span className="text-body text-muted">
					{copy.certifications.values.join(" · ")}
				</span>
			</div>

			<div className="grid grid-cols-[130px_1fr] gap-5">
				<span className="font-mono text-mark text-muted uppercase">
					{copy.languages.label}
				</span>
				<span className="text-body text-muted">
					{copy.languages.values.join(" · ")}
				</span>
			</div>
		</div>
	);
}
