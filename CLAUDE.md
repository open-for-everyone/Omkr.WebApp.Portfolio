# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`/mnt/d/GITHUB/CLAUDE.md` covers the sibling-repo family this app belongs to (private packages, the
shared identity provider, release order). This file is about this repo only.

## Commands

```bash
npm ci                 # needs PACKAGES_READ_TOKEN in the env (see below)
npm start              # ng serve → :4200 (development configuration)
npm run build          # runs `npm run sitemap` FIRST, then `ng build` (production is the default config)
npm run sitemap        # regenerate src/sitemap.xml from app-routing.module.ts
npm test               # karma + jasmine (@angular/build:karma) — the only runner
npm run lint           # @angular-eslint; the only frontend in the family with a lint script
npx ng test --include src/app/services/content/profile.service.spec.ts   # single spec
```

Never bypass the sitemap step in build automation — `src/sitemap.xml` is a build asset and CI runs
`npm run sitemap` explicitly before `ng build`.

**WSL — you CAN build and test here.** `node` is not on PATH and the Windows `npm`/`npx` shims under
`/mnt/c` fail with `exec: node: Permission denied`, but **`node.exe` invoked by absolute path works**,
so the whole toolchain is reachable:

```bash
NODE="/mnt/c/Program Files/nodejs/node.exe"
export CHROME_BIN="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"

"$NODE" tools/generate-sitemap.mjs                                             # sitemap
"$NODE" node_modules/@angular/cli/bin/ng.js build --configuration production    # build (~15s)
"$NODE" node_modules/@angular/cli/bin/ng.js lint                                # lint
"$NODE" node_modules/@angular/cli/bin/ng.js test --browsers ChromeHeadless --watch false
"$NODE" node_modules/typescript/lib/tsc.js -p tsconfig.app.json --noEmit        # types only
```

The interop maps `/mnt/d/...` to `D:\...` and karma's headless Chrome connects back over WSL2
localhost forwarding. **Verify your changes** — do not claim something builds without running it.
(Note `tsconfig.app.json` excludes specs, so only the test build type-checks them.)

The container-level `/mnt/d/GITHUB/CLAUDE.md` still says frontend work cannot be verified here. That
is out of date, and applies to the other four Angular apps in the family too.

## Private package access

`@keshavsingh3197/web-config` comes from GitHub Packages. `.npmrc` reads `${PACKAGES_READ_TOKEN}`
(needs `read:packages`). This repo is owned by **`open-for-everyone`** while the package is owned by
`keshavsingh3197`, so `GITHUB_TOKEN` cannot read it — the `PACKAGES_READ_TOKEN` **secret is
mandatory** in CI, unlike the sibling repos which have a fallback. Before the package's first
publish, `tsconfig.json` `paths` falls back to `../KeshavSingh-Packages-Web/dist`; run `npm run
build` once in that checkout.

## Deployment

`.github/workflows/deploy-pages.yml` on push to `main`: `npm ci` → sitemap → `ng build --base-href`
→ write `CNAME` (`keshavsingh.in`) → copy `index.html` to `404.html` for SPA routing → `.nojekyll` →
GitHub Pages. `firebase.json` exists as an alternate static-hosting config but is not what deploys.

## Architecture

**Single eager NgModule.** `AppModule` declares every component; there are no lazy routes and no
standalone components (`standalone: false` is explicit). Adding a component means adding it to the
`declarations` array.

**Content is served, not compiled.** The distinguishing trait of this app: essentially all
user-visible text and data comes from the identity provider API at `environment.idpApiBaseUrl`
(`https://id.keshavsingh.in/api`) at runtime, so copy changes are database edits in the admin app
rather than deploys. Three mechanisms, chosen by what kind of thing the content is:

| Kind | Read through | Edited in |
|---|---|---|
| Structured text (lists, objects) | `StructuredContentService`, via the ngx-translate store | admin → Website content, one row per language |
| Site data (URLs, handles, numbers) | `SiteContentService` → `ProfileService` | admin → Website content |
| Single strings | the `\| translate` pipe | admin → Localization |
| Cross-app config, feature flags | `RuntimeConfigService` | admin → Configuration |

