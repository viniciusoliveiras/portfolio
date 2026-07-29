import { en } from "~/content/en";
import { pt } from "~/content/pt";

/**
 * ONE BILINGUAL PAGE. Vercel's zero-config path serves exactly one `404.html` and
 * cannot know the visitor's locale, and localising it would mean three-plus legacy
 * `routes` rules to translate a page nobody should reach. On a deliberately bilingual
 * portfolio, both languages on one page reads as intentional.
 *
 * The shell's `<html lang>` can only be one value and falls through to `pt-BR` here,
 * so the ENGLISH HALF CARRIES A PER-ELEMENT `lang` — otherwise a synthesiser reads
 * English prose with Portuguese phonemes.
 *
 * Both back links target the LOCALE ROOT, not the deleted `/home`. They are plain
 * anchors rather than router `Link`s because this component also serves the root's
 * `notFoundComponent`, where the surrounding route context is precisely what failed.
 */
export function NotFound() {
	return (
		<main className="measure w-full py-16 text-body lg:py-24">
			<p className="font-mono text-label text-muted uppercase">
				{pt.notFound.whoops}
			</p>

			<h1 className="mt-3 text-entry">{pt.notFound.title}</h1>
			<p className="mt-3 text-body">{pt.notFound.message}</p>
			<p className="mt-3">
				<a href="/pt" className="accent-link">
					{pt.notFound.back}
				</a>
			</p>

			<div lang="en" className="mt-9 border-t border-rule pt-9">
				<h2 className="text-entry">{en.notFound.title}</h2>
				<p className="mt-3 text-body">{en.notFound.message}</p>
				<p className="mt-3">
					<a href="/en" className="accent-link">
						{en.notFound.back}
					</a>
				</p>
			</div>
		</main>
	);
}
