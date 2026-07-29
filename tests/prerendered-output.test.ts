import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { SITE_ORIGIN } from "../src/config";
import { en } from "../src/content/en";
import { facts } from "../src/content/facts";
import { pt } from "../src/content/pt";

/**
 * SEAM 1 — the prerendered output.
 *
 * The subject is what a browser or a crawler RECEIVES: the emitted HTML, the tags in
 * the head, the copy present on first paint. Nothing here asserts a class name, a
 * component's props or a section's internal structure — the layout is fixed by a
 * document and changing it must not break a test.
 *
 * Node's own test runner and its native TypeScript execution, so this seam adds NO
 * DEPENDENCY at all. It reads `dist/client`, so `pnpm build` must have run.
 */

const OUT = "dist/client";
const read = (file: string) => {
	try {
		return readFileSync(`${OUT}/${file}`, "utf8");
	} catch {
		assert.fail(
			`${OUT}/${file} is missing — run \`pnpm build\` before this seam.`,
		);
	}
};

const html = { pt: read("pt.html"), en: read("en.html") };
const notFound = read("404.html");

const LOCALES = ["pt", "en"] as const;
type Locale = (typeof LOCALES)[number];
const messages = { pt, en };

/**
 * Restated here rather than imported from `~/config`, deliberately, and the split from
 * `facts`/`pt`/`en` above is the point: those are CONTENT, and importing them proves
 * the shipped copy reached the page. `pt` → `pt-BR` is a CONTRACT, and a test that
 * imports the value it is checking can only prove the page echoed whatever `config`
 * said — it could never catch `config` being wrong. An independent literal can.
 */
const DOC_LANG = { pt: "pt-BR", en: "en" };

/** HTML attribute names are case-insensitive, and React emits `charSet`/`hrefLang`. */
const has = (doc: string, needle: string) =>
	doc.toLowerCase().includes(needle.toLowerCase());

const countOf = (doc: string, re: RegExp) => (doc.match(re) ?? []).length;

const attr = (doc: string, tag: RegExp, name: string) => {
	const found = doc.match(tag)?.[0] ?? "";
	return new RegExp(`${name}="([^"]*)"`, "i").exec(found)?.[1] ?? null;
};

