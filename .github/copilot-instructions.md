# Copilot / AI Agent Project Instructions

Concise, project-specific guidance so an AI agent can contribute productively. Focus on existing patterns—do not invent new architecture.

## 1. Tech + Build Workflow
- Angular 16 app (classic NgModule; not yet migrated to full standalone). Entry: `src/main.ts`, root module: `AppModule` in `app.module.ts`.
- Build script chains sitemap generation: `npm run build` executes `npm run sitemap` (`tools/generate-sitemap.mjs`) then Angular production build (default configuration = production). Do not bypass the sitemap step in automation.
- Dev server: `npm start` (serves with `--configuration development`). Tests (currently Karma/Jasmine) via `npm test`; ESLint via `npm run lint` (rules configured through `@angular-eslint`).

## 2. Architecture Snapshot
- Components grouped under `components/{home,general,...}`; each feature subfolder (e.g. `home/*`, `general/*`). Keep new UI in the nearest coherent domain folder.
- Services grouped by domain under `services/*` (e.g. `services/PageView`, `services/visitor`). Each service owns a single responsibility and performs endpoint template replacement (placeholders like `{pageId}`, `{userName}`) using `environment.*` values.
- Models live under `models/` with domain subfolders (`models/PageView`, `models/admin/visitor`). Reuse existing interfaces before adding new ones.
- Theming and accessibility are cross-cutting: rely on CSS variables defined in `theme.scss` / `styles.css`; never hard‑code brand colors in components.

## 3. Key Cross-Cutting Patterns
- Endpoint Assembly: Build URLs using environment maps, then replace placeholders. Example (`PageViewService`): compute SHA-256 hash of path, substitute into URL before `http.post/get`. Follow this pattern instead of embedding full URLs.
- SEO Meta Updates: Use `SeoService.update()` to set title, description, keywords, og/twitter tags, and canonical link. Do not manually manipulate `<head>` elsewhere.
- Accessibility: Maintain single `<main>`, respect existing keyboard patterns (see `CommandPaletteComponent` for focus restore + arrow navigation). Provide focus-visible styles; prefer native elements over custom roles.
- Theme / High Contrast: State stored via body classes (`.light`, `.high-contrast`) and `localStorage` key `highContrast`. New styles should consume semantic tokens (e.g. `var(--bg)`, `var(--accent)`).
- Print Support: `/resume` route is the optimized print context; hide decorative elements using `.no-print`. Add print rules either locally in the component or near the global `@media print` block in `styles.css`.

## 4. When Adding Features
- Choose folder: UI -> `components/<area>/<feature>`; data / remote logic -> new service folder under `services/<Domain>`.
- Expose new domain model in `models/<Domain>`; name interfaces with nouns (`XDetail`, `XRequest`). Keep method names in services verb-based (`incrementPageView`, `getAll`).
- Update sitemap only if new route path is declared in `app-routing.module.ts`; build script will regenerate automatically.
- For external calls: declare base & endpoint templates in `environment.ts` first, then consume in a service (keeps mutation centralized).

## 5. Testing & Linting Expectations
- Place spec alongside implementation (`*.spec.ts`). Mirror existing simple console-based analytics tests (some services currently placeholders). If adding logic (e.g. transforming responses), add a focused unit test.
- Keep tests deterministic; mock HTTP via Angular testing utilities (HttpClientTestingModule) if needed.

## 6. Avoid / Do Not
- Do NOT commit secrets in `environment.*` files—use placeholders mirroring current style.
- Do NOT inline meta tags or canonical links manually—use `SeoService`.
- Do NOT hard-code full API URLs inside components; always go through a service + environment config.
- Do NOT introduce multiple `<h1>` per routed view or additional `<main>` landmarks.

## 7. Performance & Bundling
- Respect existing size budgets in `angular.json` (`initial` warn 1.3mb, error 1.6mb). If adding large deps, justify and consider dynamic import.
- Prefer lazy route modules for large future sections (admin/blog) but note current app uses a single eager module—align with roadmap if starting refactor.

## 8. Analytics / Telemetry Layer
- `AnalyticService` currently logs to console (stub). If implementing real tracking, keep the same method signatures and swap internals (e.g. integrate GA or custom endpoint) to avoid widespread changes.
- Page view & visitor tracking patterns (hashing path -> ID) should be preserved for privacy and stable identifiers.

## 9. SEO & i18n
- Add new user-visible strings with an eye toward future translation: either place directly in template now or pre-stage keys in `assets/i18n/en.json` using namespaced keys (`resume.section.skills`).
- When adding a route requiring meta updates, inject `SeoService` in that component and call `update()` in `ngOnInit`.

## 10. Contribution Conventions
- Branch names: `feat/`, `fix/`, `chore/`, `docs/` prefixes; conventional commits (`feat(resume): ...`).
- Keep PRs focused; avoid broad refactors unless explicitly scoped.

## 11. Quick Examples
- New service endpoint pattern:
```ts
this.apiUrl = `${environment.awsUserApiBaseUrl}/${environment.mapConfig.analytics}/${environment.pageViewApiEndpoints.pageView}`
  .replace('{pageId}', pageId);
return this.http.get<PageViewDetail>(this.apiUrl);
```
- SEO usage:
```ts
this.seo.update({ title: 'Resume – Name', description: 'Experience & skills.' });
```

## 12. If Unsure
Prefer mirroring existing service, model, and component patterns over inventing abstractions. Ask (or open an issue) before introducing architectural shifts (state management libs, routing strategy changes, etc.).

---
Provide feedback if any section is unclear or if additional patterns (routing strategy, auth integration roadmap, a11y test harness) should be documented.
