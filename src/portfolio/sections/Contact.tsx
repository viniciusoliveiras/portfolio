import type { Messages } from "~/content/pt";

const LINKS = ["email", "linkedin", "github", "resume"] as const;

/**
 * A closing statement PLUS the labelled link list, not a bare list: this section is
 * the page's last word, and four naked links would end the document mid-sentence.
 *
 * No form — a form needs a backend, which the fully static outcome precludes, and
 * links are what this audience uses anyway. No Instagram, cut as off-message. The
 * résumé's phone number is not published in the HTML; it stays on the PDF.
 */
export function Contact({ copy }: { copy: Messages["contact"] }) {
	return (
		<div>
			<p className="text-lede">{copy.statement}</p>

			<dl className="mt-8 space-y-4">
				{LINKS.map((key) => {
					const link = copy.links[key];
					return (
						<div key={key} className="sm:flex sm:gap-6">
							<dt className="font-mono text-label text-muted uppercase sm:w-26 sm:shrink-0 sm:pt-2">
								{link.label}
							</dt>
							<dd className="mt-1 sm:mt-0">
								<a
									href={link.href}
									className="text-body text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
								>
									{link.value}
								</a>
							</dd>
						</div>
					);
				})}
			</dl>
		</div>
	);
}