/** `&#x27;` etc. — the emitted HTML escapes what React escapes. */
const decode = (s: string) =>
	s
		.replace(/&#x27;|&#39;/g, "'")
		.replace(/&quot;|&#34;/g, '"')
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&#x2F;/g, "/");

describe("the document itself", () => {
	for (const locale of LOCALES) {
		const doc = html[locale];

		it(`/${locale} declares a charset`, () => {
			assert.match(doc, /<meta\s+charset="utf-8"/i);
		});

		// TRAP 1. Next injected this automatically and Start does not. Without it every
		// breakpoint resolves against a ~980px virtual viewport: phones get the desktop
		// layout, the sheet never appears, the rail renders on a 390px screen.
		it(`/${locale} declares the viewport`, () => {
			assert.ok(
				has(doc, 'name="viewport"') &&
					has(doc, "width=device-width, initial-scale=1"),
				"the viewport meta is missing — phones would get the desktop layout",
			);
		});

		it(`/${locale} sets <html lang> to ${DOC_LANG[locale]}`, () => {
			assert.equal(attr(doc, /<html[^>]*>/i, "lang"), DOC_LANG[locale]);
		});

		// The assertion that would have caught the head() dedupe finding: `head().meta`
		// keys on `name` alone, so two theme-colors differing only in `media` collapse
		// to one. Both must survive, each with its own media condition.
		it(`/${locale} carries BOTH theme-color metas with their media conditions`, () => {
			const tags =
				doc.match(/<meta[^>]*name="theme-color"[^>]*>/gi) ?? ([] as string[]);
			assert.equal(
				tags.length,
				2,
				`expected 2 theme-color metas, got ${tags.length}`,
			);

			const light = tags.find((t) => t.includes("prefers-color-scheme: light"));
			const dark = tags.find((t) => t.includes("prefers-color-scheme: dark"));
			assert.ok(light, "no light-scheme theme-color");
			assert.ok(dark, "no dark-scheme theme-color");
			assert.match(light, /content="#FAF9F7"/i);
			assert.match(dark, /content="#1A1918"/i);
		});
	}
});

describe("title and description", () => {
	for (const locale of LOCALES) {
		const doc = html[locale];
		const m = messages[locale].meta;

		it(`/${locale} title is present, non-empty and within 60`, () => {
			const title = decode(
				/<title[^>]*>([\s\S]*?)<\/title>/i.exec(doc)?.[1] ?? "",
			);
			assert.ok(title.length > 0, "empty <title>");
			assert.equal(title, m.title);
			assert.ok(
				[...title].length <= 60,
				`title is ${[...title].length} code points, budget is 60`,
			);
		});

		it(`/${locale} description is present, non-empty and within 155`, () => {
			const found = attr(doc, /<meta[^>]*name="description"[^>]*>/i, "content");
			assert.ok(found && found.length > 0, "empty description");
			assert.equal(decode(found), m.description);
			assert.ok(
				[...m.description].length <= 155,
				`description is ${[...m.description].length} code points, budget is 155`,
			);
		});
	}
});

describe("canonical, alternates and the Person block", () => {
	for (const locale of LOCALES) {
		const doc = html[locale];

		// `links` are NEVER deduplicated — a canonical declared on both the root and a
		// locale route would render twice.
		it(`/${locale} has exactly one canonical, and it is self-referential`, () => {
			assert.equal(countOf(doc, /rel="canonical"/gi), 1);
			assert.equal(
				attr(doc, /<link[^>]*rel="canonical"[^>]*>/i, "href"),
				`${SITE_ORIGIN}/${locale}`,
			);
		});

		it(`/${locale} lists three reciprocal alternates including itself, plus x-default`, () => {
			const tags =
				doc.match(/<link[^>]*rel="alternate"[^>]*>/gi) ?? ([] as string[]);
			assert.equal(tags.length, 3, `expected 3 alternates, got ${tags.length}`);

			const pairs = tags.map((t) => [
				/hreflang="([^"]*)"/i.exec(t)?.[1],
				/href="([^"]*)"/i.exec(t)?.[1],
			]);
			assert.deepEqual(
				pairs.sort(),
				[
					["en", `${SITE_ORIGIN}/en`],
					["pt-BR", `${SITE_ORIGIN}/pt`],
					// x-default points at the bare origin so it resolves through the edge
					// detector rather than hard-coding a preferred locale.
					["x-default", SITE_ORIGIN],
				].sort(),
			);
		});

		// `script:ld+json` is never deduplicated either, so declaring a Person block on
		// the root as well as here would ship two competing descriptions of one person.
		it(`/${locale} declares exactly one Person block`, () => {
			const blocks =
				doc.match(
					/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi,
				) ?? ([] as string[]);
			assert.equal(
				blocks.length,
				1,
				`expected 1 ld+json block, got ${blocks.length}`,
			);

			const parsed = JSON.parse(
				decode(
					/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i.exec(
						doc,
					)?.[1] ?? "{}",
				),
			);
			assert.equal(parsed["@type"], "Person");
			assert.equal(parsed.url, `${SITE_ORIGIN}/${locale}`);
			assert.equal(parsed.jobTitle, "Tech Lead");
			// ADR-0001 dropped Instagram as off-message.
			assert.ok(!JSON.stringify(parsed.sameAs).includes("instagram"));
		});
	}
});

describe("the social card", () => {
	const OG = [
		"og:type",
		"og:site_name",
		"og:image",
		"og:image:width",
		"og:image:height",
		"og:title",
		"og:description",
		"og:url",
		"og:locale",
	];
	const TWITTER = [
		"twitter:card",
		"twitter:image",
		"twitter:title",
		"twitter:description",
	];

	for (const locale of LOCALES) {
		const doc = html[locale];

		it(`/${locale} carries every og tag on \`property\``, () => {
			for (const tag of OG) {
				assert.ok(has(doc, `property="${tag}"`), `missing og tag: ${tag}`);
			}
		});

		// The Twitter/X card spec says `name`. Since the dedupe key is
		// `name ?? property`, mixing the forms across routes would also produce two
		// independent entries that never override each other.
		it(`/${locale} carries every twitter tag on \`name\`, never \`property\``, () => {
			for (const tag of TWITTER) {
				assert.ok(has(doc, `name="${tag}"`), `missing twitter tag: ${tag}`);
				assert.ok(
					!has(doc, `property="${tag}"`),
					`${tag} is on \`property\`; the card spec says \`name\``,
				);
			}
		});

		it(`/${locale} derives every absolute URL from SITE_ORIGIN`, () => {
			const urls = [...doc.matchAll(/(?:href|content)="(https?:\/\/[^"]+)"/gi)]
				// A capture group is `string | undefined` under `noUncheckedIndexedAccess`.
				.flatMap((m) => (m[1] === undefined ? [] : [m[1]]))
				.filter((u) => !u.startsWith("https://schema.org"))
				// `sameAs` names the author's own profiles on other hosts by design.
				.filter(
					(u) => !u.includes("github.com") && !u.includes("linkedin.com"),
				);

			for (const url of urls) {
				assert.ok(
					url.startsWith(SITE_ORIGIN),
					`${url} does not derive from SITE_ORIGIN`,
				);
			}
			assert.ok(
				urls.length > 0,
				"no absolute URLs found at all — check the regex",
			);
		});
	}
});

