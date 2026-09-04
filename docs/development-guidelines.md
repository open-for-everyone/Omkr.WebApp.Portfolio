# Development Guidelines

These guidelines define conventions for extending and maintaining the project (theming, accessibility, print behaviour, components, and contributions). Follow them when adding new features—even if not explicitly requested.

---
## 1. Architecture Principles

- Keep components presentational where possible; push data / API concerns into services.
- Favor pure / stateless pipes and utility functions for formatting logic.
- Reuse existing models in `src/app/models/` before introducing new interfaces.
- Maintain separation by domain folder (e.g. `services/Analytics`, `components/home/*`).

## 2. Theming and design tokens

All colour, spacing, radius, elevation and typography values live in one token block at the top of
`src/styles.css`. There are three themes and one motion modifier, and they are all defined there:

| State | Selector | Notes |
|---|---|---|
| Dark | `:root` | The default |
| Light | `body.light` | |
| High contrast | `body.high-contrast` | Composes on top of light *or* dark |
| Reduced motion | `body.reduce-motion` | Set by the in-app toggle |

`DisplayPreferencesService` owns all four, persists them to `localStorage`, and falls back to the
operating system's `prefers-color-scheme` / `prefers-reduced-motion` when nothing is stored. Never
set a body class or read a theme key directly — go through the service.

### The one rule

**A component stylesheet must not contain a colour literal.** No hex, no `rgb()`, no `rgba()`. Use
the tokens.

This is not style pedantry; it is the single largest source of theme bugs this project has had. Real
examples, all fixed:

- The hero headline was a gradient starting at `#e6eef8`. Near-white text, invisible in light theme.
- The project dialog set `color: #e6eef8` on its title and a translucent-white background on its
  chips. Unreadable in light theme.
- The chat widget put `color: #fff` on the user's own message bubble, which sits on `--accent`. In
  high contrast the accent is yellow, so white-on-yellow.
- The 404 page had sixteen colour literals and no tokens at all, and rendered green-on-black in every
  theme.
- The cookie banner used `var(--text)`, which is not a token that exists, so its text colour silently
  fell through to whatever it inherited.

Available tokens, by group:

- **Surfaces** `--bg`, `--bg-elevated`, `--card`, `--glass`, `--glass-strong`, `--overlay`
- **Text** `--text-strong`, `--text-soft`, `--muted`, `--faint`
- **Borders** `--border`, `--border-strong`
- **Brand** `--accent`, `--accent-strong`, `--accent-soft`, `--primary`, `--primary-strong`,
  `--primary-soft`
- **On-fill text** `--on-accent`, `--on-primary` — use these for text on an accent or primary
  background; that is what makes high contrast work
- **Semantic** `--success`, `--danger`, `--warning`, `--info`, each with a `-soft` variant
- **Spacing** `--space-1` … `--space-9`
- **Radius** `--radius-sm|md|lg|xl|pill`
- **Elevation** `--shadow-sm|md|lg`
- **Type** `--font-family`, `--font-mono`
- **Interaction** `--focus-ring`, `--transition-fast`, `--transition-base`

Need a shade in between? `color-mix(in oklab, var(--accent) 20%, transparent)` — not a new literal.

Add a token only when a value is reused in at least two places, and add it to all three themes.

### Checking your work

```bash
# Should print nothing but var() fallbacks.
grep -rnE '#[0-9a-fA-F]{3,8}\b|rgba?\([0-9]' src/app --include=*.css | grep -v 'var(--'
```

Then look at the page in all three themes and with reduced motion on. The display menu in the header
toggles every one of them.

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
- One responsibility per service folder. If a service grows past ~400 lines, split it.
- Components never hold URLs and never hold content. Both come from a service.

### Content is untrusted input

Anything read from the content API is operator-authored data from a database that several people can
edit. Treat it as a trust boundary, not as a typed object you can rely on:

- Validate every entry and drop the ones that cannot render, rather than letting one bad row take out
  a section.
- Allowlist enumerated values. Icon names go through `IconRegistryService`; URL schemes are limited
  to `http`, `https`, `mailto`, `tel`.
- Fall back to the compiled-in default when a block is entirely unusable.
- Never let a read reject. A content outage should cost content, not the page.

`ProfileService` and `PortfolioContentService` are the reference implementations, and
`profile.service.spec.ts` covers the validation rules.

### A missing translation key is not an empty value

ngx-translate returns *the key itself* when it has no entry. So

```html
<!-- Wrong: renders one <p> per letter of "AboutMe.Paragraphs" when the key is missing -->
<p *ngFor="let text of 'AboutMe.Paragraphs' | translate"></p>
```

Read list- and object-valued keys through `StructuredContentService`, which validates the shape
first. The `| translate` pipe is for single strings only.

## 7. Testing

Karma + Jasmine, via `npm test`. There is no jest here — a `jest.config.cjs` existed for a while
without jest ever being installed, and has been removed.

- Specs are `<file>.spec.ts`, colocated with the source.
- `src/testing/test-support.ts` provides the common TestBed wiring: mocked HTTP, a stub router, no-op
  translations, animations disabled, and MSAL stubs. Use it rather than assembling providers per spec
  — the original scaffolds declared a component and nothing else, and failed with `NullInjectorError`.
- Pure logic is best tested by instantiating the class directly with a stub collaborator; see
  `profile.service.spec.ts`.
- Still worth covering: theme and high-contrast persistence, command palette keyboard navigation,
  contact form validation, and the GitHub/curated project merge.


## 8. Performance
- Add lazy route modules for large future feature areas (e.g. admin, analytics dashboard).
- Audit bundle size before adding heavy dependencies; prefer dynamic import for rarely used utilities.
- Optimize images (prefer WebP/AVIF) and supply explicit width/height to reduce layout shift.

## 9. Internationalization

Text comes from the admin API, not from this build. `assets/i18n/en.json` is only an offline base.

- Single strings go in the i18n bundle (admin → Localization), namespace `portfolio`.
- Lists and objects go in `website_content` (admin → Website content), one row per language.
- `assets/i18n/en.json` holds **scalars only**; `src/app/models/content/site-content.defaults.ts`
  holds **structured content**. Do not duplicate a value across both — they used to overlap and
  disagree, and whichever loaded last won.
- Adding a language is entirely an admin task. See `admin/docs/LOCALIZATION.md`.

Full reference, with copy-pasteable payloads: [`content-keys.md`](content-keys.md).

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
| Dark theme active when printing | The global `@media print` block forces a white page and black text outright; there are no `--print-*` tokens |
| High contrast | Maintain black/white output; accents optional but must meet 4.5:1 |
| Link URLs | External `http(s)` links print their URL after the text |
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
