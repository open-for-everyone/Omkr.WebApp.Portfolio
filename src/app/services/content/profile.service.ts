import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DEFAULT_PROFILE } from 'src/app/models/content/site-content.defaults';
import { SiteProfile, SocialLink, SocialIconName } from 'src/app/models/content/site-content.model';
import { SiteContentService } from './site-content.service';

/** Icon names the site can actually draw. Anything else degrades to a generic link glyph. */
const KNOWN_ICONS: ReadonlySet<string> = new Set<SocialIconName>([
  'github',
  'linkedin',
  'youtube',
  'stackoverflow',
  'twitter',
  'instagram',
  'facebook',
  'email',
  'link',
]);

/**
 * URL schemes a content-managed link is allowed to use.
 *
 * Angular already refuses to bind a `javascript:` URL into `[href]`, but this content arrives from a
 * database that several people can edit, so the allowlist is enforced here too rather than relying
 * on one layer. A link that fails the check is dropped, not rendered inert, so nobody is left
 * clicking something that silently does nothing.
 */
const ALLOWED_PROTOCOLS: ReadonlySet<string> = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/**
 * The site's identity — name, avatar, contact details and social links — read from the admin and
 * normalised into something the templates can render without defending themselves.
 *
 * Payloads are merged over {@link DEFAULT_PROFILE} field by field, so the admin can override just
 * the phone number without having to restate the whole document.
 */
@Injectable({ providedIn: 'root' })
export class ProfileService {
  readonly profile$: Observable<SiteProfile>;

  constructor(private content: SiteContentService) {
    this.profile$ = this.content
      .get<Partial<SiteProfile>>('profile', DEFAULT_PROFILE)
      .pipe(
        map((raw) => this.normalise(raw)),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
  }

  /** Social links for the hero row. */
  get heroSocials$(): Observable<SocialLink[]> {
    return this.profile$.pipe(
      map((p) => p.socials.filter((s) => s.showInHero !== false)),
    );
  }

  /** Social links for the footer row. */
  get footerSocials$(): Observable<SocialLink[]> {
    return this.profile$.pipe(
      map((p) => p.socials.filter((s) => s.showInFooter !== false)),
    );
  }

  /**
   * Merges an admin payload over the defaults, dropping anything unusable.
   *
   * Every field is checked rather than trusted: a string field that arrives as a number, or a
   * `socials` that arrives as an object instead of an array, falls back rather than reaching a
   * template and breaking the render.
   */
  private normalise(raw: Partial<SiteProfile> | null | undefined): SiteProfile {
    const base = DEFAULT_PROFILE;
    if (!raw || typeof raw !== 'object') return base;

    return {
      name: this.str(raw.name, base.name),
      roles: this.strArray(raw.roles, base.roles),
      avatarUrl: this.url(raw.avatarUrl) ?? base.avatarUrl,
      logoUrl: this.str(raw.logoUrl, base.logoUrl),
      email: this.str(raw.email, base.email),
      phone: this.str(raw.phone, base.phone),
      whatsapp: this.digits(raw.whatsapp, base.whatsapp),
      location: this.str(raw.location, base.location),
      githubUsername: this.str(raw.githubUsername, base.githubUsername),
      resumeFileName: this.str(raw.resumeFileName, base.resumeFileName),
      socials: this.socials(raw.socials, base.socials),
    };
  }

  private socials(raw: unknown, fallback: SocialLink[]): SocialLink[] {
    if (!Array.isArray(raw)) return fallback;

    const cleaned = raw
      .filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === 'object')
      .map((entry) => this.social(entry))
      .filter((entry): entry is SocialLink => entry !== null);

    // An admin who publishes an empty or entirely invalid list almost certainly did not mean to
    // erase every link, so treat that as "unset" rather than "none".
    return cleaned.length > 0 ? cleaned : fallback;
  }

  private social(entry: Record<string, unknown>): SocialLink | null {
    if (entry['enabled'] === false) return null;

    const url = this.url(entry['url']);
    const label = typeof entry['label'] === 'string' ? entry['label'].trim() : '';
    if (!url || !label) return null;

    const rawIcon = typeof entry['icon'] === 'string' ? entry['icon'] : '';
    const icon: SocialIconName = KNOWN_ICONS.has(rawIcon)
      ? (rawIcon as SocialIconName)
      : 'link';

    const id = typeof entry['id'] === 'string' && entry['id'].trim() ? entry['id'].trim() : icon;

    return {
      id,
      label,
      url,
      icon,
      showInHero: entry['showInHero'] !== false,
      showInFooter: entry['showInFooter'] !== false,
    };
  }

  /** Returns the URL only if it parses and uses an allowed scheme. */
  private url(value: unknown): string | null {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const parsed = new URL(value, window.location.origin);
      return ALLOWED_PROTOCOLS.has(parsed.protocol) ? value.trim() : null;
    } catch {
      return null;
    }
  }

  private str(value: unknown, fallback: string): string {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
  }

  private strArray(value: unknown, fallback: string[]): string[] {
    if (!Array.isArray(value)) return fallback;
    const cleaned = value.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    );
    return cleaned.length > 0 ? cleaned : fallback;
  }

  /** `wa.me` takes digits only — strip everything else so `+91 99…` still works. */
  private digits(value: unknown, fallback: string): string {
    if (typeof value !== 'string') return fallback;
    const stripped = value.replace(/\D/g, '');
    return stripped.length >= 8 ? stripped : fallback;
  }
}
