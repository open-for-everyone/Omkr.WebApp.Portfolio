# Omkr Web App Portfolio

The personal portfolio at **[keshavsingh.in](https://keshavsingh.in)** — an Angular front end whose
content is served from a database rather than compiled into the bundle.

![Preview](./src/assets/images/keshav-singh-portfolio-preview.png)

---

## Contents

1. [What makes this different](#1-what-makes-this-different)
2. [Tech stack](#2-tech-stack)
3. [Getting started](#3-getting-started)
4. [Scripts](#4-scripts)
5. [Architecture](#5-architecture)
6. [Theming](#6-theming)
7. [Accessibility](#7-accessibility)
8. [Features](#8-features)
9. [SEO, sitemap and robots](#9-seo-sitemap-and-robots)
10. [Deployment](#10-deployment)
11. [Contributing](#11-contributing)
12. [License](#12-license)

---

## 1. What makes this different

Almost nothing a visitor reads is in this repository. Section headings, the about copy, the
experience timeline, the skill groups, the navigation labels, the social links, the contact details
and the CV are all published from the sibling **admin** app and fetched at runtime — per language.
Changing a job title is a database edit, not a deploy.

The project list goes further: it reads public repositories straight from the GitHub API and merges
them behind whatever projects an admin has curated.

Every one of those reads has a compiled-in fallback, so the site renders correctly before the API
answers and keeps working if it never does.

**→ [`docs/content-keys.md`](docs/content-keys.md) is the reference: what is editable, where, and the
exact JSON to paste in.**

## 2. Tech stack

| Layer | Choice |
|---|---|
| Framework | Angular 22 (NgModule, not standalone) |
| UI | Angular Material + Bootstrap 5 grid + Font Awesome |
| Styling | Plain CSS with a design-token layer in `src/styles.css`; `theme.scss` for Material |
| i18n | `@ngx-translate/core` 18, fed from the admin API |
| Shared config | `@keshavsingh3197/web-config` (private package) |
| Auth | Azure AD B2C via MSAL — wired but no route is guarded yet |
| PDF | `pdfmake`, dynamically imported |
| Tests | Karma + Jasmine |
| Hosting | GitHub Pages, custom domain via `CNAME` |

Part of a family of sibling apps — see `/mnt/d/GITHUB/AGENTS.md` for the wider layout. The admin app
is the identity provider and the content store for all of them.

## 3. Getting started

Prerequisites: Node 20+, and a `PACKAGES_READ_TOKEN` with `read:packages` in your environment (the
`@keshavsingh3197/*` packages come from GitHub Packages).

```bash
npm ci
npm start          # http://localhost:4200
```

The site talks to `https://id.keshavsingh.in/api` by default, so it has real content in local
development. Point `idpApiBaseUrl` and `contactApiBaseUrl` in `src/environments/environment.ts` at
`http://localhost:5000` to run against a local admin API.

> `src/environments/environment.ts` is the **only** environment file. `angular.json` declares no
> `fileReplacements`, so every configuration reads it — there is no separate production file, and
> its `production` flag is therefore meaningless. Use `isDevMode()` from `@angular/core` for
> build-dependent behaviour.

## 4. Scripts

| Script | What it does |
|---|---|
| `npm start` | Dev server with live reload |
| `npm run build` | Regenerates the sitemap, then builds for production |
| `npm run sitemap` | Regenerates `src/sitemap.xml` from the route table |
| `npm test` | Karma + Jasmine |
| `npm run lint` | ESLint, including template accessibility rules |
| `npm run watch` | Development build in watch mode |

Run a single spec:

```bash
npx ng test --include src/app/services/content/profile.service.spec.ts
```

Do not skip the sitemap step in automation — `src/sitemap.xml` is a build artifact, and CI runs
`npm run sitemap` before `ng build`.

## 5. Architecture

```text
src/app/
  components/
    general/            # header, footer, legal, resume, 404, chat, palette, consent
    home/               # banner, about, skills, experience, projects, blog, contact
  models/content/       # content shapes + the compiled-in defaults
  services/
    content/            # the content layer (see below)
    general/            # SEO, i18n, runtime config, display preferences, icons
    auth/ chat/ message/ resume/ Analytics/ PageView/
  directives/ pipes/
tools/generate-sitemap.mjs
docs/content-keys.md
```

### The content layer

Three sources, chosen by what kind of thing the content is:

| Kind | Read by | Edited in |
|---|---|---|
| Structured text — lists, objects | `StructuredContentService` (via the ngx-translate store) | admin → Website content |
| Site data — URLs, handles, numbers | `SiteContentService` | admin → Website content |
| Single strings | `| translate` | admin → Localization |
| Cross-app config, feature flags | `RuntimeConfigService` | admin → Configuration |

`ApiTranslateLoader` merges three layers into the translate store, later winning: the bundled
`assets/i18n/<lang>.json` as an offline base, then per-locale structured blocks, then the flat
translation bundle. `PortfolioContentService` exposes the result as typed, validated streams.

Content arrives from a database that several people can edit, so it is treated as untrusted input:
every entry is validated, invalid entries are dropped, icon names and URL schemes are allowlisted,
and a block that is entirely unusable falls back to its default rather than rendering broken.

### Offline defaults

`src/assets/i18n/en.json` holds **scalars**; `src/app/models/content/site-content.defaults.ts` holds
**structured content**. Each piece of offline content lives in exactly one of the two — they used to
overlap and disagree.

## 6. Theming

Three themes, all driven from the token block at the top of `src/styles.css` and nothing else:

| Theme | Selector |
|---|---|
| Dark (default) | `:root` |
| Light | `body.light` |
| High contrast | `body.high-contrast` — composes on top of either |

Plus `body.reduce-motion` for the in-app reduced-motion toggle. All four are owned by
`DisplayPreferencesService`, persisted in `localStorage`, and default to the operating system's
preference when unset.

The tokens are a spacing scale, a radius scale, elevation, semantic colours and typography, shaped to
match the admin app's system so the two read as one family.

**Never hard-code a colour in a component.** Doing so breaks at least one of the three themes — which
is exactly how the hero headline ended up invisible in light mode and the project dialog unreadable.
Use `var(--accent)`, `var(--text-strong)`, `var(--on-accent)` and friends.

## 7. Accessibility

- Skip link as the first tab stop; exactly one `<main>` and one `<h1>` per view
- Semantic lists for card grids and the timeline, so counts are announced
- `aria-current` on the active nav item; `aria-pressed` on every toggle
- Focus-visible outlines from a single `--focus-ring` token; focus trap and restore in the command palette
- Live regions: `polite` for status, `assertive` only for form error summaries
- Reduced motion respected both from the OS and from the in-app toggle — including the hero's typing
  animation, which stops rather than looping
- Template accessibility rules enforced by `npm run lint`

## 8. Features

- **Live GitHub projects** — public repos, filtered and pinned from the admin, cached for 30 minutes
  in session storage because the unauthenticated GitHub API allows 60 requests per hour per visitor
- **Blog feed** — posts from the sibling `content-blog` site; hides itself if that origin is unreachable
- **CV download** — a real PDF built with `pdfmake`, from the same data the `/resume` page renders
- **Printable resume** at `/resume`, with print styles that drop all site chrome
- **Command palette** (`Ctrl`/`Cmd` + `K`) with full keyboard semantics
- **Visitor chat** — a real conversation landing in the admin's inbox, not a bot
- **Cookie consent** gating analytics and geolocation, reopenable from the footer
- **Language picker**, shown only when more than one language is enabled
- **Contact form** posting to the admin's Contact inbox

## 9. SEO, sitemap and robots

Titles, descriptions and canonical URLs come from route `data` and are applied centrally by
`AppRoutingModule` through `SeoService`. Do not touch `<head>` anywhere else, and do not add a route
without `data` — the meta tags and the sitemap both depend on it.

`tools/generate-sitemap.mjs` scrapes `path: '...'` literals out of `app-routing.module.ts`, so a route
declared any other way will silently be missing from `sitemap.xml`.

## 10. Deployment

Push to `main` runs `.github/workflows/deploy-pages.yml`: install → sitemap → build with the Pages
base href → write `CNAME` → copy `index.html` to `404.html` for SPA routing → `.nojekyll` → deploy.

This repository is owned by `open-for-everyone` while the packages are owned by `keshavsingh3197`,
and `GITHUB_TOKEN` cannot read another owner's packages — so the **`PACKAGES_READ_TOKEN` secret is
required**, with no fallback. `firebase.json` is an alternate static-hosting config, not what deploys.

## 11. Contributing

Branches `feat/`, `fix/`, `chore/`, `docs/`; conventional commits (`feat(resume): …`). Run
`npm run lint` and `npm test` before opening a PR against `main`.

Conventions for theming, accessibility, print and component structure are in
[`docs/development-guidelines.md`](docs/development-guidelines.md).

## 12. License

MIT — see [LICENSE](LICENSE).
