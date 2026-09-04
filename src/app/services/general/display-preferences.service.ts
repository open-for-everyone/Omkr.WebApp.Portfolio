import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeMode = 'dark' | 'light';

/** The visitor's display choices, all persisted. */
export interface DisplayPreferences {
  theme: ThemeMode;
  highContrast: boolean;
  reduceMotion: boolean;
}

const KEY_THEME = 'theme';
/** `'1' | '0'`, the format the site has always used and the README documents. */
const KEY_HIGH_CONTRAST = 'highContrast';
const KEY_REDUCE_MOTION = 'reduceMotion';

/**
 * Owns the three display toggles and the body classes that back them.
 *
 * This used to live in the header component, which caused two problems worth naming:
 *
 * - High contrast was unreachable. The toggle had been deleted from the header, but the CSS and the
 *   `highContrast` storage key survived, and `ngOnInit` ran `body.classList.remove('high-contrast')`
 *   on every load — so a visitor who had turned it on silently lost it, permanently.
 * - Preferences only applied once a header existed. Routes that render a header late, or not at all,
 *   flashed the wrong theme.
 *
 * Applying preferences at construction, from a root-provided service, fixes both.
 *
 * High contrast composes on top of light or dark rather than replacing them, so the two toggles are
 * independent — which is what someone who needs high contrast *and* a light background expects.
 */
@Injectable({ providedIn: 'root' })
export class DisplayPreferencesService {
  private readonly state$: BehaviorSubject<DisplayPreferences>;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.state$ = new BehaviorSubject<DisplayPreferences>(this.load());
    this.apply(this.state$.value);
  }

  get preferences$(): Observable<DisplayPreferences> {
    return this.state$.asObservable();
  }

  get preferences(): DisplayPreferences {
    return this.state$.value;
  }

  get theme(): ThemeMode {
    return this.state$.value.theme;
  }

  get isLight(): boolean {
    return this.state$.value.theme === 'light';
  }

  get isHighContrast(): boolean {
    return this.state$.value.highContrast;
  }

  get isReducedMotion(): boolean {
    return this.state$.value.reduceMotion;
  }

  setTheme(theme: ThemeMode): void {
    this.update({ theme });
  }

  toggleTheme(): void {
    this.setTheme(this.isLight ? 'dark' : 'light');
  }

  setHighContrast(on: boolean): void {
    this.update({ highContrast: on });
  }

  toggleHighContrast(): void {
    this.setHighContrast(!this.isHighContrast);
  }

  setReduceMotion(on: boolean): void {
    this.update({ reduceMotion: on });
  }

  toggleReduceMotion(): void {
    this.setReduceMotion(!this.isReducedMotion);
  }

  private update(patch: Partial<DisplayPreferences>): void {
    const next: DisplayPreferences = { ...this.state$.value, ...patch };
    this.state$.next(next);
    this.apply(next);
    this.persist(next);
  }

  private apply(prefs: DisplayPreferences): void {
    const body = this.document.body;
    body.classList.toggle('light', prefs.theme === 'light');
    // Kept because a handful of component stylesheets still select on these.
    body.classList.toggle('light-theme', prefs.theme === 'light');
    body.classList.toggle('dark-theme', prefs.theme === 'dark');
    body.classList.toggle('high-contrast', prefs.highContrast);
    body.classList.toggle('reduce-motion', prefs.reduceMotion);

    // Lets the browser paint form controls, scrollbars and the like to match.
    this.document.documentElement.style.colorScheme = prefs.theme;
  }

  /**
   * Reads stored choices, falling back to what the operating system asks for. Every access is
   * guarded: `localStorage` throws outright in some privacy modes, and a portfolio must not fail to
   * render because of a theme preference.
   */
  private load(): DisplayPreferences {
    return {
      theme: this.readTheme(),
      highContrast: this.readFlag(KEY_HIGH_CONTRAST, false),
      reduceMotion: this.readFlag(KEY_REDUCE_MOTION, this.prefersReducedMotion()),
    };
  }

  private readTheme(): ThemeMode {
    const stored = this.read(KEY_THEME);
    if (stored === 'light' || stored === 'dark') return stored;
    // No stored choice: follow the OS rather than forcing dark on someone in light mode.
    return this.prefersLight() ? 'light' : 'dark';
  }

  private readFlag(key: string, fallback: boolean): boolean {
    const stored = this.read(key);
    if (stored === '1') return true;
    if (stored === '0') return false;
    return fallback;
  }

  private persist(prefs: DisplayPreferences): void {
    this.write(KEY_THEME, prefs.theme);
    this.write(KEY_HIGH_CONTRAST, prefs.highContrast ? '1' : '0');
    this.write(KEY_REDUCE_MOTION, prefs.reduceMotion ? '1' : '0');
  }

  private read(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private write(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* Storage unavailable — the choice applies for this page view only. */
    }
  }

  private prefersLight(): boolean {
    return this.matches('(prefers-color-scheme: light)');
  }

  private prefersReducedMotion(): boolean {
    return this.matches('(prefers-reduced-motion: reduce)');
  }

  private matches(query: string): boolean {
    try {
      return typeof window !== 'undefined' && window.matchMedia(query).matches;
    } catch {
      return false;
    }
  }
}
