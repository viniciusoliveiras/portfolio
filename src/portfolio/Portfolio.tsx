import type { Locale } from "~/config";
import type { Messages } from "~/content/pt";
import { Bar } from "./Bar";
import { Section } from "./Section";
import { Segments } from "./Segments";
import { Contact } from "./sections/Contact";
import { Education } from "./sections/Education";
import { Experience } from "./sections/Experience";
import { Hero } from "./sections/Hero";
import { Skills } from "./sections/Skills";
import { Summary } from "./sections/Summary";
import { Work } from "./sections/Work";

/**
 * The page, written once and handed a locale's copy in slices.
 *
 * There is no context and no `useMessages()` hook: a section whose copy arrives as a
 * typed prop renders standalone against fixture text, while one that reaches into
 * context drags a provider along and cannot be exercised in isolation. Depth never
 * exceeds two hops — nav copy → bar → sheet.
 *
 * Seven sections in ADR-0001's order, which ADR-0006 does not touch: the redesign
 * changed how the page looks, not what it contains or in what order.
 *
 * NO SCROLL REVEALS ANYWHERE. Every byte of content is present on first paint, because
 * reveals delay exactly the content a skimming recruiter came for.
 *
 * THE SECTION MARK NUMBERS ARE WRITTEN HERE, not in the message modules. They are
 * ordinals over this list, so their only correct source is the list itself — authoring
 * them per locale would let `/pt` ship an `04` where `/en` ships an `05`. They are not
 * computed from the array index either, because these six are written out rather than
 * mapped, and a hand-maintained index is honest about being hand-maintained.
 */
export function Portfolio({ locale, m }: { locale: Locale; m: Messages }) {
	return (
		<>
			{/* The fixed grain, first in the tree and `aria-hidden` because it carries no
			    information. It sits at z-50, ABOVE the bar's z-40, and is only harmless
			    because `pointer-events: none` is part of the `grain` utility — without it
			    this element eats every click on the site while looking perfect. */}
			<div className="grain" aria-hidden="true" />

			<Bar locale={locale} nav={m.nav} />

			{/* `#top` lives on `main`, which is what the bar's monogram links back to. The
			    hero carries no id of its own: it is the top of the page, so it is not a
			    destination distinct from the page itself. */}
			<main id="top" className="page">
				<Hero copy={m.hero} />

				<Section
					id="summary"
					mark="01"
					label={m.nav.sections.summary}
					layout="split"
				>
					<Summary copy={m.summary} />
				</Section>

				<Section
					id="experience"
					mark="02"
					label={m.nav.sections.experience}
					layout="stacked"
					note={
						// Rendered through `Segments`, not flattened with `.join("")`: the note
						// is the one message on the page carrying the segment shape, and
						// joining it to a string would silently drop the anchor the moment
						// `DEVEX_URL` or `INOVASENSOR_URL` stops being an unfilled input.
						<p className="max-w-[460px] font-mono text-meta text-muted wide:text-right">
							<Segments segments={m.experience.groupNote} />
						</p>
					}
				>
					<Experience copy={m.experience} />
				</Section>

				<Section
					id="work"
					mark="03"
					label={m.nav.sections.work}
					layout="stacked"
				>
					<Work copy={m.work} />
				</Section>

				<Section
					id="skills"
					mark="04"
					label={m.nav.sections.skills}
					layout="split"
					sticky
				>
					<Skills copy={m.skills} />
				</Section>

				<Section
					id="education"
					mark="05"
					label={m.nav.sections.education}
					layout="split"
				>
					<Education copy={m.education} />
				</Section>

				<Section
					id="contact"
					mark="06"
					label={m.nav.sections.contact}
					layout="stacked"
				>
					<Contact copy={m.contact} chrome={m.chrome} />
				</Section>
			</main>
		</>
	);
}
