import type { Locale } from "~/config";
import type { Messages } from "~/content/pt";
import { Bar } from "./Bar";
import { Section } from "./Section";
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
 * Seven sections in ADR-0001's order. NO SCROLL REVEALS ANYWHERE: they are the most
 * clichéd motion on the web and they delay exactly the content a skimming recruiter
 * came for, so every byte is present on first paint.
 */
export function Portfolio({ locale, m }: { locale: Locale; m: Messages }) {
	return (
		<>
			<Bar locale={locale} nav={m.nav} />
			<main>
				{/* The hero takes no rail label — it is the top of the page, so it has no
				    marginalia to name and no anchor to be a destination for — and no rule
				    above it. */}
				<Section rule={false}>
					<Hero copy={m.hero} />
				</Section>
				<Section id="summary" label={m.nav.sections.summary}>
					<Summary copy={m.summary} />
				</Section>
				<Section id="experience" label={m.nav.sections.experience}>
					<Experience copy={m.experience} />
				</Section>
				<Section id="work" label={m.nav.sections.work}>
					<Work copy={m.work} />
				</Section>
				<Section id="skills" label={m.nav.sections.skills}>
					<Skills copy={m.skills} />
				</Section>
				<Section id="education" label={m.nav.sections.education}>
					<Education copy={m.education} />
				</Section>
				<Section id="contact" label={m.nav.sections.contact}>
					<Contact copy={m.contact} />
				</Section>
			</main>
		</>
	);
}
