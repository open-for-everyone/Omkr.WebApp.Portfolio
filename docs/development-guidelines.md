# Development Guidelines

These guidelines define conventions for extending and maintaining the project (theming, accessibility, print behaviour, components, and contributions). Follow them when adding new features—even if not explicitly requested.

---
## 1. Architecture Principles

- Keep components presentational where possible; push data / API concerns into services.
- Favor pure / stateless pipes and utility functions for formatting logic.
- Reuse existing models in `src/app/models/` before introducing new interfaces.
- Maintain separation by domain folder (e.g. `services/Analytics`, `components/home/*`).

## 2. Theming

- Core CSS custom properties are defined on `:root` and modified by body classes: `.light`, `.high-contrast`.
- New components should use variables (`var(--bg)`, `var(--accent)`, `var(--text-strong)`) instead of hard-coded colors.
- Prefer semantic token usage (background vs accent) so theme toggles remain consistent.
- Add new variable tokens only if reused across at least 2 places.

### Light/Dark Mode

- Do not directly set background colors in components unless creating layered surfaces; otherwise inherit.
- When adding interactive elements, ensure focus-visible outline has sufficient contrast in both modes.

### High Contrast Mode

- Class: `body.high-contrast`.
- Avoid removing outlines or shadow cues; only amplify contrast.
- Any new critical icon-only control must supply accessible text (e.g., `aria-label`).

## 3. Accessibility (A11y)

- Only one `<main>` landmark per page; do not nest extra `main` tags.
- Use native elements before ARIA roles (e.g., `<button>` instead of clickable `<div>`).
- Provide keyboard operability for any interactive widget (Enter/Space for buttons, Arrow keys for listboxes, Esc to dismiss dialogs).
- Live regions: use `aria-live="polite"` for updating statuses, `aria-live="assertive"` only for error summaries.
- Maintain heading hierarchy: exactly one `<h1>` per route view (resume, legal pages, home).
- When creating new modal-like surfaces, integrate a focus trap and restore focus on close (follow command palette pattern).

## 4. Print Support

- Use the `/resume` route as the canonical print view. Avoid printing the multi-section homepage directly.
- Global print CSS lives at bottom of `src/styles.css` using theme-aware variables `--print-bg`, `--print-fg`.
 
 
- Before adding new always-visible elements, consider if they should be hidden in print (add a class `no-print`).
- Runtime print hooks add a `body.printing` class via `beforeprint` / `afterprint` events in `AppComponent`—extend this if advanced conditional styling is required.
- Prefer text alternatives to icons; icons may not render well on some grayscale printers.

 
 
### Adding a Print-Optimized Section

1. Provide a dedicated route if the section is primarily printable content.
2. Use semantic containers: `<article>`, `<section>` with `aria-labelledby`.
 
 
3. Avoid large colored backgrounds; rely on text hierarchy.
4. Use `page-break-inside: avoid;` for grouped elements (experience items, skill groups) if needed.

## 5. Component Conventions

 
 
- Component selectors: `app-feature-name`.
- Input names: camelCase, avoid abbreviations unless industry standard.
- Event outputs: past-tense or imperative? Use present-tense verbs (`saved`, `closed`) or `actionName` pattern (`didSave`, `didClose`)—be consistent within a component family.
- Avoid logic bloat in templates; push mapping / filtering into getters or component methods.

## 6. Services & API Calls

- Keep endpoint templates in environment files; replace placeholders (`{orgId}`, `{userName}`) at call time.
 
 
- Add a single responsibility per service folder. If a service grows beyond ~400 lines, split into logical sub-services.
- Handle errors centrally where possible and provide user-friendly messages via a toast/snackbar (future enhancement).

## 7. Testing (Future Reintroduction)

- Accessibility smoke tests: Prefer Playwright + axe-core (simulate real browser) instead of pure jsdom.
- Unit test naming: `<file>.spec.ts` colocated with source.
- Critical flows to cover: theme toggle persistence, high-contrast toggle, command palette keyboard navigation, contact form validation.
 
 

## 8. Performance
- Add lazy route modules for large future feature areas (e.g. admin, analytics dashboard).
- Audit bundle size before adding heavy dependencies; prefer dynamic import for rarely used utilities.
- Optimize images (prefer WebP/AVIF) and supply explicit width/height to reduce layout shift.

## 9. Internationalization
- All user-facing strings should move progressively into translation files (`assets/i18n/en.json`).
- When adding new dynamic strings, design keys with namespace-like grouping: `resume.header.tagline`.
- Update `<html lang>` when implementing language switching.

## 10. Security & Secrets
- Never commit real API keys—use placeholder values in `environment.ts` committed to source.
- For production builds, inject secrets via environment replacement or server config.
- Sanitize any future user-generated content before rendering (potential future blog/comments).

## 11. Contribution Workflow
1. Branch naming: `feat/`, `fix/`, `chore/`, `docs/` prefixes.
2. Conventional commit messages: `feat(resume): add print styling hook`.
3. Run `npm run lint` before pushing.
4. Keep PRs focused; avoid unrelated refactors in feature branches.

## 12. Adding New Visual Features Checklist
Before merging:
- [ ] Uses theme variables only (no hard-coded brand colors)
- [ ] Keyboard accessible & focus visible
- [ ] Responsive at 320px, 768px, 1024px breakpoints
- [ ] Does not introduce duplicate `<h1>`
- [ ] Print visibility considered (hidden if decorative)
- [ ] Strings externalized or earmarked for i18n
- [ ] No large dependencies added without justification

## 13. Print / Theme Quick Reference
| Concern | Guideline |
|---------|-----------|
| Dark theme active when printing | Force light tokens via `--print-bg`, `--print-fg` for legibility |
| High contrast | Maintain black/white output; accents optional but must meet 4.5:1 |
| Link URLs | Shown automatically; suppress by adding `body[data-no-print-urls]` |
| Animations | Disabled in print automatically |
| Non-essential UI | Add `.no-print` or use existing global exclusions |

## 14. Future Improvements (Tracked)
- Introduce a centralized ThemeService for subscription-based theme changes.
- Provide a generic FocusTrap directive for dialogs/overlays.
- Add Playwright test harness for a11y + visual regression (optional Percy).
- Introduce automatic changelog generation (Conventional Commits -> CHANGELOG.md).
- Add schematic or script for generating feature scaffolding with documented patterns.

---
Maintain consistency and iterate on these guidelines as the project matures. Propose changes via a `docs:` pull request.
