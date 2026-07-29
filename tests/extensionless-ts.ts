import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";

/**
 * Lets the output-assertion seam import `src/content/*` directly.
 *
 * Node's native TypeScript execution requires a fully-specified import — `./facts`
 * throws ERR_MODULE_NOT_FOUND and only `./facts.ts` resolves — while the app's imports
 * are extensionless, which is what `moduleResolution: "Bundler"` expects and what the
 * framework's own examples use. Rather than push `.ts` suffixes into application code
 * to suit the test runner, the mismatch is absorbed here, in `tests/`.
 *
 * The alternative was for the seam to restate every string it asserts. That was
 * rejected on a stronger ground than convenience: the hard numbers must come from
 * `facts` so the suite proves the SHIPPED values reached the page, and a second
 * hand-maintained copy of them in a test file is precisely the divergence `facts`
 * exists to make impossible.
 *
 * Synchronous `registerHooks` rather than an async loader thread, so it costs nothing
 * and needs no `--experimental` flag. Loaded with `--import`; no dependency.
 */
registerHooks({
	resolve(specifier, context, next) {
		if (specifier.startsWith(".") && !/\.[cm]?[jt]sx?$/.test(specifier)) {
			const candidate = `${specifier}.ts`;
			if (existsSync(fileURLToPath(new URL(candidate, context.parentURL)))) {
				return next(candidate, context);
			}
		}
		return next(specifier, context);
	},
});
