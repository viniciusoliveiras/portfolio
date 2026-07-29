# ADR-0002: TypeScript compiler baseline and Biome toolchain

- **Status**: Accepted
- **Date**: 2026-07-27
- **Resolves**: [Fix the Biome ruleset and the TypeScript compiler baseline](https://github.com/viniciusoliveiras/portfolio/issues/7), on [the migration map](https://github.com/viniciusoliveiras/portfolio/issues/1)

## Context

Two toolchains are being replaced at once, and both questions are really one question: **how strict is the new codebase with itself?**

Today the repo runs ESLint (airbnb + `@typescript-eslint` + `import`, `import-helpers`, `jsx-a11y`, `react`, `react-hooks`, `testing-library`, `prettier` plugins — 14 packages) alongside Prettier 2.3.2, against a `tsconfig.json` with `strict: false`, `target: es5` and `moduleResolution: node`. All of it dates from a 2021 `create-next-app` scaffold.

Three facts shaped every decision below.

**The "keep the migration diff reviewable" constraint does not exist.** The ticket asked whether formatting should match the existing code so the diff stays readable. [ADR-0001](0001-information-architecture.md) and the [design brief](0005-visual-direction.md) between them rewrite every file in `src/`, so there is no diff to preserve. Every choice here is made on merit, not continuity.

**The codebase has no async surface.** Grepping the current source, the repo's entire use of promises is four lines: the two `getStaticProps` functions in `about.tsx` and `home.tsx`, and their two `await api.get(...)` calls. ADR-0001 cuts both. This single fact decides the type-aware linting question.

**One current setting has never worked.** `prettier.config.js` declares `tralingComma: 'all'` — misspelled, therefore inert. The project has been running Prettier 2's `es5` default for five years. Biome's default is `all`, i.e. what the config always intended.

Version pins come from [Pin the target stack versions and release status](https://github.com/viniciusoliveiras/portfolio/issues/2): `typescript@7.0.2`, `@biomejs/biome@2.5.5`. Everything asserted below about their behaviour was verified on 2026-07-27 against primary sources — Biome's published JSON schema for 2.5.5, its docs and changelog, TypeScript 7's announcement, and the compiler option declarations in `microsoft/typescript-go`.

## Decision

### TypeScript 7.0.2, installed as a dual alias

Go straight to 7.0. Microsoft recommends staging through 6.0 first, but that advice addresses codebases being *migrated*; this config is authored fresh, so there is nothing to stage. TS 7's one real limitation — **it ships no programmatic API** — has no consumer in the pinned stack: Biome has its own Rust inference, Vite transpiles with esbuild/oxc, and TanStack Router's plugin parses route files itself. Typechecking is a CLI call.

The install follows the pattern in TanStack Router's own maintained `examples/react/start-basic` (fetched 2026-07-27):

```json
"devDependencies": {
  "@typescript/native": "npm:typescript@^7.0.2",
  "typescript": "npm:@typescript/typescript6@^6.0.2"
}
```

The two do not collide: `typescript@7.0.2` provides the `tsc` bin, `@typescript/typescript6@6.0.2` provides `tsc6`. So `tsc --noEmit` runs the Go compiler, while anything resolving the `typescript` specifier — editors, tooling — gets the 6.0 programmatic API. This is ugly, and it is adopted because the framework's maintained example is the best available evidence for a compiler three weeks old.

### `tsconfig.json`

```json
{
  "include": ["**/*.ts", "**/*.tsx", "**/*.d.ts"],
  "exclude": [".output", ".nitro", "dist"],
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "target": "ES2024",
    "lib": ["DOM", "DOM.Iterable", "ES2024"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["vite/client"],
    "jsx": "react-jsx",
    "noEmit": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "paths": { "~/*": ["./src/*"] }
  }
}
```

Rationale, one line each:

| Setting | Why |
| --- | --- |
| `strict: true` | TS 7 defaults it to `true`, so `false` would be the active choice — and the churn objection is void when every component is rewritten anyway. Stated explicitly so a future compiler's default drift can't change it. |
| `noUncheckedIndexedAccess: true` | The site iterates with `.map()` (unaffected); where it bites is record lookups, which is exactly where i18n resource access lives. |
| `verbatimModuleSyntax: true` | Forces `import type` to be written, not inferred — matters under Vite, which erases types per-file with no cross-file knowledge. Safe now only because [the dependency verdicts](https://github.com/viniciusoliveiras/portfolio/issues/4) killed the last CJS-only dependency. |
| `target`/`lib` at `ES2024` | TS 7's default target is "the current stable ECMAScript version immediately preceding `esnext`" — it moves under you on compiler upgrades. Pinned so a bump can't silently change output semantics. |
| `moduleResolution: "Bundler"` | `node` is **removed** in TS 7, and Bundler is correct under Vite. |
| **`types: ["vite/client"]`** | **Load-bearing, and the easiest line in the migration to omit.** Two TS 7 default changes collide: `types` now defaults to `[]` (was `["*"]`), and `noUncheckedSideEffectImports` now defaults to `true`. Vite's `client.d.ts` (8.1.5) is what declares `declare module '*.css' {}` and `declare module '*.woff2'`. Without this line, the root route's global stylesheet import and the three self-hosted font imports are compile errors. |
| `jsx: "react-jsx"` | Today's `preserve` existed for Next's compiler. |
| `skipLibCheck: true` | A judgment call, not a default. Off, a single bad `.d.ts` anywhere in the tree fails the build — and this stack points a three-week-old compiler at an RC-stage framework, React 19 types and `react-parallax-tilt`. Those are errors that can only be pinned around, not fixed. |
| `allowJs` **absent** | No `.js` files exist in `src/` and the config files are TS or JSON. Off, a stray `.js` is a visible mistake rather than a silently unchecked one. |
| `exclude` | TS excludes `node_modules` by default but not build output; Nitro's Vercel output contains emitted JS. |
| no `baseUrl` | Unsupported in TS 7. `paths` resolves relative to the config file. |
| `paths: { "~/*": … }` | `~` matches the framework's own examples, which is where implementation code will be copied from. |

`routeTree.gen.ts` is generated into `src/`, so it falls inside `include` and **is** typechecked — that is how route type-safety works. It must therefore be committed, or generated before `tsc` runs in CI.

### The division of labour

Written down as a rule, because it is what stops the next person adding `noUnusedLocals` "for safety":

> **The compiler owns type soundness. Biome owns dead code and style.**

Consequently these compiler flags stay **off**, not because they are wrong but because Biome does the same job in milliseconds with autofix: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`. Biome's `noUnusedVariables` and `noUnusedImports` are recommended in `correctness`; `noFallthroughSwitchClause` is recommended-error in `suspicious`.

And these stay off on their own merits: `exactOptionalPropertyTypes` (noisy against React prop spreading for a distinction this code never depends on), `noPropertyAccessFromIndexSignature` (fights record-shaped i18n access), `noImplicitOverride` (no classes), `erasableSyntaxOnly` (buys nothing under Vite and forecloses `enum`).

### `biome.json`

```json
{
  "$schema": "https://biomejs.dev/schemas/2.5.5/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": {
    "includes": ["**", "!src/routeTree.gen.ts", "!.output/**", "!.nitro/**", "!dist/**"]
  },
  "formatter": { "enabled": true },
  "linter": {
    "enabled": true,
    "domains": { "react": "recommended", "test": "none" },
    "rules": {
      "recommended": true,
      "a11y": { "preset": "all" },
      "suspicious": {
        "noUnknownAtRules": {
          "level": "error",
          "options": {
            "ignore": [
              "theme",
              "utility",
              "variant",
              "custom-variant",
              "apply",
              "source",
              "plugin",
              "reference"
            ]
          }
        }
      }
    }
  },
  "assist": {
    "enabled": true,
    "actions": {
      "source": {
        "organizeImports": {
          "level": "on",
          "options": {
            "groups": [":NODE:", ":BLANK_LINE:", ":PACKAGE:", ":BLANK_LINE:", [":ALIAS:", ":PATH:"]],
            "sortBareImports": false,
            "identifierOrder": "natural"
          }
        }
      }
    }
  }
}
```

Rationale, one line each:

| Choice | Why |
| --- | --- |
| `recommended: true`, default severities | The recommended set ships per-rule severities Biome chose deliberately (unused vars warn, fallthrough switch errors). Forcing everything to `error` throws that design away. |
| `a11y: { preset: "all" }` | The one group turned up, from 40 rules' recommended subset to all 40. Justified by the content: the design brief measured contrast to AA and AAA, and [the drawer ticket](https://github.com/viniciusoliveiras/portfolio/issues/15) exists because accessibility is the hard part of the site's only interactive component. Four anchors, a drawer and a language switcher will not generate noise. |
| `domains` stated explicitly | Domains auto-enable from `package.json` detection; a spec should not depend on inference. `test: "none"` because tests are out of scope for this effort. |
| No `style` opt-ins | Biome's `style` group is far lighter than airbnb, and losing airbnb is a subtraction already being paid for by hand — the current config spends 20 lines switching airbnb rules *off*. |
| `useFilenamingConvention` **off** (i.e. not enabled) | Named explicitly as a deliberate omission: TanStack Router's routes are `__root.tsx`, `$lang.tsx`, `index.tsx`, and the rule flags exactly those. |
| All type-aware rules **off** | See below — the async surface is empty. |
| `noUnknownAtRules` with an `ignore` allowlist | Biome lints CSS with no knowledge of Tailwind; unconfigured, the stylesheet fails on line 1. The allowlist doubles as documentation of which at-rules the stylesheet may use, and still catches a typo'd `@theem`, which on CSS-first Tailwind otherwise fails silently. **See the 2026-07-29 correction below — the allowlist alone is not sufficient.** |
| `organizeImports` groups | Keeps the working part of the current `import-helpers` convention — third-party above local, blank line between, alphabetised — and drops two pieces that no longer earn their lines (see below). Groups match first-wins: *"Groups are always matched in order, so earlier matchers take priority."* |
| **`sortBareImports: false`** | Stated explicitly rather than left to default: the root route's global stylesheet is a side-effect import, and moving it can change cascade order — a silent, visual-only breakage. |
| `level: "on"` stated | Biome's docs do not state the default for `organizeImports`; a spec should not inherit an unverified one. |
| `files.includes` negations | `routeTree.gen.ts` is generated, so Biome must not police it; build output likewise. |
| `vcs.useIgnoreFile` | Reuses `.gitignore` instead of maintaining a second ignore list. |
| Empty `formatter` block | Biome's formatting defaults are accepted wholesale: **tab indentation** (width 2), double quotes, `semicolons: "always"`, `trailingCommas: "all"`, `arrowParentheses: "always"`, `lineWidth: 80`. Tabs are Biome's default for an accessibility reason — tab width is reader-configurable, spaces are not. |

Two pieces of the current import convention are dropped rather than ported. The `/^@shared/` group is **vestigial** — no `@shared` alias exists anywhere in `src/` or in any path mapping; it came from a template and was never used. The react-first group is **nearly empty by construction** under `jsx: "react-jsx"`, where `React` is never imported and only hook-using files import from `react` at all. The visible effect of dropping it is that `@tanstack/react-router` sorts above `react`, which on a TanStack-based site reads correctly.

> **Corrected 2026-07-29** during implementation. Three additions this config needs against the exact pinned `@biomejs/biome@2.5.5`, none of which are optional.
>
> 1. **`css.parser.tailwindDirectives: true` is required, and the `noUnknownAtRules` allowlist does not stand in for it.** The allowlist is a *lint* option; the stylesheet fails at the **parser**, before any rule runs — `× Tailwind-specific syntax is disabled` on `@theme` and `@utility`, which also aborts the formatter with "Code formatting aborted due to parsing errors". So this ADR's diagnosis ("unconfigured, the stylesheet fails on line 1") was right and its remedy was addressed at the wrong layer. Both are kept: the allowlist still documents intent and still catches a typo'd `@theem`.
>
> 2. **`rules.recommended` is deprecated in 2.5.5** — it emits `The use of the recommended field has been deprecated, and will removed in the next major version of Biome. Use preset instead.` The config ships `"preset": "recommended"`, which is the same rule set.
>
> 3. **`files.includes` must exclude `public`.** With `a11y` at `preset: "all"`, Biome lints `public/favicon.svg` and reports `noSvgWithoutTitle` on it. The rule is meaningless for a browser-chrome asset, and complying would edit a file [the favicon spec](../research/favicon-and-asset-serving.md) §1.6 says must never be reformatted at all — it is 332 hand-computed bytes whose three overlapping contours break under the wrong fill rule.
>
> Two other departures are **not** defects in this ADR but consequences of tests coming into scope, which [the implementation issue](https://github.com/viniciusoliveiras/portfolio/issues/23) sanctioned explicitly: `domains.test` moves from `"none"` to `"recommended"` (this ADR's stated ground for `none` was that tests were out of scope, so it expires rather than being contradicted), and `types` gains `"node"` beside `"vite/client"` for the output-assertion seam.

### CSS is Biome's too

Per Biome's language-support table, CSS parsing, formatting **and** linting are supported with no opt-in — unlike HTML, which "currently requires explicit opt-in." So the global stylesheet that [Specify the Tailwind v4 token layer](https://github.com/viniciusoliveiras/portfolio/issues/16) will produce is covered by the same tool, and its `noUnknownProperty` / `noUnknownUnit` / `noUnknownPseudoClass` rules stay useful.

### No automated Tailwind class sorting

`useSortedClasses` is **nursery** and, per its own docs, does not sort **"screen variant sorting (e.g. `md:`, `max-lg:`)"** or **"custom utilities and variants"**; its Tailwind config is hard-coded and not customisable; it "has no knowledge of values such as colors, font sizes, or spacing values"; its fix is **unsafe**, so it never runs on save; and it "collapses all whitespace (including newlines) into single spaces."

Measured against the design brief, that is close to the worst case: the brief's tokens (`paper`, `ink`, `muted`, `accent`, `rule-strong`) exist only in `@theme` — custom utilities the rule cannot see — and its responsive behaviour is concentrated at `md` and `lg`, the variants it will not sort. It would order part of each `className`, ignore the responsive part, and flatten multi-line class lists.

The working alternative, `prettier-plugin-tailwindcss`, cannot be scoped to `className` attributes — Prettier formats whole files — so adopting it means both tools formatting the same TSX, which is the duplication this migration exists to remove.

**Decision: no class sorting, from either tool.** Consistent class order pays off in large multi-author component libraries; this is a single-author site with seven sections.

### Where it runs: editor, pre-commit, and CI

All three, and the reason for the hook is specific to how this project gets written: **a meaningful share of this codebase will be authored by agents rather than typed into an editor.** Format-on-save is an editor event and never fires for an agent-written file, which makes the editor the least reliable enforcement point here and the commit the only one that always happens.

- **Editor** — commit `.vscode/settings.json` with `"editor.formatOnSave": true`, `"editor.codeActionsOnSave": { "source.fixAll.biome": "explicit", "source.organizeImports.biome": "explicit" }`, and `.vscode/extensions.json` recommending `biomejs.biome`. Committing it is how an agent-authored checkout inherits the setup.
- **Pre-commit** — **Lefthook** (Biome's own recommendation: "fast, cross-platform, and dependency-free"; Husky would need `lint-staged` alongside it, so two dev dependencies instead of one), running `biome check --write --no-errors-on-unmatched --files-ignore-unknown=true {staged_files}` with `stage_fixed: true`.
- **CI** — `biome ci` and `tsc --noEmit` as two separate steps, so a type error and a lint error are distinguishable at a glance.
- **Scripts** — `check` (`biome check`), `check:write` (`biome check --write`) and `typecheck` (`tsc --noEmit`) must exist.

One deliberate non-choice: **CI runs plain `biome ci`, without `--error-on-warnings`.** Accepting Biome's per-rule severities and then collapsing warn into error makes the severity design decorative. Warnings appear in the CI log; they do not block.

## Consequences

### The type-aware linting door is closed, with a stated trigger to reopen it

`noFloatingPromises`, `noMisusedPromises`, `noBaseToString`, `useNullishCoalescing` (all nursery) and `noUnnecessaryConditions` (`suspicious`, not recommended) all **activate Biome's Scanner**, which crawls the project to build a module graph and infer types — a different performance class from Biome's normal single-file pass. Biome's own figure is that `noFloatingPromises` catches ~85% of what typescript-eslint would.

They are off because the new codebase has no promises to float. **The trigger to revisit: if the site gains real async work — a contact-form endpoint, client-side data — enable `noFloatingPromises` then.** Recording the trigger is what keeps this from being silently permanent.

`noUnresolvedImports` and `noImportCycles` are Scanner-dependent too; `noUnresolvedImports` is explicitly not recommended, its docs noting that "if you use TypeScript, you probably don't want to use this rule, since TypeScript already performs such checks for you."

### Biome's resolution of the `~/*` alias is unverified

Biome's changelog documents resolver support for tsconfig **`baseUrl`** (2.3.0) and never mentions **`paths`** — and TS 7 *removed* `baseUrl`, so the alias is expressible only via `paths`. This is a second, independent reason not to lean on cross-file type rules. It affects **only** Biome's linting: Vite resolves `~/*` from `vite.config.ts` and `tsc` from `paths`, both independently.

### Two couplings into the Tailwind token layer ticket

[Specify the Tailwind v4 token layer from the design brief](https://github.com/viniciusoliveiras/portfolio/issues/16) inherits two constraints from this ADR:

1. Any at-rule it reaches for must already be in the `noUnknownAtRules` allowlist above — which is why the list is generous rather than minimal. Identically-shaped `ignore` options exist on `noUnknownFunction` and `noUnknownProperty` if Tailwind v4's `--alpha()` / `--spacing()` functions trip those; whether they do was not confirmed, so the escape hatch is named rather than the risk denied.
2. **`useGenericFontNames` is in the a11y group now set to `all`.** It flags `font-family: "Source Serif 4"` without a generic fallback, so the `@font-face` and font-stack declarations must carry `serif` / `monospace` fallbacks. This is the linter being right.

### A new dev dependency, and required scripts

Lefthook is added to `devDependencies` — the first new tool this effort has accepted, against a map that has otherwise been consistently stingy about them. It earns its place on the agent-authoring argument above. [Plan the move from Yarn Berry to pnpm, and fix the Node baseline](https://github.com/viniciusoliveiras/portfolio/issues/8) owns the final `scripts` object and must include `check`, `check:write` and `typecheck`.

### The CI fog patch is now down to one dependency

The map's **CI workflow spec** patch needed Biome, pnpm and Node baselines fixed. Biome's is now fixed, along with the exact CI commands. Only the pnpm and Node baselines remain.

### 15 packages leave, one arrives

Deleted: `.eslintrc.json`, `prettier.config.js`, and 14 ESLint/Prettier packages (`eslint`, `eslint-config-airbnb`, `eslint-config-prettier`, `eslint-import-resolver-typescript`, `eslint-plugin-import`, `eslint-plugin-import-helpers`, `eslint-plugin-jsx-a11y`, `eslint-plugin-prettier`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-testing-library`, `prettier`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`). Added: `@biomejs/biome`, `lefthook`, and the TypeScript pair.

### ADR numbering

This takes `0002`. The design brief was promoted to [ADR-0005](0005-visual-direction.md) on 2026-07-29 by [Assemble the deliverable](https://github.com/viniciusoliveiras/portfolio/issues/22) — not `0003`, as this line guessed while the question was still open.
