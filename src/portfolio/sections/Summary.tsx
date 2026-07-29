import type { Messages } from "~/content/pt";

/**
 * One `lede` paragraph and NO STRUCTURE BEYOND THAT, deliberately: it is three
 * sentences, it is the highest-value block on the page — it does not exist on the
 * current site at all — and any device added to it would compete with the display
 * figures two sections down.
 */
export function Summary({ copy }: { copy: Messages["summary"] }) {
	return <p className="text-lede">{copy.lede}</p>;
}
