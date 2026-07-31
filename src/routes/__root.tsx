import {
	createRootRoute,
	HeadContent,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { AUTHOR_NAME, SITE_ORIGIN } from "~/config";
import { NotFound } from "~/portfolio/NotFound";

// Bare side-effect import, not `?url`: it keeps SSR route-asset discovery, static
// Early Hints, `transformAssets` and CSS inlining, which the `?url` form gives up.
// Biome's `sortBareImports: false` is what stops this being reordered — moving it can
// change cascade order, which is a silent, visual-only breakage.
import "~/styles/global.css";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			// `charSet` and `viewport` are the two highest-consequence lines in this
			// file. NEXT INJECTED BOTH AUTOMATICALLY AND TANSTACK START DOES NOT. Lose
			// the viewport and every Tailwind breakpoint resolves against a ~980px
			// virtual viewport: phones get the desktop layout, the sheet never appears,
			// and every `wide:` grid — the hero's four columns, the work cards' split,
			// the two-column skills list — renders on a 390px screen. A failure that is
			// completely invisible in a desktop dev loop.
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			// Locale-invariant only. Everything that varies lives on the locale routes.
			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: AUTHOR_NAME },
			{ property: "og:image", content: `${SITE_ORIGIN}/og.png` },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:image", content: `${SITE_ORIGIN}/og.png` },
		],
		links: [
			{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
			// FOUR preloads under ADR-0006, not two, and all four are genuinely needed
			// above the fold at a desktop first paint: the two Instrument Serif statics
			// split the `<h1>` and the monogram between them, Hanken sets the hero lede
			// and the meta grid, and the mono sets the eyebrow and the bar. 99.2 KB
			// shipped, 99.2 KB preloaded — there is nothing loaded lazily to distinguish.
			//
			// `crossOrigin` is required on font preloads EVEN SAME-ORIGIN; omitting it
			// makes the browser fetch each file twice.
			//
			// These filenames are load-bearing and must match `global.css`'s `@font-face`
			// blocks exactly. `/fonts/(.*)` is the ONE path `vercel.json` caches
			// `immutable` for a year, so a font that changes must change its name in both
			// places together — `mono-2.woff2` is already the second generation.
			{
				rel: "preload",
				href: "/fonts/instrument-roman.woff2",
				as: "font",
				type: "font/woff2",
				crossOrigin: "anonymous",
			},
			{
				rel: "preload",
				href: "/fonts/instrument-italic.woff2",
				as: "font",
				type: "font/woff2",
				crossOrigin: "anonymous",
			},
			{
				rel: "preload",
				href: "/fonts/hanken.woff2",
				as: "font",
				type: "font/woff2",
				crossOrigin: "anonymous",
			},
			{
				rel: "preload",
				href: "/fonts/mono-2.woff2",
				as: "font",
				type: "font/woff2",
				crossOrigin: "anonymous",
			},
		],
	}),
	// Handles a bad CLIENT-SIDE navigation. `/404.tsx` handles a cold HTTP request to
	// a URL that is not in the build. Both are required and they catch different
	// failures; they share this one component.
	notFoundComponent: NotFound,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
	// `head()` has no `htmlAttrs` key, so `lang` cannot come from it — it has to be
	// JSX here in the shell, which sits ABOVE the locale route and therefore cannot
	// use `Route.useParams()`. It reads router state instead. This is the single
	// easiest thing in the migration to omit and the most expensive to omit: an
	// accessibility and SEO defect that no build step catches.
	//
	// `/404` falls through to `pt-BR`, which is deliberate: the page is bilingual, so
	// no single value is correct, and its English half carries a per-element `lang`.
	const lang = useRouterState({
		select: (s) => (s.location.pathname.startsWith("/en") ? "en" : "pt-BR"),
	});

	return (
		<html lang={lang}>
			<head>
				{/* NOT `head()` entries: its meta dedupe keys on `name`/`property`
				    ALONE — every other attribute, `media` included, is invisible to it.
				    Two tags both named `theme-color` are treated as the same tag and
				    the earlier is silently dropped, so only one would ever render and
				    which one would depend on array order rather than on the reader's
				    colour scheme. The values are the two `paper` tokens. */}
				<meta
					name="theme-color"
					content="#F2EDE4"
					media="(prefers-color-scheme: light)"
				/>
				<meta
					name="theme-color"
					content="#141312"
					media="(prefers-color-scheme: dark)"
				/>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