`PortfolioContentService` is the façade components inject: `skills$`, `experience$`, `nav$`,
`projects$`, `aboutParagraphs$`, `curatedProjects$`. `ApiTranslateLoader` merges three layers into
the translate store, later winning: bundled `assets/i18n/{lang}.json` (offline base) → per-locale
structured blocks (`about`, `experience`, `skills`, `projects`, `navigation`) → the flat bundle
`/i18n/bundle/{lang}?ns=portfolio,common,brand`. It strips the namespace prefix, so templates ask for
`Header.Item1`, not `portfolio.Header.Item1`.

**Content is a trust boundary.** It comes from a database several people can edit. Every entry is
validated and unusable ones are dropped; icon names go through `IconRegistryService`'s allowlist and
URL schemes are limited to `http`/`https`/`mailto`/`tel`; a wholly invalid block falls back to its
compiled-in default. Nothing in the content layer rejects — a content outage costs content, not the
page. `ProfileService` + `profile.service.spec.ts` are the reference.

**A missing translation key resolves to the key string**, so `*ngFor` over `'X.Items' | translate`
renders one row per character. Use `StructuredContentService.mapList`/`.textList` for anything that
is not a single string. The pipe is fine for scalars.

**Offline defaults are split, deliberately.** `assets/i18n/en.json` holds **scalars only**;
`src/app/models/content/site-content.defaults.ts` holds **structured content**. Never put the same
value in both — they used to overlap and disagree (`en.json` had three jobs, the component had four,
and whichever loaded last won).

**The admin API is also the backend for interactive features** (`environment.contactApiBaseUrl` =
`https://id.keshavsingh.in`): `ContactService` → `/api/contact`, `PageViewService` →
`/api/analytics/visit`, `ChatService` polls `/api/visitor-chat` (a real human in the admin queue, not
a bot). `GithubService` reads public repos from `api.github.com` — unauthenticated, 60 req/hour per
visitor IP, so responses are cached in `sessionStorage` for 30 minutes. `BlogFeedService` reads the
sibling blog's `structure.json`; that file has **no publish dates**, so the section is titled "From
the blog" rather than claiming recency.

**Navigation is router-driven.** Section links point at `/` with a **fragment**; `anchorScrolling` is
enabled in `RouterModule.forRoot` with a `scrollOffset` clearing the toolbar. This is what makes them
work from any route. Header, progress bar and footer live in `AppComponent`, so every route has
navigation — do not add them to a page component.

**SEO is centralised in routing.** Each route carries `data: { title, description }`; the
`AppRoutingModule` constructor subscribes to `NavigationEnd` and calls `SeoService.update()` with a
canonical URL. Never touch `<head>` elsewhere, and never add a route without `data` — the meta tags
and the sitemap both depend on it.

**Sitemap generation is a regex over the routing module.** `tools/generate-sitemap.mjs` scrapes
`path:\s*'...'` literals, skipping `**`, `404`, and `.txt`/`.xml` redirects. Routes declared any
other way silently will not appear.

**Auth is a working-but-dormant Azure AD B2C skeleton.** MSAL is initialised via `APP_INITIALIZER`
and `MsalInterceptor` is registered globally, but no route uses `MsalGuard`. `SessionService` layers
a *client-side* absolute 30-minute cap plus an inactivity dialog on top of B2C's own token lifetimes.

## Theming — the one hard rule

**No colour literals in component CSS.** Every colour, space, radius and shadow is a token defined
once at the top of `src/styles.css`. Three themes plus a motion modifier, all from that block:
`:root` (dark), `body.light`, `body.high-contrast` (composes on top of either), `body.reduce-motion`.

`DisplayPreferencesService` owns all four, persists them, and defaults to the OS preference. Never
set a body class or touch `localStorage` for these directly.

Use `--on-accent`/`--on-primary` for text on an accent or primary fill — that is what keeps high
contrast readable. For an intermediate shade use `color-mix(in oklab, var(--accent) 20%, transparent)`.

