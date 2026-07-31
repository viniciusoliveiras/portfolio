/**
 * Section anchor ids are LOCALE-NEUTRAL ENGLISH SLUGS — `#experience`, never
 * `#experiencia` in one locale and `#experience` in the other. The language switcher
 * carries the current hash across the switch, and a localised id would make the
 * carried hash meaningless. Cheap to decide here, invasive to retrofit.
 */

/**
 * The bar's FIVE anchors — what is worth jumping to.
 *
 * FOUR under the superseded direction, which excluded Education as "a low-value jump
 * target". ADR-0006's design lists it, and the reasoning that dropped it does not
 * survive the new bar: it was a density argument about a narrow anchor row, and this
 * bar wraps rather than truncating. Summary is still absent because it sits directly
 * beneath the hero, and the hero itself is the top and needs none.
 *
 * The labels come from `nav.anchors`, not `nav.sections` — the bar abbreviates
 * `Selected work` to `Work` where the section mark does not.
 */
export const BAR_ANCHORS = [
	"experience",
	"work",
	"skills",
	"education",
	"contact",
] as const;

/**
 * The sheet's SIX anchors.
 *
 * The corpus states this count three different ways — the superseded design brief and
 * the sheet spec both say seven, the i18n research says "the four anchors", and the
 * section layouts give exactly six sections an id. Six is the reading consistent with
 * the sections that actually exist: the hero has no id and no anchor, so a seventh
 * anchor would have no destination. Taken as a correction to those documents rather
 * than as a local choice.
 *
 * These keep `nav.sections` labels rather than `nav.anchors`: the sheet is full-bleed
 * and has the width to say `Selected work` in full.
 */
export const SHEET_ANCHORS = [
	"summary",
	"experience",
	"work",
	"skills",
	"education",
	"contact",
] as const;
