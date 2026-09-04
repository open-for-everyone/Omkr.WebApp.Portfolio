import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

/**
 * The site's key in the admin's website-content store.
 *
 * Everything this site reads lives under `portfolio`. One older key — the resume — was seeded under
 * `omkr-portfolio` before the naming settled, so {@link SiteContentService.get} falls back to it.
 * Once the resume row has been re-saved under `portfolio` in the admin, `LEGACY_SITE_KEY` and the
 * fallback can go.
 */
export const SITE_KEY = 'portfolio';
export const LEGACY_SITE_KEY = 'omkr-portfolio';

/** What `GET /api/website-content/public/{siteKey}/{contentKey}` returns. */
interface PublicWebsiteContentView {
  siteKey: string;
  contentKey: string;
  locale: string;
  requestedLocale: string;
  payloadJson: string;
  version: number;
  updatedAt: string;
}

/**
 * Reads admin-managed JSON blocks from the identity provider's website-content API — the same store
 * the blog and the admin app use, and the same one {@link ApiTranslateLoader} reads its structured
 * text from.
 *
 * This service is for content that is *not* translated: URLs, handles, phone numbers, the GitHub
 * account to list repositories from. Translated text goes through the ngx-translate store instead,
 * so that it is edited once per language rather than once per language per field.
 *
 * Nothing here rejects. A key that is missing, unpublished, malformed, or unreachable resolves to
 * the caller's fallback, because a portfolio that renders with built-in defaults beats one that
 * renders an error.
 */
@Injectable({ providedIn: 'root' })
export class SiteContentService {
  /** One in-flight/replayed request per key, so ten components asking for `profile` make one call. */
  private readonly cache = new Map<string, Observable<unknown>>();

  constructor(private http: HttpClient) {}

  /**
   * Fetches one content key, falling back to `fallback` on any failure.
   *
   * @param contentKey key within the site, e.g. `profile`
   * @param fallback   value to use when the key is absent or unusable
   * @param locale     request a specific language; omit for content that is not translated
   */
  get<T>(contentKey: string, fallback: T, locale?: string): Observable<T> {
    const cacheKey = `${contentKey}:${locale ?? ''}`;
    const cached = this.cache.get(cacheKey) as Observable<T> | undefined;
    if (cached) return cached;

    const request$ = this.fetch<T>(SITE_KEY, contentKey, locale).pipe(
      catchError(() =>
        // The site key moved; a row seeded under the old one is still valid content.
        this.fetch<T>(LEGACY_SITE_KEY, contentKey, locale).pipe(catchError(() => of(null))),
      ),
      map((value) => value ?? fallback),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.cache.set(cacheKey, request$);
    return request$;
  }

  /** Drops the cache so the next read re-fetches. Used when the visitor switches language. */
  invalidate(contentKey?: string): void {
    if (!contentKey) {
      this.cache.clear();
      return;
    }
    for (const key of [...this.cache.keys()]) {
      if (key.startsWith(`${contentKey}:`)) this.cache.delete(key);
    }
  }

  private fetch<T>(siteKey: string, contentKey: string, locale?: string): Observable<T | null> {
    const query = locale ? `?locale=${encodeURIComponent(locale)}` : '';
    const url =
      `${environment.idpApiBaseUrl}/website-content/public/` +
      `${encodeURIComponent(siteKey)}/${encodeURIComponent(contentKey)}${query}`;

    return this.http
      .get<PublicWebsiteContentView>(url)
      .pipe(map((view) => this.parse<T>(view)));
  }

  /**
   * Turns a payload into a value, or null if it cannot be trusted.
   *
   * The payload is operator-authored JSON from a database, so it is parsed defensively: a syntax
   * error or an unexpected primitive resolves to null and the caller's fallback renders instead.
   */
  private parse<T>(view: PublicWebsiteContentView | null): T | null {
    if (!view?.payloadJson) return null;
    try {
      const payload: unknown = JSON.parse(view.payloadJson);
      if (payload === null || typeof payload !== 'object') return null;
      return payload as T;
    } catch {
      return null;
    }
  }
}
