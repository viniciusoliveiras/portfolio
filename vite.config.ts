import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	// Biome's resolver reads tsconfig `baseUrl`, never `paths`, and TS 7 removed
	// `baseUrl` — so the `~/*` alias has to be declared here for Vite as well.
	resolve: {
		alias: { "~": fileURLToPath(new URL("./src", import.meta.url)) },
	},
	plugins: [
		tailwindcss(),
		tanstackStart({
			srcDirectory: "src",
			// `autoSubfolderIndex: false` emits pt.html / en.html / 404.html at the
			// output ROOT, which is where `cleanUrls` and Vercel's zero-config 404
			// both look. The default `true` would emit `404/index.html` instead and
			// Vercel would never find it. No `pages` block: literal locale routes are
			// static paths, so `autoStaticPathsDiscovery` finds all three.
			prerender: {
				enabled: true,
				autoSubfolderIndex: false,

				// `/` IS NOT A ROUTE on this site — ADR-0004 makes it an edge 307 to a
				// detected locale — but the prerenderer seeds its queue with `/`
				// whenever `pages` is empty (`pages.length ? pages : [{ path: "/" }]`),
				// so it is enqueued, 404s, and `failOnError` (default true) aborts the
				// build. The i18n research recorded "`filter` is unnecessary"; it is not.
				filter: (page) => page.path !== "/",

				// MEASURED, and the reason is a silent data-corruption bug rather than a
				// preference. Link crawling collects every `href` starting with `/`,
				// which includes `/resume-en.pdf` — linked from the hero and the contact
				// list in both locales. The crawler then fetches it and writes the
				// response AS TEXT: the 40.6 KB PDF came back out at 71,889 bytes with
				// every non-ASCII byte replaced by U+FFFD, i.e. a corrupted résumé
				// shipped over the good one, on the most important click-through on the
				// site. The i18n research left this at its default `true` reasoning it
				// "costs nothing here and acts as a net if a future route is ever added
				// behind a link" — but every route on this site is static, so
				// `autoStaticPathsDiscovery` already finds all of them and the net
				// catches nothing it misses. Recorded as a defect in that document.
				crawlLinks: false,
			},
		}),
		viteReact(),
	],
});
