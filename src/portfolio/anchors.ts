/**
 * Section anchor ids are LOCALE-NEUTRAL ENGLISH SLUGS — `#experience`, never
 * `#experiencia` in one locale and `#experience` in the other. The language switcher
 * carries the current hash across the switch, and a localised id would make the
 * carried hash meaningless. Cheap to decide here, invasive to retrofit.
 */

/**
 * The bar's FOUR anchors — what is worth jumping to. The hero needs none (it is the
 * top), Summary sits directly beneath it, and Education is a low-value jump target.
 */
export const BAR_ANCHORS = ["experience", "work", "skills", "contact"] as const;

/**
 * The sheet's SIX anchors.
 *
 * The corpus states this count three different ways — the design brief and the sheet
 * spec both say seven, the i18n research says "the four anchors", and the section
 * layouts give exactly six sections an id. Six is the reading consistent with the
 * sections that actually exist: the hero has no id and no anchor, so a seventh anchor
 * would have no destination. Taken as a correction to those documents rather than as a
 * local choice; the bar's four are separately and unambiguously fixed.
 */
export const SHEET_ANCHORS = [
	"summary",
	"experience",
	"work",
	"skills",
	"education",
	"contact",
] as const;
