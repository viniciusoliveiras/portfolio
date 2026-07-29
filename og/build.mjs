/**
 * Renders `og/og.html` to `public/og.png` at 1200×630.
 *
 *   node og/build.mjs
 *
 * A ONE-OFF step producing a committed binary, on the same footing as `resume/build.mjs`
 * and the font vendoring: not part of the app build, no `package.json` entry, no CI job.
 * It borrows the Chromium the browser test seam already installs.
 *
 * 1200×630 is asserted in the output seam against `og:image:width`/`height`, so the head
 * and the file cannot disagree.
 */

import { readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

const SOURCE = fileURLToPath(new URL("./og.html", import.meta.url));
const OUTPUT = fileURLToPath(new URL("../public/og.png", import.meta.url));
const WIDTH = 1200;
const HEIGHT = 630;

const before = (() => {
	try {
		return statSync(OUTPUT).size;
	} catch {
		return null;
	}
})();

const browser = await chromium.launch();
// deviceScaleFactor 1: the card is authored at its final pixel size, so scaling would
// only resample it.
const page = await browser.newPage({
	viewport: { width: WIDTH, height: HEIGHT },
	deviceScaleFactor: 1,
});

await page.goto(`file://${SOURCE}`, { waitUntil: "load" });

// The card is set in the site's own subset faces, loaded over `file://` from
// `public/fonts/`. Waiting on `document.fonts` is what stops a screenshot landing while
// the browser is still showing its fallback serif — a failure that looks like a design
// choice rather than a bug.
await page.evaluate(() => document.fonts.ready);
const loaded = await page.evaluate(() => ({
	serif: document.fonts.check('400 112px "Source Serif 4"'),
	mono: document.fonts.check('500 26px "JetBrains Mono"'),
}));
if (!loaded.serif || !loaded.mono) {
	console.error(`FAIL fonts did not load: ${JSON.stringify(loaded)}`);
	await browser.close();
	process.exit(1);
}

await page.screenshot({
	path: OUTPUT,
	clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
});
await browser.close();

const png = readFileSync(OUTPUT);
// IHDR carries the dimensions big-endian at byte 16.
const w = png.readUInt32BE(16);
const h = png.readUInt32BE(20);

console.log(`wrote ${OUTPUT}`);
console.log(
	`  ${png.length} bytes${before === null ? "" : ` (was ${before})`}`,
);
console.log(`  ${w}×${h}`);

if (w !== WIDTH || h !== HEIGHT) {
	console.error(`FAIL expected ${WIDTH}×${HEIGHT}`);
	process.exitCode = 1;
}
