import { AUTHOR_NAME } from "~/config";
import { facts } from "~/content/facts";
import type { Messages } from "~/content/pt";
import { Emphasise } from "../Emphasise";

/**
 * The four links, in the design's order. A table rather than a map over `copy.links`,
 * because the order is a design decision and object insertion order in a content module
 * is not the place to record one — and because ONE of the four is different.
 *
 * ONE FLAG, NOT TWO. The email is the CALL TO ACTION, and both of the things that set it
 * apart follow from that single fact: it takes the filled pill, and it prints its VALUE
 * (`vinitag190@gmail.com`) where the other three print their LABEL (`LinkedIn`, not
 * `github.com/viniciusoliveiras`) — the address is what the reader is being asked to use,
 * where the others would only add URL noise.
 *
 * An earlier form carried `solid` and `showValue` as two booleans, positional and
 * unnamed at the call site, holding the same value in every row with nothing in the type
 * or the comment saying they had to move together.
 */
const LINKS = [
	{ key: "email", primary: true },
	{ key: "linkedin", primary: false },
	{ key: "github", primary: false },
	{ key: "resume", primary: false },
] as const;

/**
 * The closing section, and the page's footer, which lives INSIDE it.
 *
 * The footer is not a separate landmark on purpose: it is three mono lines under a
 * hairline, carrying no navigation and no content the page has not already stated. A
 * `<footer>` element would announce a landmark to a screen reader and then deliver a
 * copyright line, which is worse than leaving it as the tail of the contact section.
 *
 * The bottom padding lives here rather than in `Section`, because it is the last section
 * on the page and no other section needs it — putting it in the wrapper would mean a
 * prop used once.
 *
 * NOTE ON THE AVAILABILITY CLAIM: this statement deliberately makes none — and since the
 * hero eyebrow was cut, nothing else on the page does either. ADR-0006 had relocated the
 * claim to that eyebrow rather than reversing the decision that dropped it from here;
 * with the eyebrow gone the page is back to saying nothing, which is what
 * `docs/site-copy.md` argued for on the grounds that a portfolio owes a reader no
 * statement of availability.
 */
export function Contact({
	copy,
	chrome,
}: {
	copy: Messages["contact"];
	chrome: Messages["chrome"];
}) {
	return (
		<div className="pb-[clamp(72px,10vw,96px)]">
			<p className="max-w-[780px] font-serif text-[clamp(26px,3vw,38px)] leading-[1.35] text-pretty">
				<Emphasise text={copy.statement} emphasis={copy.emphasis} />
			</p>

			<div className="mt-10 flex flex-wrap gap-3">
				{LINKS.map(({ key, primary }) => (
					<a
						key={key}
						href={copy.links[key].href}
						className={[
							primary ? "pill-solid" : "pill",
							"px-[22px] py-3 font-mono text-pill no-underline",
						].join(" ")}
					>
						{primary ? copy.links[key].value : copy.links[key].label}{" "}
						{/* Decorative: the link's destination is already in its href and its
						    text, and a screen reader announcing "north east arrow" four times
						    adds nothing. */}
						<span aria-hidden="true">↗</span>
					</a>
				))}
			</div>

			<div className="mt-[88px] flex flex-wrap justify-between gap-x-5 gap-y-2 border-t border-rule pt-5 font-mono text-micro text-muted uppercase">
				{/* `facts.year` again, so the hero eyebrow and this line cannot disagree about
				    what year it is. */}
				<span>
					© {facts.year} {AUTHOR_NAME}
				</span>
				<span>{chrome.builtWith}</span>
				{/* The same `place` string the hero eyebrow prints, deliberately shared rather
				    than written twice — two strings that agree today are a defect nobody
				    notices for a year. */}
				<span>{chrome.place}</span>
			</div>
		</div>
	);
}
