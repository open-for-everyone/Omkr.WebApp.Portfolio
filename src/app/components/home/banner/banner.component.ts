import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Subject, takeUntil } from 'rxjs';
import { DEFAULT_PROFILE } from 'src/app/models/content/site-content.defaults';
import { SiteProfile, SocialLink } from 'src/app/models/content/site-content.model';
import { AnalyticService } from 'src/app/services/Analytics/analytic.service';
import { ProfileService } from 'src/app/services/content/profile.service';
import { DisplayPreferencesService } from 'src/app/services/general/display-preferences.service';
import { IconRegistryService } from 'src/app/services/general/icon-registry.service';

/**
 * The hero.
 *
 * Name, roles, avatar and social links are admin-managed rather than markup — the name used to be a
 * literal `<h2>Keshav Singh</h2>` and the three social links were hardcoded anchors.
 *
 * The typing animation honours the reduced-motion preference: repeating text that rewrites itself
 * every few seconds is exactly the kind of movement that setting exists to stop, and a screen reader
 * would otherwise announce the role letter by letter. When motion is reduced the first role is
 * simply shown.
 */
@Component({
  standalone: false,
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  animations: [
    trigger('bannerTrigger', [
      transition(':enter', [
        query(
          '.hero-text > *',
          [
            style({ opacity: 0, transform: 'translateY(24px)' }),
            stagger(120, [
              animate('450ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' })),
            ]),
          ],
          { optional: true },
        ),
        query(
          '.hero-avatar',
          [
            style({ opacity: 0, transform: 'scale(.92)' }),
            animate('600ms 200ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' })),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class BannerComponent implements OnInit, OnDestroy {
  profile: SiteProfile = DEFAULT_PROFILE;
  socials: SocialLink[] = [];

  /** What the typing animation currently shows. */
  currentRole = '';

  private roles: string[] = DEFAULT_PROFILE.roles;
  private roleIdx = 0;
  private charIdx = 0;
  private isTyping = true;
  private typingTimer: number | null = null;
  private readonly destroyed$ = new Subject<void>();

  constructor(
    public analyticsService: AnalyticService,
    private profileService: ProfileService,
    private icons: IconRegistryService,
    private display: DisplayPreferencesService,
  ) {}

  ngOnInit(): void {
    this.profileService.profile$.pipe(takeUntil(this.destroyed$)).subscribe((profile) => {
      this.profile = profile;
      this.roles = profile.roles;
      this.restartTyping();
    });

    this.profileService.heroSocials$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((socials) => (this.socials = socials));
  }

  ngOnDestroy(): void {
    this.stopTyping();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /** Resolves a content-supplied icon name to something drawable. */
  iconFor(social: SocialLink): IconProp {
    return this.icons.resolve(social.icon);
  }

  trackSocial(_index: number, social: SocialLink): string {
    return social.id;
  }

  /** True while the animation is running, so the template can hide the caret when it is not. */
  get isAnimating(): boolean {
    return !this.display.isReducedMotion && this.roles.length > 0;
  }

  private restartTyping(): void {
    this.stopTyping();
    this.roleIdx = 0;
    this.charIdx = 0;
    this.isTyping = true;

    if (this.roles.length === 0) {
      this.currentRole = '';
      return;
    }

    if (this.display.isReducedMotion) {
      // No animation at all: show the primary role and leave it alone.
      this.currentRole = this.roles[0];
      return;
    }

    this.type();
  }

  private stopTyping(): void {
    if (this.typingTimer !== null) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }
  }

  private type(): void {
    const target = this.roles[this.roleIdx];
    if (!target) return;

    if (this.isTyping) {
      this.currentRole = target.slice(0, ++this.charIdx);
      if (this.charIdx >= target.length) {
        this.isTyping = false;
        this.typingTimer = window.setTimeout(() => this.type(), 2000);
        return;
      }
    } else {
      this.currentRole = target.slice(0, --this.charIdx);
      if (this.charIdx === 0) {
        this.isTyping = true;
        this.roleIdx = (this.roleIdx + 1) % this.roles.length;
      }
    }

    this.typingTimer = window.setTimeout(() => this.type(), this.isTyping ? 85 : 45);
  }
}
