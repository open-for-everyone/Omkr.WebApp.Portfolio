import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Subject, takeUntil } from 'rxjs';
import { DEFAULT_PROFILE } from 'src/app/models/content/site-content.defaults';
import { NavLink, SiteProfile, SocialLink } from 'src/app/models/content/site-content.model';
import { AnalyticService } from 'src/app/services/Analytics/analytic.service';
import { PortfolioContentService } from 'src/app/services/content/portfolio-content.service';
import { ProfileService } from 'src/app/services/content/profile.service';
import { ConsentService } from 'src/app/services/general/consent.service';
import { IconRegistryService } from 'src/app/services/general/icon-registry.service';
import { RuntimeConfigService } from 'src/app/services/general/runtime-config.service';
import { environment } from 'src/environments/environment';

/**
 * Site footer: social links, section shortcuts, cross-site links and the legal pages.
 *
 * It carries the section shortcuts because the footer is now rendered on every route. Reaching a
 * legal page or the CV used to be a dead end — those routes rendered no header and no footer at all,
 * so a visitor arriving from a search engine had no way into the rest of the site.
 *
 * Two smaller things fixed while rewriting: the component assigned Angular's imported `state`
 * *function* to a property and bound it as the animation state, and it logged "Footer initialized."
 * to the console on every construction.
 */
@Component({
  standalone: false,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  animations: [
    trigger('animateFooter', [
      transition(':enter', [
        query('*', [
          style({ opacity: 0, transform: 'translateY(100%)' }),
          stagger(50, [
            animate('250ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' })),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class FooterComponent implements OnInit, OnDestroy {
  profile: SiteProfile = DEFAULT_PROFILE;
  socials: SocialLink[] = [];
  navLinks: NavLink[] = [];

  readonly currentYear = new Date().getFullYear();

  private readonly destroyed$ = new Subject<void>();

  constructor(
    public analyticsService: AnalyticService,
    private consent: ConsentService,
    private profileService: ProfileService,
    private content: PortfolioContentService,
    private icons: IconRegistryService,
    private config: RuntimeConfigService,
  ) {}

  get blogUrl(): string {
    return this.config.text('url.blog', environment.blogUrl);
  }

  get adminUrl(): string {
    return this.config.text('url.identity', environment.adminUrl);
  }

  get sourceUrl(): string {
    return 'https://github.com/open-for-everyone/Omkr.WebApp.Portfolio';
  }

  ngOnInit(): void {
    this.profileService.profile$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((profile) => (this.profile = profile));

    this.profileService.footerSocials$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((socials) => (this.socials = socials));

    this.content.nav$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((links) => (this.navLinks = links.filter((link) => link.id !== 'home')));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  iconFor(social: SocialLink): IconProp {
    return this.icons.resolve(social.icon);
  }

  trackSocial(_index: number, social: SocialLink): string {
    return social.id;
  }

  trackNav(_index: number, link: NavLink): string {
    return link.id;
  }

  routerTarget(link: NavLink): string {
    return link.type === 'route' ? link.target : '/';
  }

  fragmentFor(link: NavLink): string | undefined {
    return link.type === 'section' ? link.target : undefined;
  }

  /** Reopens the consent panel so a visitor can change a choice they already made. */
  openCookieSettings(): void {
    this.consent.openPreferences();
  }
}
