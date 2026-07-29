import { expect, test } from "@playwright/test";

/**
 * SEAM 2 — one browser pass against the production build served locally.
 *
 * This seam exists only for the four things a rendering engine and a cascade can
 * answer and a string search over the HTML cannot. Everything else belongs to
 * `tests/prerendered-output.test.ts`, which needs no browser.
 */

const PHONE = { width: 390, height: 844 };
const DESKTOP = { width: 1280, height: 900 };

// The two `paper`/`ink` pairs, as the browser resolves them.
const DARK = { paper: "rgb(26, 25, 24)", ink: "rgb(232, 230, 225)" };
const LIGHT = { paper: "rgb(250, 249, 247)", ink: "rgb(26, 26, 26)" };

test.describe("the sheet", () => {
	/**
	 * THE REASON THIS SEAM EXISTS. `open:flex` is load-bearing: an unconditional
	 * `display` on the `<dialog>` overrides the UA's only mechanism for hiding a closed
	 * one (`dialog:not([open]) { display: none }`). Under prerendering there is no
	 * `open` attribute and no JavaScript has run, so the failure is not a flash on
	 * hydration — it is the nav links printed into the page on every mobile visit.
	 *
	 * JavaScript is DISABLED here on purpose: that is the state a visitor sees before
	 * hydration, and it is the only way to test the prerendered HTML plus CSS alone.
	 */
	test("is not visible at a phone viewport with no JS at all", async ({
		browser,
	}) => {
		const context = await browser.newContext({
			viewport: PHONE,
			javaScriptEnabled: false,
		});
		const page = await context.newPage();
		await page.goto("/pt");

		const sheet = page.locator("dialog");
		await expect(sheet).toHaveCount(1);
		await expect(sheet).toBeHidden();
		await expect(sheet).not.toHaveAttribute("open", /.*/);

		// Every one of the sheet's anchors must be unreachable, not merely transparent:
		// `display: none` is what keeps assistive technology out of it.
		for (const id of ["summary", "education", "contact"]) {
			await expect(sheet.locator(`a[href="#${id}"]`)).toBeHidden();
		}
		expect(await sheet.evaluate((el) => getComputedStyle(el).display)).toBe(
			"none",
		);

		await context.close();
	});

	test("the desktop bar nav is display:none at a phone viewport", async ({
		page,
	}) => {
		// Both navs ship in the prerendered HTML — a JS media query cannot survive
		// prerendering — so the hidden one must be hidden with `display: none`.
		await page.setViewportSize(PHONE);
		await page.goto("/pt");
		const barNav = page.locator("header nav").first();
		expect(await barNav.evaluate((el) => getComputedStyle(el).display)).toBe(
			"none",
		);
	});

	test("opens, traps focus, closes on Escape and restores focus to the trigger", async ({
		page,
	}) => {
		await page.setViewportSize(PHONE);
		await page.goto("/pt");

		const trigger = page.getByRole("button", { name: "Abrir menu" });
		const sheet = page.locator("dialog");

		await expect(sheet).toBeHidden();
		await trigger.click();
		await expect(sheet).toBeVisible();

		// `showModal()` applies `inert` to everything outside, so the platform supplies
		// the trap. The property that matters is that tabbing cannot WALK BEHIND THE
		// OVERLAY — it must never reach a focusable element outside the dialog.
		//
		// Measured: the cycle runs close button → six anchors → the switcher → `<body>`
		// → back to the close button. That one landing on `<body>` is the UA's own
		// sequential-navigation wrap point, not an escape, so asserting "activeElement is
		// always inside the dialog" fails on a page where the trap is working perfectly.
		// Twelve tabs covers the eight-element cycle one and a half times.
		for (let i = 0; i < 12; i++) {
			await page.keyboard.press("Tab");
			const where = await page.evaluate(() => {
				const active = document.activeElement;
				const dialog = document.querySelector("dialog");
				if (!active || !dialog) return "nothing";
				if (dialog.contains(active)) return "inside";
				if (active === document.body || active === document.documentElement) {
					return "wrap point";
				}
				return `OUTSIDE: <${active.tagName.toLowerCase()}> ${(
					active.textContent ?? ""
				).trim()}`;
			});
			expect(where, `tab ${i + 1} walked behind the overlay`).toMatch(
				/^(inside|wrap point)$/,
			);
		}

		// Modal dialogs only — `<dialog open>` would not give us this.
		await page.keyboard.press("Escape");
		await expect(sheet).toBeHidden();

		// Focus restoration is spec'd behaviour of close(), not something we implement.
		await expect(trigger).toBeFocused();
	});

	test("closes when a section is picked from it", async ({ page }) => {
		await page.setViewportSize(PHONE);
		await page.goto("/pt");

		await page.getByRole("button", { name: "Abrir menu" }).click();
		const sheet = page.locator("dialog");
		await expect(sheet).toBeVisible();

		// Without close() on each anchor the visitor jumps to the section and stares at
		// the sheet still covering it.
		await sheet.locator('a[href="#experience"]').click();
		await expect(sheet).toBeHidden();
	});

	test("closes when the close button is used", async ({ page }) => {
		await page.setViewportSize(PHONE);
		await page.goto("/pt");
		await page.getByRole("button", { name: "Abrir menu" }).click();
		const sheet = page.locator("dialog");
		await expect(sheet).toBeVisible();
		await page.getByRole("button", { name: "Fechar menu" }).click();
		await expect(sheet).toBeHidden();
	});
});

