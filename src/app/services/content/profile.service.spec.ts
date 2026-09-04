import { Observable, of } from 'rxjs';
import { DEFAULT_PROFILE } from 'src/app/models/content/site-content.defaults';
import { SiteProfile } from 'src/app/models/content/site-content.model';
import { ProfileService } from './profile.service';
import { SiteContentService } from './site-content.service';

/**
 * Returns a ProfileService whose content API answers with `payload`.
 *
 * Instantiated directly rather than through TestBed: the class takes one collaborator and has no
 * Angular lifecycle, so a stub is clearer and cannot be affected by module configuration.
 */
function serviceReturning(payload: unknown): ProfileService {
  const content = {
    get: <T>(_key: string, fallback: T): Observable<T> =>
      of((payload ?? fallback) as T),
  } as unknown as SiteContentService;

  return new ProfileService(content);
}

/** Resolves the single value `profile$` emits. */
async function profileFrom(payload: unknown): Promise<SiteProfile> {
  return new Promise<SiteProfile>((resolve) => {
    serviceReturning(payload).profile$.subscribe(resolve);
  });
}

describe('ProfileService', () => {
  it('falls back to the defaults when the key is absent', async () => {
    const profile = await profileFrom(null);
    expect(profile.name).toBe(DEFAULT_PROFILE.name);
    expect(profile.socials.length).toBe(DEFAULT_PROFILE.socials.length);
  });

  it('merges a partial payload over the defaults', async () => {
    const profile = await profileFrom({ name: 'Someone Else' });
    expect(profile.name).toBe('Someone Else');
    // Untouched fields keep their default rather than becoming undefined.
    expect(profile.email).toBe(DEFAULT_PROFILE.email);
  });

  it('strips non-digits from the WhatsApp number', async () => {
    const profile = await profileFrom({ whatsapp: '+91 99827-61929' });
    expect(profile.whatsapp).toBe('919982761929');
  });

  it('keeps the default WhatsApp number when the supplied one is too short', async () => {
    const profile = await profileFrom({ whatsapp: '123' });
    expect(profile.whatsapp).toBe(DEFAULT_PROFILE.whatsapp);
  });

  it('drops social links whose URL uses a disallowed scheme', async () => {
    const profile = await profileFrom({
      socials: [
        { id: 'ok', label: 'Fine', url: 'https://example.com', icon: 'github' },
        { id: 'bad', label: 'Nope', url: 'javascript:alert(1)', icon: 'github' },
      ],
    });

    expect(profile.socials.length).toBe(1);
    expect(profile.socials[0].id).toBe('ok');
  });

  it('replaces an unknown icon name with the generic link icon', async () => {
    const profile = await profileFrom({
      socials: [{ id: 'x', label: 'Somewhere', url: 'https://example.com', icon: 'not-an-icon' }],
    });

    expect(profile.socials[0].icon).toBe('link');
  });

  it('omits links flagged as disabled', async () => {
    const profile = await profileFrom({
      socials: [
        { id: 'on', label: 'Shown', url: 'https://example.com', icon: 'github' },
        { id: 'off', label: 'Hidden', url: 'https://example.com', icon: 'github', enabled: false },
      ],
    });

    expect(profile.socials.map((s) => s.id)).toEqual(['on']);
  });

  it('treats an all-invalid social list as unset rather than as empty', async () => {
    const profile = await profileFrom({ socials: [{ label: '', url: '' }] });
    expect(profile.socials.length).toBe(DEFAULT_PROFILE.socials.length);
  });

  it('ignores a payload of the wrong shape entirely', async () => {
    const profile = await profileFrom({ roles: 'not an array', name: 42 });
    expect(profile.name).toBe(DEFAULT_PROFILE.name);
    expect(profile.roles).toEqual(DEFAULT_PROFILE.roles);
  });
});