describe("content on first paint", () => {
	// The executable form of "no scroll reveals; every byte of content is present on
	// first paint".
	const SECTION_IDS = [
		"summary",
		"experience",
		"work",
		"skills",
		"education",
		"contact",
	];

	for (const locale of LOCALES) {
		const doc = html[locale];
		const m = messages[locale];

		it(`/${locale} contains all six section ids`, () => {
			for (const id of SECTION_IDS) {
				assert.ok(has(doc, `id="${id}"`), `missing section id: ${id}`);
			}
		});

		// Every display figure, read from `facts` so the suite proves the shipped
		// values reached the page.
		it(`/${locale} renders every display figure from facts`, () => {
			for (const value of [
				facts.erpModules,
				facts.erpClients,
				facts.erpUsers,
			]) {
				assert.ok(doc.includes(value), `display figure missing: ${value}`);
			}
		});

		it(`/${locale} renders the copy of every section, in the right locale`, () => {
			const expected = [
				m.hero.roleLine,
				m.hero.lede,
				m.hero.actions.contact.label,
				m.hero.actions.resume.label,
				m.summary.lede,
				...m.experience.groupNote.filter((s) => typeof s === "string"),
				m.experience.roles.lead.period,
				m.experience.roles.lead.title,
				...m.experience.roles.lead.bullets,
				...m.experience.roles.analyst.bullets,
				...m.experience.roles.intern.bullets,
				m.experience.minorRole.title,
				m.work.erp.title,
				m.work.erp.prose,
				...Object.values(m.work.erp.figureLabels),
				m.work.bpo.title,
				m.work.bpo.prose,
				m.work.bpo.lockup.label,
				...Object.values(m.skills.rows).map((r) => r.label),
				m.education.degree.title,
				m.education.degree.institution,
				m.contact.statement,
				...Object.values(m.contact.links).map((l) => l.label),
			];

			const text = decode(doc);
			for (const line of expected) {
				assert.ok(
					text.includes(line),
					`copy missing from /${locale}: ${JSON.stringify(line.slice(0, 70))}`,
				);
			}
		});

		it(`/${locale} does NOT contain the other locale's prose`, () => {
			const other: Locale = locale === "pt" ? "en" : "pt";
			assert.ok(
				!decode(doc).includes(messages[other].summary.lede),
				`/${locale} leaked the ${other} summary`,
			);
		});
	}
});

describe("the /404 page", () => {
	it("is bilingual and marks its English half with its own lang", () => {
		assert.ok(decode(notFound).includes(pt.notFound.message), "no pt half");
		assert.ok(decode(notFound).includes(en.notFound.message), "no en half");
		assert.match(notFound, /lang="en"/i);
	});

	// `cleanUrls: true` serves /404 from 404.html with a 200, so the URL itself is a
	// textbook indexable soft 404 without this.
	it("carries noindex", () => {
		assert.match(notFound, /<meta[^>]*name="robots"[^>]*content="noindex"/i);
	});

	it("carries no canonical and no alternates — it has no locale counterpart", () => {
		assert.equal(countOf(notFound, /rel="canonical"/gi), 0);
		assert.equal(countOf(notFound, /rel="alternate"/gi), 0);
	});

	// A Person block here would be a second competing description of the same person.
	it("carries no Person block", () => {
		assert.equal(countOf(notFound, /application\/ld\+json/gi), 0);
	});

	it("points back at both locale roots", () => {
		assert.match(notFound, /href="\/pt"/);
		assert.match(notFound, /href="\/en"/);
	});
});

