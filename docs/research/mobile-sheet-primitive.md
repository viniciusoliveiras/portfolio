# The mobile navigation sheet: modal primitive

Resolves [Decide how the mobile drawer's modal primitive is supplied](https://github.com/viniciusoliveiras/portfolio/issues/15).

Checked 2026-07-28. Every CSS claim below was **compiled with the standalone Tailwind 4.3.3 CLI** rather than inferred; the UA stylesheet declarations are quoted from the HTML Standard's rendering section, not from memory. Two of the classes in the ticket's own framing turned out to be wrong, and the compile is what caught them.

---

## 1. The decision, in one paragraph

The mobile navigation is a **full-bleed sheet** built on the **native `<dialog>` element** opened with **`showModal()`**. No headless dependency, no hand-rolled focus trap. The component holds **no React state** — the DOM's `open` attribute is the state. It **fades** over 200ms, CSS-only, using stock Tailwind variants. It exists only below `md`.

## 2. Why the form was settled first

The ticket asked the supply question first and "does it need to be a drawer at all" fourth. That is backwards, because the form decides whether **light dismiss** is a requirement, and light dismiss is the one contract item the platform cannot supply on the target device.

`closedby="any"` gives tap-outside-to-close declaratively. Its support is **0% on iOS Safari across every version through 26.5** ([caniuse](https://caniuse.com/mdn-html_elements_dialog_closedby), 69.88% global; Chrome/Edge 134+, Firefox 141+). On a **mobile-only** primitive, the platform's light dismiss is absent precisely where the primitive lives, and a hand-written backdrop-click handler on a `<dialog>` requires wrapping the contents in an inner element and comparing `event.target`, per [Mayank](https://blog.mayank.co/is-dialog-enough).

A **full-bleed sheet has no visible backdrop**, so nothing invites a tap-outside — there is no outside. The requirement is removed rather than solved. Dismissal is the close button and `Escape`, both free.

Supporting facts: seven anchors and a language switcher do not need a side-anchored panel; the brief's register is editorial rather than app-like; and **the current site's drawer is already full-screen** — `src/components/Header/index.tsx:50` opens it as `placement="right" size="full"`. The side panel the ticket asked about was never what shipped.

## 3. The accessibility contract

Four of the five items are supplied by the platform.

| Contract item | Supplied by | Notes |
| --- | --- | --- |
| Focus trap | `showModal()` | Browser applies `inert` to everything outside the dialog |
| Focus restored to the trigger on close | `showModal()` / `close()` | Spec'd; vendor agreement in [whatwg/html#5678](https://github.com/whatwg/html/issues/5678). Falls back to `body` if the trigger is no longer focusable |
| `Escape` to close | `showModal()` | Modal dialogs only |
| `aria-modal`, rest of page inert to AT | `showModal()` | Sets `aria-modal="true"` implicitly |
| Labelled | **Authored** | `aria-label` on the `<dialog>`; see §7 |
| Background scroll lock | **`overscroll-contain`** | See §4 |

**`<dialog open>` is not a substitute for `showModal()`.** Per [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog), a dialog opened via the `open` attribute is **non-modal**: `aria-modal="false"`, no inertness, no `Escape`, no top layer, no `::backdrop`. All four free items are gated behind the imperative call. This is why the component below is imperative — it is not a style preference.

Initial focus lands on the first focusable element inside the sheet, which is the close button. That is the correct target here, so **no `autofocus` is needed**. (Mayank's caveat about `autofocus` applies to dialogs with substantial text before the first control; a sheet whose first child is the close button does not have that problem.)

## 4. Scroll lock, and why it costs nothing here

A modal `<dialog>` does **not** lock background scrolling — Mayank demonstrates it with a screen recording. This is the only contract item the platform misses.

The usual remedies are all unpleasant. `html:has(dialog[open]:modal) { overflow: hidden }` is CSS-only but **does not reliably stop touch scrolling on iOS Safari**, which treats `<html>` and `<body>` as one scrollable unit; the reliable fix is `position: fixed` on the body plus saving and restoring `scrollTop`, which is JavaScript and state. Radix carries `react-remove-scroll` for exactly this.

**The sheet makes all of it unnecessary.** `dialog:modal` gets `overflow: auto` from the UA stylesheet, so the sheet scrolls its own content; `overscroll-behavior: contain` stops that scroll from chaining to the document ([94.13% global, iOS Safari 16+](https://caniuse.com/css-overscroll-behavior)). With an opaque sheet covering the viewport and chaining contained, a touch user has no surface that scrolls the page.

**Residual degradation, accepted:** a desktop wheel event over the sheet, once the sheet's own content is scrolled to its end, can still move the document behind it. It is invisible behind an opaque sheet and recoverable. This is the *entire* cost of declining the dependency.

## 5. Why not a dependency, and why not hand-rolled

**Hand-rolled from scratch is strictly dominated.** The focus trap is the expensive part and the part that is subtly wrong in most implementations — `Tab` wrapping, `Shift+Tab` at the first element, elements added after mount. Worse, the background cannot be made genuinely inert without the `inert` attribute, so the implementation reaches for the platform anyway, just less of it.

**A headless dependency (Base UI, Radix, react-aria) buys exactly one thing native does not**: iOS scroll lock done with care. §4 designed that requirement away. Against it: a dependency in a runtime stack pruned to five packages, and these libraries assume a client-heavy app while this site is fully prerendered with zero remote data. I could not obtain a hard gzip figure — bundlephobia returned no package data — so none is quoted; [mui/base-ui#3688](https://github.com/mui/base-ui/issues/3688) puts Base UI roughly 10 KB gzip under Radix, which places a single dialog primitive in the low tens of KB. On a page whose font payload was fought from 293 KB down to **92.8 KB preloaded**, that is not noise.

This follows the precedent from [the dependency verdicts](https://github.com/viniciusoliveiras/portfolio/issues/4) — hand-rolling the typewriter rather than carrying `typewriter-effect` for ~25 lines — with more force, because here the platform does the hard part instead of us.

## 6. The prerender trap that would have shipped

**This is the finding most likely to be lost in implementation.** The UA stylesheet's *only* mechanism for hiding a closed dialog is:

```css
dialog:not([open]) { display: none; }
```

Set `display: flex` or `grid` on the `<dialog>` for layout and that rule is overridden, and the dialog **no longer stays hidden when closed**. A full-bleed sheet stacking seven anchors above a language switcher wants column layout on exactly that element.

Under prerendering there is no `open` attribute and no JavaScript has run, so the failure is **not a flash on hydration** — it is seven nav links sitting in the page on first paint, on every mobile visit, until hydration removes them. The ticket asked whether the sheet would flash open on hydration; the real hazard is the opposite direction and it is a CSS specificity bug, not a timing one.

**Resolution: bind display to the open state.** Compiled and confirmed:

```css
.open\:flex:is([open], :popover-open, :open) { display: flex; }
```

Specificity `0,2,0` (`:is()` takes its most specific argument, `[open]`), so it beats a bare `.flex` at `0,1,0`, and the closed state falls through to the UA rule. `showModal()` sets the `open` attribute, so the variant tracks the real state.

The rejected alternative was putting `flex flex-col` on an inner wrapper and leaving the dialog's `display` untouched. It costs one element that exists only for layout, and it is **not** more robust — neither option survives a future editor adding a bare `flex` to the dialog. Element count decided it.

**`open:flex` is load-bearing and must carry a comment saying so**, or it reads as a stylistic choice and the next person "simplifies" it to `flex`.

## 7. The component

No React state. `onClick` handlers call the DOM directly.

```tsx
const ref = useRef<HTMLDialogElement>(null)

<button
  type="button"
  onClick={() => ref.current?.showModal()}
  aria-label={messages.nav.openMenu}
>
  <MenuIcon aria-hidden />
</button>

{/* `open:flex` is load-bearing, not styling: an unconditional `display`
    overrides the UA rule `dialog:not([open]) { display: none }`, and the
    sheet renders visible in the prerendered HTML. See §6. */}
<dialog
  ref={ref}
  aria-label={messages.nav.menuLabel}
  className="
    inset-0 h-dvh w-full max-w-none max-h-none
    bg-paper text-ink
    open:flex flex-col
    overscroll-contain
    opacity-0 open:opacity-100 starting:open:opacity-0
    transition-[opacity,display,overlay] duration-200 transition-discrete
    motion-reduce:duration-0
    backdrop:bg-transparent
  "
>
  <button type="button" onClick={() => ref.current?.close()}>…</button>
  {/* seven anchors, each with onClick={() => ref.current?.close()} */}
  {/* language switcher */}
</dialog>
```

### Why uncontrolled

The **controlled** shape — `useState` plus an effect calling `showModal()`/`close()` — is what most React-`<dialog>` write-ups reach for, and it has a mandatory extra part: `Escape` closes through the platform without telling React, so a `close` event listener must push the DOM state back into `useState` or the two desync and the next button press does nothing. That desync is the single most common `<dialog>`-in-React bug.

The usual reason to keep state is so the trigger can reflect it — swap the hamburger for an X, set `aria-expanded`. **The sheet makes that impossible and pointless**: `showModal()` puts the sheet in the top layer covering the bar and the menu button, and marks the button `inert`. A state the user cannot see and a screen reader cannot reach is not worth modelling. The close affordance lives inside the sheet.

Consequence worth stating plainly: **this decision adds no client state to a static site.** The design brief's Consequences section anticipated "a small amount of client state (drawer open/closed)"; with the imperative `<dialog>` the amount is zero, and the brief's conclusion that the site stays static and prerenderable holds a fortiori.

### Every anchor calls `close()`

Clicking `#experience` inside the sheet does not dismiss a dialog. Without `close()` on each anchor, the visitor jumps to the section and stares at the sheet still covering it.

### One accepted wart

`close()` restores focus to the trigger, and native hash navigation only scrolls — it does not move focus. So a keyboard user who picks "Experience" from the sheet lands visually at the section but with focus back on the menu button in the bar. Fixing it means imperative focus management on the target heading, which is more machinery than the wart costs. **Accepted, not overlooked.**

## 8. The class list, verified line by line

Compiled with the standalone Tailwind 4.3.3 CLI against a `@theme` carrying `paper`, `ink` and `rule-strong`.

| Class | Compiles to | Why |
| --- | --- | --- |
| `inset-0` | `inset: 0px` | Positions the fixed box; do not rely on the UA `:modal` insets |
| `h-dvh w-full` | `height: 100dvh; width: 100%` | **Required** — see the UA note below |
| `max-w-none max-h-none` | `max-width: none; max-height: none` | **Required** — `dialog:modal` caps both at `calc(100% - 6px - 2em)` |
| `bg-paper text-ink` | `var(--color-paper)` / `var(--color-ink)` | **Required** — the UA sets `background-color: Canvas; color: CanvasText`, which ignore the palette entirely |
| `open:flex flex-col` | `.open\:flex:is([open], :popover-open, :open)` | §6 |
| `overscroll-contain` | `overscroll-behavior: contain` | §4 |
| `opacity-0 open:opacity-100` | `0%` / `100%` at `0,2,0` | Fade end states |
| `starting:open:opacity-0` | `@starting-style { …:is([open]…) }` | Without it there is no "before" value, because the element was `display: none`, and the transition never runs |
| `transition-[opacity,display,overlay]` | `transition-property: opacity,display,overlay` | `display` keeps the sheet rendered through the exit; `overlay` defers removal from the top layer |
| `transition-discrete` | `transition-behavior: allow-discrete` | Required for `display` and `overlay`, which are discrete |
| `duration-200` | `200ms` | Emitted after the `transition-*` rule, so it wins |
| `motion-reduce:duration-0` | `0ms` inside `@media (prefers-reduced-motion: reduce)` | Emitted last, so it wins. Satisfies the brief's "drops the drawer transition to 0ms" |
| `backdrop:bg-transparent` | `.backdrop\:bg-transparent::backdrop` | The spec's UA rule is `dialog::backdrop { background: rgba(0,0,0,0.1) }` — a faint wash that would tint the cross-fade |

### Three classes the ticket's framing included and the compile deleted

- **`m-0 p-0 border-0` are redundant.** Tailwind's Preflight already sets `margin: 0; padding: 0; border: 0 solid` on `*, ::after, ::before, ::backdrop, ::file-selector-button`, and author-origin rules beat the UA origin regardless of specificity — so the UA's `margin: auto; border: solid; padding: 1em` is already gone before these classes are considered.
- **`w-dvw` is wrong; use `w-full`.** `100dvw` includes the scrollbar width and would cause horizontal overflow.

### And one the UA stylesheet forced back in

Explicit sizing is **not** optional. The HTML Standard's rendering section gives `dialog` `width: fit-content; height: fit-content`, and **Preflight does not reset those**. `inset: 0` alone therefore does *not* stretch the box — `fit-content` wins. Full-bleed requires `h-dvh w-full` (or `size-full`). `dvh` over `100%` because it tracks iOS's dynamic toolbars, which matters on a mobile-only primitive.

The relevant UA declarations, quoted from [the spec](https://html.spec.whatwg.org/multipage/rendering.html):

```css
dialog:not([open]) { display: none; }
dialog {
  position: absolute; inset-inline-start: 0; inset-inline-end: 0;
  width: fit-content; height: fit-content; margin: auto;
  border: solid; padding: 1em;
  background-color: Canvas; color: CanvasText;
}
dialog:modal {
  position: fixed; overflow: auto; inset-block: 0;
  max-width: calc(100% - 6px - 2em); max-height: calc(100% - 6px - 2em);
}
dialog::backdrop { background: rgba(0,0,0,0.1); }
```

## 9. Motion: fade, not slide

The brief budgets "Drawer open / close — 200ms" without saying what moves. **It fades.**

A **slide from the right** would match today's `placement="right"` and would explain where the sheet came from, but mid-transition the sheet's left edge becomes a hard vertical boundary against the live page — which resurrects the `rule-strong` edge for 200ms and no longer, an absurd thing to specify. A side-sliding drawer is also the iOS app idiom, and the token layer already flagged drift toward UI conventions as a signal worth watching. A **fade** is the print idiom: one spread cross-fading into another, with no edge at any point.

`@starting-style` is [88.82% global](https://caniuse.com/mdn-css_at-rules_starting-style) (Chrome 117+, Firefox 129+, Safari 17.5+) and `transition-behavior` [88.88%](https://caniuse.com/mdn-css_properties_transition-behavior) (Safari 17.4+). Below those the sheet appears and disappears instantly, which is the reduced-motion behaviour anyway — a clean degradation, no fallback needed.

**All variants used are stock**: `open:`, `starting:`, `motion-reduce:`, `backdrop:`, and `transition-discrete`. ADR-0002's "no custom variants at all" holds unchanged.

## 10. What this hands to other tickets

- **[Prototype the seven sections](https://github.com/viniciusoliveiras/portfolio/issues/17)** — unblocked by this decision. It owns what the seven anchors and the language switcher *look like* stacked inside the sheet; this document owns only the primitive's contract. It also inherits the sheet's header row: the name plus the close button, positioned so the menu button and the close button do not appear to jump.
- **[Author the site copy](https://github.com/viniciusoliveiras/portfolio/issues/14)** — **two new keys**, `nav.openMenu` (the trigger's `aria-label`) and `nav.menuLabel` (the sheet's), in both locales. They are copy, so they belong in `src/content/{pt,en}.ts` per [the message-module decision](https://github.com/viniciusoliveiras/portfolio/issues/20), not hardcoded in the component.
- **[Decide what animates, and with what](https://github.com/viniciusoliveiras/portfolio/issues/11)** — its surface shrinks to the 150ms hover. The 200ms drawer entry in the brief's motion inventory is fully specified here, CSS-only, no library.
- **[The Tailwind token layer](https://github.com/viniciusoliveiras/portfolio/issues/16)** — one reword. Its note that "the drawer's edge uses `rule-strong`" has no referent on a full-bleed sheet. The token keeps its job on a different edge: **the rule beneath the sheet's own header row**, which bounds an interactive surface and still needs 3:1.

## 11. One thing found in passing

`useBreakpointValue` cannot survive prerendering. `src/components/Header/index.tsx:20` picks the mobile or desktop nav with a JS media query, which bakes one branch into the static HTML and mismatches on hydration for every visitor on the other side of the breakpoint. It must become CSS visibility, which means **both navs ship in the prerendered HTML** with `md:` hiding one. There is no id collision — the anchor ids live on the sections, not the links — but the four bar anchors and the seven sheet anchors are in the DOM simultaneously, and the hidden one must be hidden with `display: none` so assistive technology does not reach it.

*(Environment note, not part of the decision: the local machine currently has no working package manager — nvm's `lib/node_modules` is empty, so the `npm`, `pnpm`, `yarn` and `corepack` shims in `bin/` are all dangling symlinks, and the standalone pnpm at `~/.local/share/pnpm/bin/pnpm` points at a missing binary. The verification above used the standalone Tailwind CLI downloaded directly. This is a live instance of exactly the bootstrap fragility [ADR-0003](../adr/0003-package-manager-and-node-baseline.md) argues about, and worth remembering when the migration is actually executed.)*
