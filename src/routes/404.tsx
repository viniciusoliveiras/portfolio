import { createFileRoute } from "@tanstack/react-router";

import { NotFound } from "~/portfolio/NotFound";

// A REAL route, not just the root's `notFoundComponent` option. `notFoundComponent`
// is a route option rather than a path, so the prerenderer has nothing to render from
// it — and Vercel serves a custom 404 zero-config if and only if `404.html` sits at
// the OUTPUT ROOT, which is what `autoSubfolderIndex: false` produces.
export const Route = createFileRoute("/404")({
	head: () => ({
		meta: [
			{ title: "Página não encontrada · Page not found" },
			// REQUIRED, and `cleanUrls: true` is why. The zero-config path is safe — a
			// cold request to an unknown URL returns a real 404, which is never indexed
			// — but the `/404` URL itself resolves 200 from `404.html` and is a textbook
			// indexable soft 404.
			{ name: "robots", content: "noindex" },
		],
		// No canonical and no `hreflang` here: the page has no locale counterpart to
		// point at.
	}),
	component: NotFound,
});
