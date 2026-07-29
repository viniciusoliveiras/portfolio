import type { Messages } from "~/content/pt";

/**
 * LIGHTER THAN EXPERIENCE: three items, no rules between them, 1.75rem apart. It is
 * the lowest-value section on the page and its treatment should say so.
 *
 * `(concluído)` / `(completed)` is explicit on purpose — the current site says
 * "Janeiro 2020 até a data atual", which is false. The résumé's 2020–2022 has no open
 * end, and the degree is finished.
 */
export function Education({ copy }: { copy: Messages["education"] }) {
	return (
		<div className="space-y-7">
			<div>
				<p className="font-mono text-label text-muted uppercase">
					{copy.degree.period}
				</p>
				<h3 className="mt-3 text-body font-semibold">{copy.degree.title}</h3>
				<p className="mt-1 text-body-sm text-muted optical-16">
					{copy.degree.institution}
				</p>
			</div>

			<div>
				<p className="font-mono text-label text-muted uppercase">
					{copy.certifications.label}
				</p>
				<p className="mt-3 text-body">
					{copy.certifications.values.join(" · ")}
				</p>
			</div>

			<div>
				<p className="font-mono text-label text-muted uppercase">
					{copy.languages.label}
				</p>
				<p className="mt-3 text-body">{copy.languages.values.join(" · ")}</p>
			</div>
		</div>
	);
}
