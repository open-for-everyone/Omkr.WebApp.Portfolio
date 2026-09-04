import { Injectable } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faFacebookF,
  faGithub,
  faInstagram,
  faLinkedinIn,
  faStackOverflow,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLink, faUser } from '@fortawesome/free-solid-svg-icons';
import { SocialIconName } from 'src/app/models/content/site-content.model';

/**
 * Registers every icon the site can draw, once, and maps the icon *names* used in admin-managed
 * content onto them.
 *
 * Two reasons this is central rather than per-component, which is how it used to be:
 *
 * 1. Social links are content now, so the icon name arrives as a string from a database. Passing an
 *    unregistered name to `<fa-icon>` throws and takes the section down with it, so names are
 *    resolved through an allowlist here and anything unrecognised becomes a generic link glyph.
 * 2. The header, hero and footer previously each called `library.addIcons(...)` with overlapping
 *    sets, which meant the footer happened to be what registered the icons the hero relied on.
 */
@Injectable({ providedIn: 'root' })
export class IconRegistryService {
  private registered = false;

  /** Icon name → the `IconProp` the template binds. Keys are the allowlist. */
  private readonly icons: Record<SocialIconName, IconProp> = {
    github: ['fab', 'github'],
    linkedin: ['fab', 'linkedin-in'],
    youtube: ['fab', 'youtube'],
    stackoverflow: ['fab', 'stack-overflow'],
    twitter: ['fab', 'twitter'],
    instagram: ['fab', 'instagram'],
    facebook: ['fab', 'facebook-f'],
    email: ['fas', 'envelope'],
    link: ['fas', 'link'],
  };

  constructor(private library: FaIconLibrary) {
    this.register();
  }

  /** Idempotent: the library throws on nothing, but repeated work here is pointless. */
  register(): void {
    if (this.registered) return;
    this.library.addIcons(
      faGithub,
      faLinkedinIn,
      faYoutube,
      faStackOverflow,
      faTwitter,
      faInstagram,
      faFacebookF,
      faEnvelope,
      faLink,
      faUser,
    );
    this.registered = true;
  }

  /**
   * Resolves a content-supplied icon name. Unknown names return the generic link glyph rather than
   * throwing, so a typo in the admin costs an icon, not the page.
   */
  resolve(name: string | undefined | null): IconProp {
    if (name && this.isKnown(name)) return this.icons[name];
    return this.icons.link;
  }

  private isKnown(name: string): name is SocialIconName {
    return Object.prototype.hasOwnProperty.call(this.icons, name);
  }
}
