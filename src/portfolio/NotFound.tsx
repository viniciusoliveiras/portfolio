import { en } from "~/content/en";
import { pt } from "~/content/pt";

/**
 * ONE BILINGUAL PAGE. Vercel's zero-config path serves exactly one `404.html` and
 * cannot know the visitor's locale, and localising it would mean three-plus legacy
 * `routes` rules to translate a page nobody should reach. On a deliberately bilingual
 * portfolio, both languages on one page reads as intentional.
 *
 * The shell's `<html lang>` can only be one value and falls through to `pt-BR` here, so
 * the ENGLISH HALF CARRIES A PER-ELEMENT `lang` — otherwise a synthesiser reads English
 * prose with Portuguese phonemes.
 *
 * Both back links target the LOCALE ROOT, not the deleted `/home`. They are plain
 * anchors rather than router `Link`s because this component also serves the root's
 * `notFoundComponent`, where the surrounding route context is precisely what failed.
 *
 * ADR-0006's design supplies NO 404 TREATMENT — a single-file preview has one page — so
 * this is derived from the page's own grammar rather than designed: `page` container,
 * serif display titles, mono eyebrow, one hairline between the halves. Claude Design has
 * been asked for a treatment; if one arrives, this is where it lands. The grain is
 * absent because this component renders outside `Portfolio`, which is where the overlay
 * lives — worth knowing, because it means the 404 is the one page without it.
 */
export function NotFound() {
	return (
		<main className="page py-16 wide:py-24">
			<p className="font-mono text-mark text-muted uppercase">
				{pt.notFound.whoops}
			</p>

			{/* `font-serif` is explicit on every display line here. Under the superseded
			    direction the serif was the inherited body face and these needed no class;
			    ADR-0006 makes the sans the body face, so a bare `text-entry` would render
			    at display size in Hanken. */}
			<h1 className="mt-3 font-serif text-entry">{pt.notFound.title}</h1>
			<p className="mt-3 text-value">{pt.notFound.message}</p>
			<p className="mt-3">
				<a href="/pt" className="accent-link">
					{pt.notFound.back}
				</a>
			</p>

			<div lang="en" className="mt-9 border-t border-rule pt-9">
				<h2 className="font-serif text-entry">{en.notFound.title}</h2>
				<p className="mt-3 text-value">{en.notFound.message}</p>
				<p className="mt-3">
					<a href="/en" className="accent-link">
						{en.notFound.back}
					</a>
				</p>
			</div>
		</main>
	);
}
