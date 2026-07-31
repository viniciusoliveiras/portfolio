/**
 * Wraps one run of a sentence in accent italic — the treatment ADR-0006's design gives
 * a clause in the Summary lede and the closing clause of the Contact statement.
 *
 * WHY THIS IS A MATCH RATHER THAN A MARKUP SEGMENT. The obvious shape is an emphasis
 * kind on `Segment`, and that was rejected on a specific ground: `Segment` deliberately
 * carries no node-valued variant, because a message typed as a node is assignable to
 * any other node, which switches `satisfies Messages` off for exactly the strings most
 * likely to diverge between locales. Adding an emphasis kind reopens that hole for the
 * two longest sentences on the page.
 *
 * So the copy stays two plain strings — the full sentence and the run to emphasise —
 * and both are checked by `satisfies Messages` as strings. The cost is that the run
 * must be a literal substring of the sentence, which is a constraint the compiler
 * cannot express.
 *
 * IT FAILS OPEN, AND THAT IS THE RISK. A run that does not match renders the sentence
 * plain: correct text, missing italic, no error. That degrades invisibly, which is why
 * `tests/prerendered-output.test.ts` asserts the match for both locales rather than
 * trusting it. Do not "simplify" this to a `split()` — a run appearing twice would
 * emphasise both.
 */
export function Emphasise({
	text,
	emphasis,
}: {
	text: string;
	emphasis: string;
}) {
	const at = text.indexOf(emphasis);
	if (at === -1) return <>{text}</>;

	return (
		<>
			{text.slice(0, at)}
			<em className="text-accent">{emphasis}</em>
			{text.slice(at + emphasis.length)}
		</>
	);
}
