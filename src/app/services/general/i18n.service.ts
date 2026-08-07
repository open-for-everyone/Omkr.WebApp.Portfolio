import { Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  LocalizationClient,
  PublicLocale,
  TranslationBundle,
  Unsubscribe,
} from '@keshavsingh3197/web-config';
import { environment } from 'src/environments/environment';
import { RuntimeConfigService } from './runtime-config.service';

/**
 * The Angular adapter over {@link LocalizationClient} for this site, plus the bridge to ngx-translate.
 *
 * Why both: the templates already use `| translate` and `translate.get()` in a dozen places, and
 * ngx-translate handles the structured arrays (about paragraphs, the experience timeline) well. Rather
 * than rewrite those, {@link ApiTranslateLoader} points ngx-translate at our API and this service owns
 * the parts ngx-translate has no concept of — which languages exist, which one the visitor chose, how
 * that choice is remembered, and polling for editor changes.
 *
 * So: `LocalizationClient` decides the language, `TranslateService` renders it.
 */
@Injectable({ providedIn: 'root' })
export class I18nService implements OnDestroy {
  private readonly client: LocalizationClient;
  private readonly bundleSubject = new BehaviorSubject<TranslationBundle | null>(null);
  private readonly off: Unsubscribe;

  readonly bundle$: Observable<TranslationBundle | null> = this.bundleSubject.asObservable();
  readonly locale$: Observable<string> = this.bundle$.pipe(map((b) => b?.locale ?? ''));

  constructor(
    private config: RuntimeConfigService,
    private translate: TranslateService,
  ) {
    this.client = new LocalizationClient({
      apiBase: environment.idpApiBaseUrl,
      namespaces: ['common', 'portfolio', 'brand'],
      config: this.config.runtime,
    });

    this.off = this.client.onChange((bundle) => {
      this.bundleSubject.next(bundle);
      // Whenever the client settles on a language — first load, a switch, or a poll that found an edit
      // — tell ngx-translate to (re)load it through ApiTranslateLoader.
      if (bundle?.locale) this.applyToTranslate(bundle.locale);
    });
  }

  ngOnDestroy(): void {
    this.off();
    this.client.dispose();
  }

  get locale(): string {
    return this.client.locale;
  }

  get locales(): PublicLocale[] {
    return this.client.locales;
  }

  /** True only when an admin left the picker on AND more than one language is enabled. */
  get showPicker(): boolean {
    return this.client.showPicker;
  }

  get direction(): 'ltr' | 'rtl' {
    return this.client.direction;
  }

  /**
   * Resolves the visitor's language and loads it. Call once at startup, after the runtime config has
   * loaded — the persistence key and the poll interval are both config values.
   */
  init(): Observable<TranslationBundle | null> {
    return from(this.client.init());
  }

  /** Switches language: persists the choice, reloads the catalogue, updates `lang`/`dir`. */
  use(code: string): void {
    void this.client.use(code);
  }

  /** Direct lookup, for the odd place that needs a string in TypeScript rather than a template. */
  t(key: string, params?: Record<string, string | number>): string {
    return this.client.t(key, params);
  }

  /** Resolves a config entry that holds a translation key; a plain entry is returned as-is. */
  configText(key: string, fallback = ''): string {
    return this.client.configText(key, fallback);
  }

  private applyToTranslate(locale: string): void {
    // setDefaultLang first, so a key missing from a partially translated language still resolves.
    const fallback = this.config.config?.defaultLocale ?? 'en';
    if (this.translate.defaultLang !== fallback) this.translate.setDefaultLang(fallback);
    // `use` re-invokes the loader, which re-merges the offline base, structured content and bundle.
    this.translate.use(locale);
  }
}
