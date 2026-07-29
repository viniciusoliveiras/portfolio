import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const LOCAL_URL = `http://localhost:${PORT}`;

/**
 * Point the seam at a real deployment with `PREVIEW_URL=https://… pnpm exec playwright
 * test`. The cutover plan makes a validated preview the gate before the irreversible
 * step, so the browser checks have to be runnable against that preview and not only
 * against a local build — "the same static output" is an assumption worth spending one
 * env var to stop making.
 */
const PREVIEW = process.env.PREVIEW_URL;
const BASE_URL = PREVIEW ?? LOCAL_URL;

export default defineConfig({
	// `tests/browser` only — `tests/prerendered-output.test.ts` belongs to Node's test
	// runner, and a `testDir` of `tests` would make Playwright try to run it too.
	testDir: "tests/browser",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	reporter: "list",
	use: { baseURL: BASE_URL },
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

	// Against the PRODUCTION BUILD served locally, not the dev server: the properties
	// this seam exists to check are properties of the prerendered output. Skipped
	// entirely when pointed at a deployment, which is already serving one.
	...(PREVIEW
		? {}
		: {
				webServer: {
					command: `pnpm preview --port ${PORT} --strictPort`,
					url: `${LOCAL_URL}/pt`,
					reuseExistingServer: !process.env.CI,
					timeout: 60_000,
				},
			}),
});
