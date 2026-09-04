// @ts-check
import ngPlugin from '@angular-eslint/eslint-plugin';
import ngTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import templateParser from '@angular-eslint/template-parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

/**
 * ESLint flat configuration.
 *
 * This replaces `.eslintrc.json`, which could not run at all: the project is on ESLint 10, and
 * ESLint dropped `.eslintrc.*` support in v9. `npm run lint` failed with "Could not find config
 * file" rather than linting anything, so none of these rules had been enforced for some time.
 *
 * Written against the plugins already installed — `angular-eslint` (the umbrella package that
 * carries the shareable flat configs) is not a dependency here, and the individual
 * `@angular-eslint/*` plugins export only their rules. So the rule sets below are enumerated from
 * each plugin's own `meta.docs.recommended` metadata rather than extended from a preset.
 */

/** Files that are generated or vendored. */
const ignores = [
  'dist/**',
  'out-tsc/**',
  'coverage/**',
  'coverage-jest/**',
  '.angular/**',
  'node_modules/**',
  'projects/**',
];

export default [
  { ignores },

  // ----------------------------- TypeScript --------------------------------
  ...tsPlugin.configs['flat/recommended'].map((config) => ({
    ...config,
    files: ['src/**/*.ts'],
  })),

  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@angular-eslint': ngPlugin,
    },
    rules: {
      // Selector conventions, carried over from .eslintrc.json.
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],

      // Correctness rules from @angular-eslint's recommended set.
      '@angular-eslint/contextual-lifecycle': 'error',
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-inputs-metadata-property': 'error',
      '@angular-eslint/no-output-native': 'error',
      '@angular-eslint/no-output-on-prefix': 'error',
      '@angular-eslint/no-output-rename': 'error',
      '@angular-eslint/no-outputs-metadata-property': 'error',
      '@angular-eslint/use-pipe-transform-interface': 'error',

      /*
        The remaining "recommended" Angular rules are migration nudges, not correctness checks, and
        each one disagrees with a deliberate choice in this codebase. Enabling them would report an
        error on nearly every file while saying nothing about whether the code works.

        Revisit these together if the app is ever migrated to standalone components — that is one
        piece of work, not something to be dragged in a file at a time by a linter.
      */
      // This app is intentionally NgModule-based; every component sets `standalone: false`.
      '@angular-eslint/prefer-standalone': 'off',
      // Constructor injection throughout; `inject()` would be a separate, wholesale change.
      '@angular-eslint/prefer-inject': 'off',
      // Default change detection. Moving to OnPush needs auditing, not a blanket switch.
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',

      // Deliberate: content payloads and module interop are genuinely `unknown` and narrowed by hand.
      '@typescript-eslint/no-explicit-any': 'error',
      // Unused arguments are meaningful in Angular signatures (`trackBy`, lifecycle hooks).
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // ------------------------------ Templates --------------------------------
  {
    files: ['src/**/*.html'],
    languageOptions: { parser: templateParser },
    plugins: { '@angular-eslint/template': ngTemplatePlugin },
    rules: {
      // Correctness.
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/no-negated-async': 'error',

      /*
        Accessibility. This set is the reason lint matters here — the site commits to keyboard
        operability and screen-reader semantics, and these catch regressions that reviewing a diff
        does not.
      */
      '@angular-eslint/template/alt-text': 'error',
      '@angular-eslint/template/elements-content': 'error',
      '@angular-eslint/template/label-has-associated-control': 'error',
      '@angular-eslint/template/click-events-have-key-events': 'error',
      '@angular-eslint/template/interactive-supports-focus': 'error',
      '@angular-eslint/template/mouse-events-have-key-events': 'error',
      '@angular-eslint/template/no-autofocus': 'error',
      '@angular-eslint/template/no-distracting-elements': 'error',
      '@angular-eslint/template/no-positive-tabindex': 'error',
      '@angular-eslint/template/role-has-required-aria': 'error',
      '@angular-eslint/template/table-scope': 'error',
      '@angular-eslint/template/valid-aria': 'error',

      // The control-flow syntax (`@if`/`@for`) is an Angular 17+ migration this app has not made.
      '@angular-eslint/template/prefer-control-flow': 'off',
    },
  },
];
