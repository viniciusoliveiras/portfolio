import { createFileRoute } from "@tanstack/react-router";

import { pt } from "~/content/pt";
import { Portfolio } from "~/portfolio/Portfolio";
import { localeHead } from "~/seo";

// A LITERAL route, not a locale path parameter. A parameterised route is excluded
// from automatic static-path discovery and would need both locales hand-listed in
// `pages` — a TOP-LEVEL `tanstackStart()` option, not `prerender.pages`. A literal
// path is a static path, so there is nothing to enumerate and no drift risk between a
// hand-maintained array and the route tree. It also makes the locale a literal type
// at compile time, with no `isLocale()` guard and no runtime validation.
export const Route = createFileRoute("/pt")({
	head: () => localeHead("pt", pt),
	component: () => <Portfolio locale="pt" m={pt} />,
});
