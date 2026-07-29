/**
 * Renders `resume/resume-en.html` to `public/resume-en.pdf`.
 *
 *   node resume/build.mjs
 *
 * A ONE-OFF step producing a committed binary — the same shape as the font vendoring
 * in the token layer §6. It is deliberately not a `package.json` script and not a CI
 * job: it runs when the résumé changes, which is rarely and never as part of a deploy.
 * It borrows the Chromium that the browser test seam already installs, so it adds no
 * dependency of its own.
 *
 * The PDF is served UNHASHED from `/resume-en.pdf`, because the document's own footer
 * cites a URL and a content-hashed name could not be written into the file that carries
 * it. Do not move or rename it.
 */

import { readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

const SOURCE = fileURLToPath(new URL("./resume-en.html", import.meta.url));
const OUTPUT = fileURLToPath(
	new URL("../public/resume-en.pdf", import.meta.url),
);

const before = (() => {
	try {
		return statSync(OUTPUT).size;
	} catch {
		return null;
	}
})();

const browser = await chromium.launch();
const page = await browser.newPage();

// `file://` rather than a served URL: the document is self-contained, with no external
// stylesheet, script, image or font to fetch. `load` is therefore already everything.
await page.goto(`file://${SOURCE}`, { waitUntil: "load" });

// Print CSS governs the page box. `@page { size: letter; margin: 0 }` plus the body's
// own padding keeps the margins in one place — the stylesheet — rather than splitting
// them between CSS and this call.
await page.pdf({
	path: OUTPUT,
	format: "Letter",
	printBackground: true,
	preferCSSPageSize: true,
});

await browser.close();

const after = statSync(OUTPUT).size;
const pdf = readFileSync(OUTPUT);
const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? [])
	.length;

console.log(`wrote ${OUTPUT}`);
console.log(`  ${after} bytes${before === null ? "" : ` (was ${before})`}`);
console.log(`  pages: ${pages}`);

// A résumé that has spilled onto a second page is a defect, not a variation: every
// upstream document treats it as the one-page artifact the site links to.
if (pages !== 1) {
	console.error(`FAIL expected exactly 1 page, got ${pages}`);
	process.exitCode = 1;
}
