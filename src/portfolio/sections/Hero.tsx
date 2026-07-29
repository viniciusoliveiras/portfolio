import { AUTHOR_NAME } from "~/config";
import type { Messages } from "~/content/pt";

/**
 * FOUR elements, not five: a mono role-and-place line, the name, the positioning
 * sentence, and two underlined accent links. The location rides in the role line
 * rather than sitting below the actions — a separate line there is the classic "tiny
 * tagline below the CTAs" pattern, and it pushed the hero to five.
 *
 * NOT FILLED BUTTONS. Fills are a UI convention that fights the editorial frame; the
 * underline is the affordance, at 40% accent rising to full on hover inside the base
 * layer's 150ms transition. No avatar, anywhere: a face is the one element that
 * outranks type for attention, which would shift this hero's thesis from scope to
 * appearance, and the GitHub photo would break the zero-third-party-requests property
 * the self-hosted fonts win.
 */
export function Hero({ copy }: { copy: Messages["hero"] }) {
	return (
		<div>
			<p className="font-mono text-label text-muted uppercase">
				{copy.roleLine}
			</p>
			<h1 className="mt-3 text-hero optical-60">{AUTHOR_NAME}</h1>
			<p className="mt-8 text-lede">{copy.lede}</p>
			<p className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
				<a href={copy.actions.contact.href} className="accent-link">
					{copy.actions.contact.label}
				</a>
				<a href={copy.actions.resume.href} className="accent-link">
					{copy.actions.resume.label}
				</a>
			</p>
		</div>
	);
}
