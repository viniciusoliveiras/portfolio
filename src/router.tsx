import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

/**
 * The router entry. `src/router.{ts,tsx}` exporting `getRouter` is REQUIRED by
 * `@tanstack/start-plugin-core` — `resolveStartEntryPlan` marks it `required: true`
 * and the build fails with "Could not resolve entry for router entry" without it,
 * before any of our code runs. It is also what the generated route tree's footer
 * imports to register `Awaited<ReturnType<typeof getRouter>>` as the app's router
 * type, which is where route-level type safety comes from.
 *
 * NO DOCUMENT IN THE SPEC MENTIONS THIS FILE. The i18n research §4 notes in passing
 * that "the router itself is created by a `getRouter()` factory, not a module-level
 * instance", which is the shape below, but never records that the file is mandatory or
 * what it is called. Recorded as a gap in the corpus rather than patched silently.
 *
 * A FACTORY, not a module-level instance, and the reason survives the site being
 * static: a fully prerendered build still server-renders at build time, and prerender
 * `concurrency` defaults to 14, so `/pt`, `/en` and `/404` are rendered concurrently
 * in one process. Any per-render state held at module scope would be raced between
 * them and bake a nondeterministic result into the committed-adjacent build output.
 * There is none here — the locale is a literal type on each route and the copy is a
 * static import — and this shape is what keeps it that way.
 *
 * No `scrollRestoration` and no `defaultPreload`: the locale switch is the only route
 * change on the site, it carries its own `resetScroll={false}` plus the current hash,
 * and preloading the other locale on hover is a request the spec never asked for.
 */
export function getRouter() {
	return createRouter({ routeTree });
}
