import { createFileRoute } from "@tanstack/react-router";

import { en } from "~/content/en";
import { Portfolio } from "~/portfolio/Portfolio";
import { localeHead } from "~/seo";

// The mirror image of `pt.tsx`. The duplication is the route file, a handful of
// lines of it; the page itself is still written once.
export const Route = createFileRoute("/en")({
	head: () => localeHead("en", en),
	component: () => <Portfolio locale="en" m={en} />,
});