```bash
# Should print nothing but var() fallbacks.
grep -rnE '#[0-9a-fA-F]{3,8}\b|rgba?\([0-9]' src/app --include=*.css | grep -v 'var(--'
```

## Traps

- **`environment.ts` is the only environment file.** `angular.json` declares no `fileReplacements`,
  so every configuration reads it and its `production` flag is `false` even in the deployed site.
  Use `isDevMode()` from `@angular/core` for build-dependent behaviour. (`environment.prod.ts` was
  dead and has been deleted.)
- **Site key inconsistency.** Everything uses `portfolio`, but the `resume` content key was seeded
  under `omkr-portfolio` before the naming settled. `SiteContentService` falls back to
  `LEGACY_SITE_KEY` for exactly this reason. Re-save that row under `portfolio` in the admin and both
  the constant and the fallback can go.
- **Docs elsewhere in the family may still say Angular 16.** This app is on `@angular/core ^22.1.1`
  with the esbuild `@angular/build` builders and TypeScript 6. Trust `package.json`/`angular.json`.
- Production budgets are 1.9 MB warn / 2.1 MB error initial, 6 KB / 10 KB per component style.
- `src/robots.txt`/`src/sitemap.xml` are duplicated under `src/assets/` for hosting flexibility; the
  generator only writes `src/sitemap.xml`.
- `environment.ts` still carries a committed `x-api-key` for a retired AWS API and an unused `aiChat`
  placeholder block. It ships to the browser — do not add real secrets.

## Testing and lint

Karma + Jasmine only. The suite is green (33 specs) and lint is clean — keep them that way.

`eslint.config.js` is a **flat config**. It replaced `.eslintrc.json`, which could not run at all:
the project is on ESLint 10, which dropped `.eslintrc.*` support, so `npm run lint` failed with
"Could not find config file" and none of the rules had been enforced for some time. The
`angular-eslint` umbrella package (which carries the shareable flat configs) is not a dependency, so
the rule sets are enumerated explicitly from each plugin's own metadata.

Four `@angular-eslint` "recommended" rules are deliberately off — `prefer-standalone`,
`prefer-inject`, `prefer-on-push-component-change-detection` and template `prefer-control-flow`. Each
disagrees with a deliberate choice here and would error on nearly every file while saying nothing
about correctness. Revisit them together if the app is migrated to standalone components.
 `src/testing/test-support.ts` provides the shared TestBed wiring (mocked HTTP,
stub router, no-op translations, animations off, MSAL stubs) — use it rather than assembling
providers per spec. The original CLI scaffolds declared a component and nothing else and failed with
`NullInjectorError`; `app.component.spec.ts` additionally asserted a title the component never had.

For pure logic, instantiate the class directly with a stub collaborator (`profile.service.spec.ts`).

## Conventions

- Selector prefix `app` (element kebab-case, directive camelCase) — enforced by ESLint.
- Subscriptions use `takeUntil(this.destroyed$)` with `ngOnDestroy`. No bare `setInterval`.
- Never mutate `document.body` styles from a component.
- Do not bind `*ngFor` to an allocating getter or an inline array literal — both create a new
  identity every change-detection pass. Compute into a field.
- Accessibility: one `<main>` and one `<h1>` per routed view, card grids and the timeline are real
  lists, `aria-current` on the active nav item, `aria-pressed` on toggles, `aria-live="polite"` for
  status and `assertive` only for error summaries, native elements before ARIA roles. Honour reduced
  motion from both the OS query and `body.reduce-motion`.
- `/resume` is the canonical print view; global `@media print` rules live at the bottom of
  `src/styles.css` and mark screen-only chrome `.no-print`.
- Branches `feat/`, `fix/`, `chore/`, `docs/`; conventional commits; PRs into `main`.

## Where things are documented

- [`docs/content-keys.md`](docs/content-keys.md) — every admin-editable key, with copy-pasteable JSON
- [`docs/development-guidelines.md`](docs/development-guidelines.md) — theming tokens, a11y, print,
  component and service conventions
- [`README.md`](README.md) — overview, scripts, features, deployment
