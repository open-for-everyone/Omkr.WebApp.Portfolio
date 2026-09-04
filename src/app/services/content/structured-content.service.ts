import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Reads the structured (non-scalar) blocks that {@link ApiTranslateLoader} merges into the
 * ngx-translate store — the about paragraphs, the experience timeline, the skill groups, the
 * curated projects and the navigation labels.
 *
 * Why a service rather than `| translate` straight in the template, which is what the About section
 * does: when a key is missing, ngx-translate returns *the key itself*, as a string. A template doing
 * `*ngFor="let x of 'Skills.Categories' | translate"` then iterates that string character by
 * character and renders one card per letter. Content is admin-managed and a key can genuinely be
 * absent — before it is first published, or if someone renames it — so every read is validated and
 * falls back to a compiled-in default instead.
 *
 * Reads use `translate.stream()`, so switching language re-emits and the section re-renders without
 * a reload.
 */
@Injectable({ providedIn: 'root' })
export class StructuredContentService {
  constructor(private translate: TranslateService) {}

  /**
   * A list of objects, validated and normalised item by item.
   *
   * @param key      translate key, e.g. `Skills.Categories`
   * @param fallback used when the key is missing, is not a list, or holds nothing usable
   * @param mapItem  converts one raw entry into a domain object, or returns null to drop it
   */
  mapList<T>(
    key: string,
    fallback: T[],
    mapItem: (raw: Record<string, unknown>) => T | null,
  ): Observable<T[]> {
    return this.translate.stream(key).pipe(
      map((value: unknown) => {
        if (!Array.isArray(value)) return fallback;
        const cleaned = value
          .filter(StructuredContentService.isRecord)
          .map(mapItem)
          .filter((item): item is T => item !== null);
        // An entirely invalid list means the payload is wrong, not that the section is empty.
        return cleaned.length > 0 ? cleaned : fallback;
      }),
    );
  }

  /**
   * A list of plain strings, e.g. the about paragraphs.
   *
   * @param key      translate key
   * @param fallback used when the key is missing or holds no usable strings
   */
  textList(key: string, fallback: string[]): Observable<string[]> {
    return this.translate.stream(key).pipe(
      map((value: unknown) => {
        if (!Array.isArray(value)) return fallback;
        const cleaned = StructuredContentService.toStringArray(value);
        return cleaned.length > 0 ? cleaned : fallback;
      }),
    );
  }

  /**
   * A scalar string, guaranteed not to be the raw key.
   *
   * @param key      translate key
   * @param fallback used when the key resolves to nothing, or to itself
   */
  text(key: string, fallback: string): Observable<string> {
    return this.translate.stream(key).pipe(
      map((value: unknown) => {
        if (typeof value !== 'string') return fallback;
        const trimmed = value.trim();
        // ngx-translate echoes the key back when it has no entry for it.
        if (!trimmed || trimmed === key) return fallback;
        return trimmed;
      }),
    );
  }

  /** True when `value` is a non-null object — the precondition every item guard starts from. */
  static isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  /** True when `value` is a non-empty string. */
  static isText(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
  }

  /** Coerces to an array of non-empty strings, dropping anything else. */
  static toStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value.filter(StructuredContentService.isText).map((item) => item.trim());
  }
}
