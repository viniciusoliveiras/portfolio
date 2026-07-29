import type { Segment } from "~/content/pt";

/**
 * The segment renderer. Links only — this is why `src/content/` stays plain `.ts`
 * data with no React import: a message typed as a node is assignable to any other
 * node, so the moment a message became JSX, `satisfies Messages` would stop checking
 * it for exactly the strings most likely to diverge.
 *
 * Keys are content-derived rather than positional: the arrays are static and never
 * reorder, and an index key would trip `noArrayIndexKey`.
 */
export function Segments({ segments }: { segments: Segment[] }) {
	return (
		<>
			{segments.map((segment) =>
				typeof segment === "string" ? (
					segment
				) : (
					<a key={segment.href} href={segment.href} className="accent-link">
						{segment.text}
					</a>
				),
			)}
		</>
	);
}
