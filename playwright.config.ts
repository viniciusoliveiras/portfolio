import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

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
	// this seam exists to check are properties of the prerendered output.
	webServer: {
		command: `pnpm preview --port ${PORT} --strictPort`,
		url: `${BASE_URL}/pt`,
		reuseExistingServer: !process.env.CI,
		timeout: 60_000,
	},
});
