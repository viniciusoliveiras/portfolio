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

// The two `paper`/`ink` pairs, as the browser resolves them. ADR-0006's values.
const DARK = { paper: "rgb(20, 19, 18)", ink: "rgb(232, 228, 222)" };
const LIGHT = { paper: "rgb(242, 237, 228)", ink: "rgb(28, 25, 23)" };

/**
 * ONE accent, in BOTH modes — `#2FA35C`, verde vibrante. The superseded direction held
 * that an accent is only ever valid against its own mode's paper and shipped a different
 * value per mode; ADR-0006 ships one. That the SAME string is expected under both colour
 * schemes below is the assertion, not a copy-paste.
 */
const ACCENT = "rgb(47, 163, 92)";

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

		/**
		 * The accent, read off the Summary lede's emphasis run — which is the page's
		 * most stable accent surface: an `<em>` inside a section with an id, present in
		 * both locales, and not a link whose colour a pill utility might override.
		 *
		 * The contact links are NOT usable for this any more: they are pills now, and the
		 * first of them is the filled `pill-solid` (ink ground, paper text), so reading
		 * `#contact a` would assert against ink and pass for the wrong reason.
		 *
		 * The superseded `accent-link` `color-mix()` assertion is gone with it. It guarded
		 * a real hazard — Lightning CSS emits a statically resolved light-mode literal
		 * ahead of the `color-mix()` as a fallback, and the later rule has to win — but
		 * the hazard needed an accent that CHANGES between modes to be observable, and
		 * ADR-0006's accent does not. `accent-link` is also no longer drawn on this page
		 * at all — it survives on /404 and in `Segments`, whose anchors are unfilled.
		 */
		expect(
			await page
				.locator("#summary em")
				.first()
				.evaluate((el) => getComputedStyle(el).color),
		).toBe(ACCENT);

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

		// THE SAME `ACCENT` as the dark test above, and that is the point: one value
		// serves both modes under ADR-0006. If someone reintroduces a per-mode accent,
		// one of these two assertions fails.
		const accent = await page
			.locator("#summary em")
			.first()
			.evaluate((el) => getComputedStyle(el).color);
		expect(accent).toBe(ACCENT);

		await context.close();
	});
});

