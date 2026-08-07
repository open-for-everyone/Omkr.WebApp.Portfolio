import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import {
  PublicLocale,
  RuntimeConfig,
  RuntimeConfigClient,
  Unsubscribe,
} from '@keshavsingh3197/web-config';
import { environment } from 'src/environments/environment';

/**
 * The key list and wire shapes live in `@keshavsingh3197/web-config`, shared with the admin app and the
 * blog so the three cannot drift.
 */
export { CONFIG_KEYS } from '@keshavsingh3197/web-config';
export type { ConfigKey, PublicLocale, RuntimeConfig } from '@keshavsingh3197/web-config';

/**
 * The Angular adapter over {@link RuntimeConfigClient} — the central runtime config served by the
 * identity provider (`GET /api/config`). Branding, icons, cross-site links and feature flags are
 * database values an admin can change, not something compiled into this build.
 *
 * This app is on Angular 16, so state is exposed as a `BehaviorSubject` rather than a signal. That is
 * the only difference from the admin and blog adapters — all the actual logic is in the shared package.
 *
 * Nothing here throws: a config outage leaves the accessors returning their fallbacks, because a
 * portfolio that renders with built-in defaults beats one that does not render.
 */
@Injectable({ providedIn: 'root' })
export class RuntimeConfigService implements OnDestroy {
  private readonly client = new RuntimeConfigClient({
    apiBase: environment.idpApiBaseUrl,
  });

  private readonly configSubject = new BehaviorSubject<RuntimeConfig | null>(null);
  private readonly off: Unsubscribe;

  /** Emits on every load that changed something; starts as null. */
  readonly config$: Observable<RuntimeConfig | null> = this.configSubject.asObservable();

  constructor() {
    this.off = this.client.onChange((value) => this.configSubject.next(value));
  }

  ngOnDestroy(): void {
    this.off();
  }

  get config(): RuntimeConfig | null {
    return this.configSubject.value;
  }

  get loaded(): boolean {
    return this.client.loaded;
  }

  get locales(): PublicLocale[] {
    return this.config?.locales ?? [];
  }

  load(): Observable<RuntimeConfig | null> {
    return from(this.client.load());
  }

  refresh(): void {
    this.load().subscribe();
  }

  // ---- Typed accessors. The `fallback` is pre-load rendering only, never a 2nd source of truth. ----

  text(key: string, fallback = ''): string {
    return this.client.text(key, fallback);
  }

  bool(key: string, fallback = false): boolean {
    return this.client.bool(key, fallback);
  }

  num(key: string, fallback = 0): number {
    return this.client.num(key, fallback);
  }

  icon(key: string, fallback = ''): string {
    return this.client.icon(key, fallback);
  }

  json<T>(key: string, fallback: T): T {
    return this.client.json(key, fallback);
  }

  isLocalized(key: string): boolean {
    return this.client.isLocalized(key);
  }

  /** The underlying client, shared with the localisation adapter. */
  get runtime(): RuntimeConfigClient {
    return this.client;
  }
}
