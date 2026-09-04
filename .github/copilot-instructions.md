# AI agent instructions

Project-specific guidance. Mirror the patterns that are here; do not invent new architecture.

`CLAUDE.md` at the repo root carries the same guidance in more depth, and
[`../docs/content-keys.md`](../docs/content-keys.md) is the reference for anything content-related.

## 1. Build and tooling

- **Angular 22**, classic NgModule (`standalone: false` on every component), esbuild
  `@angular/build` builders, TypeScript 6, strict mode. Entry `src/main.ts`, root module
  `AppModule`.
- `npm run build` runs `npm run sitemap` **first** and then `ng build`. Do not bypass the sitemap
  step: `src/sitemap.xml` is a build artifact.
- `npm test` is **Karma + Jasmine**. There is no jest — a config existed for a while without the
  dependency ever being installed, and has been removed.
- `npm run lint` includes `@angular-eslint` template accessibility rules.
- Production budgets: 1.9 MB warn / 2.1 MB error initial, 6 KB / 10 KB per component stylesheet.
- `src/environments/environment.ts` is the **only** environment file — `angular.json` declares no
  `fileReplacements`, so its `production` flag reads `false` in the deployed site too. Use
  `isDevMode()` from `@angular/core` for build-dependent behaviour.

## 2. Content is not in this repository

The defining trait of this codebase. Section headings, about copy, the experience timeline, skill
groups, navigation labels, social links, contact details and the CV all come from the sibling admin
app at runtime, per language.

**Do not add a hardcoded user-facing string, URL, phone number or list to a component.** Add it to
the content layer and give it a default:

| Kind | Read through | Default lives in |
|---|---|---|
| Lists and objects of text | `StructuredContentService` | `models/content/site-content.defaults.ts` |
| URLs, handles, numbers | `SiteContentService` / `ProfileService` | same |
| Single strings | `\| translate` | `assets/i18n/en.json` |
| Cross-app config, feature flags | `RuntimeConfigService` | the call's `fallback` argument |

`assets/i18n/en.json` holds **scalars only**; `site-content.defaults.ts` holds **structured
content**. Never put the same value in both.

Content is untrusted input — it comes from a database several people can edit. Validate each entry,
drop the unusable ones, allowlist enumerated values (icons via `IconRegistryService`, URL schemes to
`http`/`https`/`mailto`/`tel`), and never let a read reject.

**A missing translation key resolves to the key string.** So `*ngFor` over
`'X.Items' | translate` renders one item per character. Use `StructuredContentService.mapList` /
`.textList` for anything that is not a single string.

## 3. Theming — the one hard rule

**No colour literals in component CSS.** No hex, no `rgb()`, no `rgba()`. Every colour, space,
radius and shadow is a token defined once at the top of `src/styles.css`.

There are three themes (`:root` dark, `body.light`, `body.high-contrast` composing on top of either)
plus `body.reduce-motion`. A literal breaks at least one of them — that is how the hero headline
became invisible in light mode and white-on-yellow appeared in high contrast.

Use `--on-accent` / `--on-primary` for text sitting on an accent or primary fill. Need an
intermediate shade? `color-mix(in oklab, var(--accent) 20%, transparent)`.

`DisplayPreferencesService` owns the theme, high-contrast and reduced-motion state. Never set a body
class or touch `localStorage` for these directly.

Check before committing:

```bash
grep -rnE '#[0-9a-fA-F]{3,8}\b|rgba?\([0-9]' src/app --include=*.css | grep -v 'var(--'
```

## 4. Navigation and routing

- Section links go to `/` with a **fragment**, and the router scrolls (`anchorScrolling` is enabled
  with a `scrollOffset` clearing the toolbar). Do not use `href="#section"` — it does nothing from
  any route other than home, and `router.navigate(['/home'])` hits the wildcard because home is `''`.
- Header, progress bar and footer are rendered by `AppComponent`, so every route has navigation. Do
  not add them to a page component.
- Every route needs `data: { title, description }` — `AppRoutingModule` feeds it to `SeoService`, and
  `tools/generate-sitemap.mjs` scrapes `path: '...'` literals out of the same file. A route declared
  any other way is missing from `sitemap.xml`.
- Never manipulate `<head>` outside `SeoService`.

## 5. Accessibility

Enforced partly by lint, mostly by convention:

- One `<main>` and one `<h1>` per view; skip link stays the first tab stop
- Card grids and the timeline are real lists (`<ul>` / `<ol>`), so counts are announced
- `aria-current` on the active nav item, `aria-pressed` on every toggle
- `aria-live="polite"` for status, `assertive` only for error summaries
- Native elements before ARIA roles; no `tabindex` on non-interactive elements
- Honour reduced motion from both the OS media query and `body.reduce-motion` — including looping
  animations like the hero's typing effect

## 6. Components and services

- Selector prefix `app`, element kebab-case, directive camelCase.
- New component: add it to `AppModule.declarations`.
- Subscriptions: `takeUntil(this.destroyed$)` with `ngOnDestroy`. Never leave a bare `setInterval` —
  one here ran forever after its component was destroyed.
- Never mutate `document.body` styles from a component. A 404 page did, without cleanup, and left
  the whole site unscrollable after navigating away.
- Do not bind a template `*ngFor` to a getter that allocates, or to an inline array literal — both
  produce a new identity on every change-detection pass. Compute into a field.
- Services own endpoint assembly from `environment` maps with `{placeholder}` substitution.
  Components never hold URLs.

## 7. Do not

- Commit secrets to `environment.ts` — it ships to the browser.
- Add a dependency without justification; prefer a dynamic import for anything large (`pdfmake` is
  the pattern).
- Load a third-party asset at runtime. A decorative GIF was pulled from giphy.com on every 404, before
  any cookie choice.
- Edit `src/sitemap.xml` by hand.

## 8. If unsure

Mirror the nearest existing service, model and component. Ask before changing architecture (state
management, routing strategy, standalone migration).
