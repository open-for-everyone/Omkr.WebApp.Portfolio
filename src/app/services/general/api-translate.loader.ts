import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TranslationBundle } from '@keshavsingh3197/web-config';
import { environment } from 'src/environments/environment';

/** A structured content block from `website_content` (arrays and objects a flat bundle can't hold). */
interface PublicWebsiteContent {
  siteKey: string;
  contentKey: string;
  locale: string;
  requestedLocale: string;
  payloadJson: string;
  version: number;
  updatedAt: string;
}

/**
 * Feeds ngx-translate from the identity provider instead of from `assets/i18n/*.json`, so this site's
 * text is a database edit rather than a redeploy — and so it gets Hindi for free.
 *
 * Three layers are merged, later winning:
 *
 * 1. **`assets/i18n/{lang}.json`** — the bundled copy, kept purely as an offline base. If the API is
 *    unreachable the site still renders real English text rather than raw keys. It is not the source of
 *    truth for anything any more.
 * 2. **Structured content** (`website_content`, site `portfolio`) — the arrays and objects the
 *    templates consume through `translate.get()` (about paragraphs, the experience timeline). A flat
 *    bundle cannot express those, and `website_content` is per-locale, which is exactly what they need.
 * 3. **The flat bundle** (`/api/i18n/bundle/{lang}?ns=portfolio,common,brand`) — every scalar string.
 *    Untranslated keys are already filled in from the locale's fallback chain server-side.
 *
 * Every layer degrades independently: a failure in any one of them resolves to `{}` rather than
 * rejecting, because a partially-loaded catalogue is always better than a page of key names.
 */
@Injectable({ providedIn: 'root' })
export class ApiTranslateLoader implements TranslateLoader {
  /** The bundles this site renders. Asking for only these keeps the admin app's strings out of it. */
  private static readonly NAMESPACES = 'portfolio,common,brand';

  /**
   * Structured blocks to fetch and flatten into the store, keyed by the prefix the templates use.
   * Adding one here is all it takes for a new structured section to become per-locale and editable.
   */
  private static readonly STRUCTURED: ReadonlyArray<{ contentKey: string; prefix: string }> = [
    { contentKey: 'about', prefix: 'AboutMe' },
    { contentKey: 'experience', prefix: 'Experience' },
    { contentKey: 'skills', prefix: 'Skills' },
    { contentKey: 'projects', prefix: 'Projects' },
    { contentKey: 'navigation', prefix: 'Navigation' },
  ];

  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<TranslationObject> {
    const base = `${environment.idpApiBaseUrl}`;

    const offline$ = this.http
      .get<Record<string, unknown>>(`./assets/i18n/${lang}.json`)
      .pipe(catchError(() => of<Record<string, unknown>>({})));

    const bundle$ = this.http
      .get<TranslationBundle>(
        `${base}/i18n/bundle/${encodeURIComponent(lang)}?ns=${encodeURIComponent(ApiTranslateLoader.NAMESPACES)}`,
      )
      .pipe(
        map((bundle) => this.stripNamespaces(bundle?.entries ?? {})),
        catchError(() => of<Record<string, unknown>>({})),
      );

    const structured$ = forkJoin(
      ApiTranslateLoader.STRUCTURED.map((block) =>
        this.http
          .get<PublicWebsiteContent>(
            `${base}/website-content/public/portfolio/${block.contentKey}?locale=${encodeURIComponent(lang)}`,
          )
          .pipe(
            map((content) => this.parseStructured(content, block.prefix)),
            // A block that isn't published yet is simply absent; the offline base still covers it.
            catchError(() => of<Record<string, unknown>>({})),
          ),
      ),
    ).pipe(
      map((blocks) => Object.assign({}, ...blocks) as Record<string, unknown>),
      catchError(() => of<Record<string, unknown>>({})),
    );

    return forkJoin({ offline: offline$, structured: structured$, bundle: bundle$ }).pipe(
      map(({ offline, structured, bundle }) => ({ ...offline, ...structured, ...bundle }) as TranslationObject),
    );
  }

  /**
   * The API returns `portfolio.Header.Item1`; the templates ask for `Header.Item1`. Strips the leading
   * namespace so the existing templates keep working unchanged, and keeps the full key too so a new
   * template can be explicit if it wants.
   */
  private stripNamespaces(entries: Record<string, string>): Record<string, unknown> {
    const flat: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(entries)) {
      flat[key] = value;
      const dot = key.indexOf('.');
      if (dot > 0) {
        const bare = key.slice(dot + 1);
        // First namespace to define a bare key wins, so `common` can't quietly shadow `portfolio`.
        if (!(bare in flat)) flat[bare] = value;
      }
    }
    return flat;
  }

  /**
   * Turns one content block into translate-store entries under `prefix`. The payload is an object whose
   * properties become `prefix.Property` — so `{ "Paragraphs": [...] }` published as `portfolio/about`
   * lands as `AboutMe.Paragraphs`, which is what the template already reads.
   */
  private parseStructured(content: PublicWebsiteContent | null, prefix: string): Record<string, unknown> {
    if (!content?.payloadJson) return {};
    try {
      const payload = JSON.parse(content.payloadJson) as unknown;
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return {};

      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
        result[`${prefix}.${key}`] = value;
      }
      return result;
    } catch {
      // Malformed payload: fall through to the offline base rather than rendering nothing.
      return {};
    }
  }
}