test.describe("the network", () => {
	test("makes zero third-party requests, and loads all four font files", async ({
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

		/**
		 * SELF-HOSTING IS WHAT BUYS THE ASSERTION ABOVE. ADR-0006 adds a third family and
		 * a fourth file, and taking them from the Google CDN instead would have meant
		 * DELETING the zero-third-party test rather than editing it — which is the clearest
		 * statement of what that choice cost.
		 *
		 * All four must actually be fetched rather than silently falling back to a system
		 * face. `mono-2` rather than `mono`: `/fonts/(.*)` is cached `immutable` for a
		 * year, so the new 400-500 range had to take a new filename.
		 */
		for (const face of [
			"instrument-roman",
			"instrument-italic",
			"hanken",
			"mono-2",
		]) {
			expect(
				requested.some((u) => u.includes(`/fonts/${face}.woff2`)),
				`${face}.woff2 was never requested`,
			).toBe(true);
		}
	});

	/**
	 * THIS TEST'S PREMISE INVERTED UNDER ADR-0006. It used to assert that the SERIF was
	 * the body face — that was the superseded direction, where Source Serif 4 set the
	 * prose and no sans existed at all. Now the sans sets the prose and the serif is
	 * DISPLAY ONLY, so asserting a serif body would enforce the opposite of the design.
	 *
	 * The italic is checked explicitly because it is the face most likely to go missing
	 * without looking broken: if it never loads, the browser mechanically slants the
	 * roman, and a synthesised oblique of a display serif reads as a slightly-off design
	 * choice rather than as a failure.
	 */
	test("all three families load, the sans sets the body and the serif sets the hero", async ({
		page,
	}) => {
		await page.goto("/pt", { waitUntil: "networkidle" });

		const loaded = await page.evaluate(async () => {
			await document.fonts.ready;
			const h1 = document.querySelector("h1");
			return {
				serif: document.fonts.check('400 72px "Instrument Serif"'),
				italic: document.fonts.check('italic 400 72px "Instrument Serif"'),
				sans: document.fonts.check('300 15px "Hanken Grotesk"'),
				mono: document.fonts.check('400 11px "JetBrains Mono"'),
				bodyFamily: getComputedStyle(document.body).fontFamily,
				bodyWeight: getComputedStyle(document.body).fontWeight,
				heroFamily: h1 ? getComputedStyle(h1).fontFamily : "",
			};
		});

		expect(loaded.serif).toBe(true);
		expect(loaded.italic).toBe(true);
		expect(loaded.sans).toBe(true);
		expect(loaded.mono).toBe(true);

		expect(loaded.bodyFamily).toContain("Hanken Grotesk");
		expect(loaded.bodyFamily).not.toContain("Instrument Serif");
		// 300 is the page's default weight, set on `html` — not a browser default.
		expect(loaded.bodyWeight).toBe("300");
		expect(loaded.heroFamily).toContain("Instrument Serif");
	});
});

test.describe("the grain", () => {
	/**
	 * THE HIGHEST-CONSEQUENCE STYLE RULE ON THE SITE. The grain overlay is
	 * `position: fixed; inset: 0` at `z-index: 50`, which is ABOVE the bar's 40 — so it
	 * covers every interactive element on the page. It is survivable only because of
	 * `pointer-events: none`.
	 *
	 * Lose that one declaration and the page looks completely correct and nothing is
	 * clickable: no anchor, no pill, no locale switch, no menu button. There is no visual
	 * symptom to notice in a dev loop, which is exactly why this is asserted in a browser
	 * rather than trusted to review.
	 */
	test("covers the viewport without swallowing clicks", async ({ page }) => {
		await page.setViewportSize(DESKTOP);
		await page.goto("/pt");

		const grain = page.locator("div.grain");
		await expect(grain).toHaveCount(1);

		const style = await grain.evaluate((el) => {
			const s = getComputedStyle(el);
			return {
				pointerEvents: s.pointerEvents,
				position: s.position,
				zIndex: s.zIndex,
			};
		});
		expect(style.pointerEvents).toBe("none");
		expect(style.position).toBe("fixed");

		// The behavioural half: what the browser says is actually at the centre of the
		// viewport must never be the overlay.
		const atCentre = await page.evaluate(() => {
			const el = document.elementFromPoint(
				window.innerWidth / 2,
				window.innerHeight / 2,
			);
			return el?.className ?? "";
		});
		expect(String(atCentre)).not.toContain("grain");

		// And a real click must reach a real anchor. `header > div > nav` is the BAR's nav
		// specifically: the sheet's nav also ships in the HTML with the same hrefs (hidden
		// by the breakpoint), so a bare `header nav a[href=…]` matches two elements and
		// trips strict mode.
		await page.locator('header > div > nav a[href="#skills"]').click();
		await page.waitForTimeout(400);
		expect(page.url()).toContain("#skills");
	});
});

/**
 * REPLACES "the rail". The superseded direction's distinctive device was per-section
 * sticky marginalia — a label scoped to its section as containing block, travelling with
 * it and released at its end, on all six sections. ADR-0006 retires that: the mark is a
 * NUMBERED INDEX ENTRY (`01 / Resumo`) in a 260px column, static on five sections and
 * sticky on exactly one.
 *
 * These tests assert the new arrangement rather than a weakened version of the old one,
 * because "sticky on one of six" is the kind of asymmetry that gets silently normalised
 * to none or to all.
 */
test.describe("the section mark", () => {
	test("is sticky on Skills alone, and static on the other five", async ({
		page,
	}) => {
		await page.setViewportSize(DESKTOP);
		await page.goto("/pt");

		const skills = await page
			.locator("#skills p")
			.first()
			.evaluate((el) => {
				const s = getComputedStyle(el);
				return { position: s.position, top: s.top };
			});
		expect(skills.position).toBe("sticky");
		expect(skills.top).toBe("90px");

		for (const id of [
			"summary",
			"experience",
			"work",
			"education",
			"contact",
		]) {
			const position = await page
				.locator(`#${id} p`)
				.first()
				.evaluate((el) => getComputedStyle(el).position);
			expect(position, `#${id}'s mark should not be sticky`).toBe("static");
		}
	});

	test("Skills holds its mark as the section scrolls past the bar", async ({
		page,
	}) => {
		await page.setViewportSize(DESKTOP);
		await page.goto("/pt");

		const mark = page.locator("#skills p").first();
		await expect(mark).toHaveText(/Competências/);

		// Scroll until the section's own top has gone above the sticky threshold, which is
		// the only state in which `sticky` is observable at all.
		await page.evaluate(() => {
			const el = document.querySelector("#skills");
			if (el)
				window.scrollTo({
					top: window.scrollY + el.getBoundingClientRect().top + 200,
					behavior: "instant",
				});
		});
		await page.waitForTimeout(150);

		const top = await mark.evaluate((el) =>
			Math.round(el.getBoundingClientRect().top),
		);
		expect(top).toBe(90);
	});

	test("is not navigation — no mark is a link", async ({ page }) => {
		await page.setViewportSize(DESKTOP);
		await page.goto("/pt");
		for (const id of [
			"summary",
			"experience",
			"work",
			"skills",
			"education",
			"contact",
		]) {
			await expect(page.locator(`#${id} p`).first().locator("a")).toHaveCount(
				0,
			);
		}
	});

	test("carries its number in accent, and all six are present in order", async ({
		page,
	}) => {
		await page.setViewportSize(DESKTOP);
		await page.goto("/pt");

		const ids = [
			"summary",
			"experience",
			"work",
			"skills",
			"education",
			"contact",
		];
		const marks = ["01", "02", "03", "04", "05", "06"];

		for (const [i, id] of ids.entries()) {
			const span = page.locator(`#${id} p`).first().locator("span").first();
			await expect(span).toHaveText(marks[i] as string);
			expect(await span.evaluate((el) => getComputedStyle(el).color)).toBe(
				ACCENT,
			);
		}
	});
});

test.describe("the bar's height", () => {
	/**
	 * `--spacing-bar` is NOMINAL. The bar composes its height from `py-[14px]` on a
	 * baseline-aligned row — an explicit height would move that alignment — so its real
	 * height is a function of two fonts' vertical metrics and lands at 50.39px against a
	 * declared 54.
	 *
	 * Three things are drawn against the token: the sheet's header row matches it, the
	 * sections' `scroll-margin-top` clears it, Skills' sticky mark holds below it. All
	 * three want the token to be AT LEAST the bar. None of them care that it is a few px
	 * over. So this asserts the headroom in both directions rather than equality:
	 * negative headroom means the derived three no longer clear the bar, and a large
	 * positive one means the token has stopped describing it at all.
	 *
	 * Asserting equality here would fail on a font swap that changes nothing anyone can
	 * see, which is how a true assertion gets deleted.
	 */
	test("leaves `--spacing-bar` a small, positive headroom", async ({
		page,
	}) => {
		await page.setViewportSize(DESKTOP);
		await page.goto("/pt");

		const { declared, measured } = await page.evaluate(() => {
			const header = document.querySelector("header");
			return {
				declared: Number.parseFloat(
					getComputedStyle(document.documentElement).getPropertyValue(
						"--spacing-bar",
					),
				),
				measured: header?.getBoundingClientRect().height ?? 0,
			};
		});

		const headroom = declared - measured;
		expect(
			headroom,
			`the bar measures ${measured}px against a declared ${declared}px — everything drawn against the token has stopped clearing it`,
		).toBeGreaterThanOrEqual(0);
		expect(
			headroom,
			`--spacing-bar is ${headroom}px over the bar's ${measured}px and no longer describes it`,
		).toBeLessThan(6);
	});
});

test.describe("anchored jumps", () => {
	// `scroll-margin-top` of the bar height plus 18px, so a jumped-to heading does not
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
