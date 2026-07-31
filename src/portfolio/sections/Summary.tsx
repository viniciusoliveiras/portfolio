import type { Messages } from "~/content/pt";
import { Emphasise } from "../Emphasise";

/**
 * One paragraph, set in the SERIF at display size — the only place on the page where a
 * long passage takes the serif rather than the sans. That inversion is the point: this
 * is the page's thesis, and setting it in the display face is what marks it as the
 * thing to read if you read one thing.
 *
 * `-mt-2` pulls the first line up to sit level with its section mark. The mark's cap
 * height and this paragraph's ascender do not agree at these two very different sizes,
 * so the optical alignment needs the nudge that `items-start` alone cannot give.
 */
export function Summary({ copy }: { copy: Messages["summary"] }) {
	return (
		<p className="-mt-2 max-w-[820px] font-serif text-[clamp(24px,2.6vw,33px)] leading-[1.42] text-pretty">
			<Emphasise text={copy.lede} emphasis={copy.emphasis} />
		</p>
	);
}