test.describe("the palette follows the system theme", () => {
	/**
	 * The executable form of "never `@theme inline`". With `inline`, the utilities
	 * compile to literal light values and the dark override below is unreachable — no
	 * error, no warning, the site simply never goes dark.
	 */
	test("resolves paper and ink to their dark values under prefers-color-scheme: dark", async ({
		browser,
	}) => {
		const context = await browser.newContext({ colorScheme: "dark" });
		const page = await context.newPage();
		await page.goto("/pt");

		const resolved = await page.evaluate(() => {
			const s = getComputedStyle(document.documentElement);
			return { paper: s.backgroundColor, ink: s.color };
		});
		expect(resolved).toEqual(DARK);

		// And the one coloured surface stays legible: the dark accent, not the light one.
		const link = page.locator("#contact a").first();
		expect(await link.evaluate((el) => getComputedStyle(el).color)).toBe(
			"rgb(240, 115, 106)",
		);

		// The underline too. `accent-link` sets its decoration colour with a
		// `color-mix()` over the accent token, and Lightning CSS emits a STATICALLY
		// RESOLVED light-mode literal ahead of it as a fallback for engines without
		// `color-mix()`. The later rule must be the one that wins, or the underline
		// keeps its light value on dark paper — the same failure shape as `@theme
		// inline`, one property down.
		const decoration = await link.evaluate(
			(el) => getComputedStyle(el).textDecorationColor,
		);
		expect(decoration).not.toContain("179");
		expect(decoration).toMatch(/240|oklab|color-mix/);

		await context.close();
	});

	test("resolves paper and ink to their light values under prefers-color-scheme: light", async ({
		browser,
	}) => {
		const context = await browser.newContext({ colorScheme: "light" });
		const page = await context.newPage();
		await page.goto("/pt");

		const resolved = await page.evaluate(() => {
			const s = getComputedStyle(document.documentElement);
			return { paper: s.backgroundColor, ink: s.color };
		});
		expect(resolved).toEqual(LIGHT);

		// `#B3261E` — crossing an accent with the other mode's paper fails contrast.
		const accent = await page
			.locator("#contact a")
			.first()
			.evaluate((el) => getComputedStyle(el).color);
		expect(accent).toBe("rgb(179, 38, 30)");

		await context.close();
	});
});