describe("zero third-party requests", () => {
	// The self-hosted fonts, the dropped icon wall and the dropped avatar are all in
	// service of this one property, so it is asserted directly.
	const RETIRED = [
		"fonts.googleapis.com",
		"fonts.gstatic.com",
		"cdn.jsdelivr.net",
		"raw.githubusercontent.com",
		"avatars.githubusercontent.com",
		"api.github.com",
		"i.imgur.com",
		"sirv.com",
		"my.indeed.com",
		"instagram.com",
	];

	for (const [name, doc] of [
		["pt.html", html.pt],
		["en.html", html.en],
		["404.html", notFound],
	] as const) {
		it(`${name} references no third-party host`, () => {
			for (const host of RETIRED) {
				assert.ok(!has(doc, host), `${name} still references ${host}`);
			}

			// Nothing beyond SITE_ORIGIN and the author's own profile links.
			const hosts = new Set(
				[
					...doc.matchAll(/(?:href|src|content)="https?:\/\/([^/"]+)/gi),
				].flatMap((m) => (m[1] === undefined ? [] : [m[1].toLowerCase()])),
			);
			const allowed = new Set([
				new URL(SITE_ORIGIN).host.toLowerCase(),
				"schema.org",
				"github.com",
				"www.linkedin.com",
			]);
			for (const host of hosts) {
				assert.ok(
					allowed.has(host),
					`${name} references unexpected host ${host}`,
				);
			}
		});
	}
});

describe("the assets the head promises", () => {
	it("emits both preloaded font files, with crossorigin on each preload", () => {
		for (const face of ["roman", "mono"]) {
			const tag = new RegExp(
				`<link[^>]*rel="preload"[^>]*/fonts/${face}\\.woff2[^>]*>`,
				"i",
			).exec(html.pt)?.[0];
			assert.ok(tag, `no preload for ${face}.woff2`);
			// Required on font preloads EVEN SAME-ORIGIN; omitting it fetches twice.
			assert.match(tag, /crossorigin/i);
			assert.match(tag, /as="font"/i);
			assert.ok(
				readFileSync(`${OUT}/fonts/${face}.woff2`).length > 0,
				`${face}.woff2 is not in the output`,
			);
		}
	});

	it("emits the favicon, unoptimised and with no fill-rule", () => {
		const svg = read("favicon.svg");
		// The V is three overlapping contours; under `evenodd` the overlaps punch out
		// and 8.8% of the ink is lost, entirely on the serifs. Nothing must set it.
		assert.ok(!svg.includes("fill-rule"), "the favicon gained a fill-rule");
		assert.ok(!svg.includes("<style"), "the favicon gained CSS");
		assert.equal(
			Buffer.byteLength(svg),
			332,
			"the favicon changed size — it must never meet an SVG optimiser",
		);
	});

	it("emits the résumé PDF byte-identical to the source", () => {
		// Regression test for a real defect: with prerender `crawlLinks` at its default
		// `true`, the crawler followed `/resume-en.pdf` from the hero and the contact
		// list, fetched it, and wrote the response AS TEXT — a 40.6 KB PDF came back out
		// at 71,889 bytes with every non-ASCII byte replaced by U+FFFD.
		const source = readFileSync("public/resume-en.pdf");
		const emitted = readFileSync(`${OUT}/resume-en.pdf`);
		assert.ok(
			emitted.equals(source),
			"the emitted résumé PDF is not the source file",
		);
		assert.equal(emitted.subarray(0, 5).toString("latin1"), "%PDF-");
	});

	it("emits the OG card at the size the head advertises", () => {
		const png = readFileSync(`${OUT}/og.png`);
		assert.equal(png.subarray(1, 4).toString("latin1"), "PNG");
		// IHDR width/height, big-endian at byte 16.
		assert.equal(png.readUInt32BE(16), 1200);
		assert.equal(png.readUInt32BE(20), 630);
	});

	it("emits robots.txt with no stale Disallow", () => {
		const robots = read("robots.txt");
		assert.match(robots, /User-agent: \*/);
		assert.match(robots, /Allow: \//);
		// Copy-pasted verbatim from Google's own documentation example, referencing a
		// directory that never existed in this repo.
		assert.ok(!robots.includes("nogooglebot"));
	});
});

describe("the output shape Vercel needs", () => {
	// `autoSubfolderIndex: false` must emit these three at the OUTPUT ROOT: that is
	// where `cleanUrls` and Vercel's zero-config 404 both look. The default `true`
	// would emit `404/index.html`, which Vercel would never find.
	it("emits exactly pt.html, en.html and 404.html at the root", () => {
		for (const file of ["pt.html", "en.html", "404.html"]) {
			assert.ok(read(file).length > 0, `${file} is not at the output root`);
		}
	});

	it("emits no index.html — `/` is an edge redirect, not a page", () => {
		assert.throws(
			() => readFileSync(`${OUT}/index.html`, "utf8"),
			"an index.html exists; `/` must be a 307 at the edge, not a prerendered page",
		);
	});
});