test.describe("the network", () => {
	test("makes zero third-party requests, and loads both font files", async ({
		page,
	}) => {
		const requested: string[] = [];
		page.on("request", (r) => requested.push(r.url()));

		await page.goto("/pt", { waitUntil: "networkidle" });

		// The origin under test, rather than a hardcoded localhost, so this means the
		// same thing when pointed at a deployment.
		const own = new URL(page.url()).host;

		/**
		 * Vercel injects preview-only instrumentation into PREVIEW deployments —
		 * `vercel.live/_next-live/feedback` (the comment toolbar), `login/validate` and
		 * `/.well-known/vercel/jwe` (preview auth). Verified as NOT ours: `vercel.live`
		 * appears nowhere in `src/`, nowhere in `dist/client`, and nowhere in the HTML
		 * response even when fetched with a browser user agent. It is added client-side
		 * by the platform for previews and is absent from production.
		 *
		 * Allowed ONLY when this run is deliberately pointed at a preview. On a local or
		 * production run the assertion stays absolute, so the property this site is built
		 * around cannot quietly stop being tested.
		 */
		const previewNoise = process.env.PREVIEW_URL
			? [/(^|\.)vercel\.live$/, /(^|\.)vercel-scripts\.com$/]
			: [];

		const foreign = requested.filter((u) => {
			if (u.startsWith("data:") || u.startsWith("blob:")) return false;
			const host = new URL(u).host;
			if (host === own) return false;
			return !previewNoise.some((re) => re.test(host));
		});
		expect(foreign, `third-party requests: ${foreign.join(", ")}`).toEqual([]);

		// Self-hosting the fonts is what buys the zero-third-party property, so the two
		// files must actually be fetched rather than silently falling back to a system
		// serif.
		for (const face of ["roman", "mono"]) {
			expect(
				requested.some((u) => u.includes(`/fonts/${face}.woff2`)),
				`${face}.woff2 was never requested`,
			).toBe(true);
		}
	});

	test("both faces actually load, and the serif is the one in use", async ({
		page,
	}) => {
		await page.goto("/pt", { waitUntil: "networkidle" });

		const loaded = await page.evaluate(async () => {
			await document.fonts.ready;
			return {
				serif: document.fonts.check('400 18px "Source Serif 4"'),
				mono: document.fonts.check('500 12px "JetBrains Mono"'),
				bodyFamily: getComputedStyle(document.body).fontFamily,
			};
		});

		expect(loaded.serif).toBe(true);
		expect(loaded.mono).toBe(true);
		expect(loaded.bodyFamily).toContain("Source Serif 4");
	});
});

test.describe("the rail", () => {
	// The distinctiveness of the whole design is this device, and it is CSS only —
	// `position: sticky` scoped to the section as containing block, no scroll-spy and no
	// IntersectionObserver. Asserting it travels and is released is asserting behaviour,
	// not structure.
	test("travels with its section and is released at the section's end", async ({
		page,
	}) => {
		await page.setViewportSize(DESKTOP);
		await page.goto("/pt");

		const label = page.locator("#experience p").first();
		await expect(label).toHaveText("Experiência");

		await page.locator("#experience").scrollIntoViewIfNeeded();
		await page.waitForTimeout(100);
		const travelling = await label.evaluate((el) =>
			Math.round(el.getBoundingClientRect().top),
		);

		// Sticky at the bar height plus 1.75rem = 84px.
		expect(travelling).toBe(84);

		// Scrolling past the section releases the label upward rather than pinning it.
		await page.locator("#skills").scrollIntoViewIfNeeded();
		await page.waitForTimeout(100);
		const released = await label.evaluate((el) =>
			Math.round(el.getBoundingClientRect().top),
		);
		expect(released).toBeLessThan(84);
	});

	test("is not navigation — no rail label is a link", async ({ page }) => {
		await page.setViewportSize(DESKTOP);
		await page.goto("/pt");
		for (const id of ["summary", "experience", "work", "skills", "contact"]) {
			await expect(
				page.locator(`#${id} > div > div:first-child a`),
			).toHaveCount(0);
		}
	});
});

test.describe("anchored jumps", () => {
	// `scroll-margin-top` of the bar height plus 1rem, so a jumped-to heading does not
	// land underneath the sticky bar.
	test("do not land the section under the sticky bar", async ({ page }) => {
		await page.setViewportSize(DESKTOP);
		await page.goto("/pt");

		await page.locator('header > div > nav a[href="#work"]').click();
		await page.waitForTimeout(600);

		const barBottom = await page
			.locator("header")
			.evaluate((el) => el.getBoundingClientRect().bottom);
		const sectionTop = await page
			.locator("#work")
			.evaluate((el) => el.getBoundingClientRect().top);

		expect(sectionTop).toBeGreaterThanOrEqual(barBottom - 1);
	});
});

test.describe("the locale switch", () => {
	test("crosses to the other locale and holds the reader's section", async ({
		page,
	}) => {
		await page.setViewportSize(DESKTOP);
		await page.goto("/pt#skills");
		await page.waitForTimeout(300);

		await page.locator('header > div > nav a[hreflang="en"]').click();
		await expect(page).toHaveURL(/\/en#skills$/);

		// The document language must follow the route, or a synthesiser reads English
		// prose with Portuguese phonemes.
		await expect(page.locator("html")).toHaveAttribute("lang", "en");
		await expect(page.locator("#skills")).toBeVisible();
	});
});
