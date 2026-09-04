import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { NavigationEnd, Router } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';
import { EMPTY, Subject, interval } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NavLink, SiteProfile } from 'src/app/models/content/site-content.model';
import { DEFAULT_PROFILE } from 'src/app/models/content/site-content.defaults';
import { PortfolioContentService } from 'src/app/services/content/portfolio-content.service';
import { ProfileService } from 'src/app/services/content/profile.service';
import { AnalyticService } from 'src/app/services/Analytics/analytic.service';
import { SessionService } from 'src/app/services/auth/session.service';
import { DisplayPreferencesService } from 'src/app/services/general/display-preferences.service';
import { I18nService } from 'src/app/services/general/i18n.service';
import { RuntimeConfigService } from 'src/app/services/general/runtime-config.service';
import { environment } from 'src/environments/environment';

/**
 * The site header: brand, primary navigation, contact shortcuts, display settings and the profile
 * menu.
 *
 * Several long-standing defects were fixed here rather than papered over:
 *
 * - **Navigation was broken everywhere except the home page.** Links were `href="#about"` paired
 *   with a handler that ran `router.navigate(['/home'])` when the target was missing — but there is
 *   no `/home` route (home is `''`), so the wildcard caught it and every nav click from `/resume` or
 *   a legal page landed on the 404 page. Section links are now `routerLink="/"` with a `fragment`,
 *   and the router's `anchorScrolling` does the scrolling, on the home page or coming back to it.
 * - **A one-second `setInterval` was never cleared**, so it kept ticking after the header was
 *   destroyed, forever.
 * - **`ngOnInit` ran `body.classList.remove('high-contrast')` unconditionally**, silently discarding
 *   the visitor's saved high-contrast preference on every single load.
 * - **The logo was `../../assets/images/k.png`**. Template URLs resolve against the document base,
 *   not the component folder, so with the `--base-href` the Pages build applies it did not resolve.
 * - **The WhatsApp link omitted the country code** (`wa.me/9982761929`) while the phone link beside
 *   it included it, so it opened a chat with nobody.
 *
 * Labels and destinations are content now, not markup.
 */
@Component({
  standalone: false,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('animateMenu', [
      transition(':enter', [
        query('*', [
          style({ opacity: 0, transform: 'translateY(-50%)' }),
          stagger(50, [
            animate('250ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' })),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  /** Rendered before the API answers, then replaced. */
  profile: SiteProfile = DEFAULT_PROFILE;
  navLinks: NavLink[] = [];

  loginDisplay = false;
  isNavbarCollapsed = true;
  /** Id of the section currently in view, for `aria-current` and the underline. */
  activeSection: string | null = 'home';
  scrolled = false;
  sessionCountdown = '';

  private sessionExpiry?: number;
  private readonly destroyed$ = new Subject<void>();

  constructor(
    private router: Router,
    public analyticsService: AnalyticService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    public session: SessionService,
    public i18n: I18nService,
    public display: DisplayPreferencesService,
    private profileService: ProfileService,
    private content: PortfolioContentService,
    private config: RuntimeConfigService,
  ) {}

  /** Cross-site links come from the shared runtime config, falling back to the build's values. */
  get blogUrl(): string {
    return this.config.text('url.blog', environment.blogUrl);
  }

  get adminUrl(): string {
    return this.config.text('url.identity', environment.adminUrl);
  }

  get brandName(): string {
    return this.config.text('ui.brand.name', this.profile.name);
  }

  ngOnInit(): void {
    this.profileService.profile$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((profile) => (this.profile = profile));

    this.content.nav$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((links) => (this.navLinks = links));

    this.session.isLoggedIn$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((loggedIn) => (this.loginDisplay = loggedIn));

    /*
      The countdown ticks only while a session is actually running.

      Two reasons this is a `switchMap` rather than a bare interval. The old `setInterval(…, 1000)`
      was never cleared, so it outlived the component. And a one-second timer inside the Angular zone
      triggers a change-detection pass across the whole app every second — which used to be confined
      to the home and 404 pages, but this header renders on every route now. So it runs only when
      there is a number to count down.
    */
    this.session.sessionState$
      .pipe(
        map((state) => (state.loggedIn ? state.absoluteExpiry : undefined)),
        tap((expiry) => {
          this.sessionExpiry = expiry;
          this.updateCountdown();
        }),
        switchMap((expiry) => (expiry ? interval(1000) : EMPTY)),
        takeUntil(this.destroyed$),
      )
      .subscribe(() => this.updateCountdown());

    // Close the mobile menu on navigation, or it stays open over the new page.
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroyed$),
      )
      .subscribe(() => (this.isNavbarCollapsed = true));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  // ------------------------------ navigation --------------------------------

  trackNav(_index: number, link: NavLink): string {
    return link.id;
  }

  /** Router link target for a nav entry. Section links go to the home route with a fragment. */
  routerTarget(link: NavLink): string {
    return link.type === 'route' ? link.target : '/';
  }

  /** Fragment for a section link; undefined for anything else. */
  fragmentFor(link: NavLink): string | undefined {
    return link.type === 'section' ? link.target : undefined;
  }

  onNavClick(link: NavLink): void {
    this.isNavbarCollapsed = true;
    this.analyticsService.sendAnalyticEvent(`nav_${link.id}`, 'header', link.label);

    // Already on the home page with this fragment: the router will not re-navigate, so scroll here.
    if (link.type === 'section' && this.router.url.split('#')[0] === '/') {
      this.scrollToSection(link.target);
    }
  }

  private scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({
      behavior: this.display.isReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 12;
    this.updateActiveSection();
  }

  /** Marks whichever section currently crosses the header line. */
  private updateActiveSection(): void {
    const sections = this.navLinks.filter((link) => link.type === 'section');
    let current: string | null = sections.length > 0 ? sections[0].id : null;

    for (const link of sections) {
      const element = document.getElementById(link.target);
      if (!element) continue;
      const rect = element.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        current = link.id;
        break;
      }
    }

    this.activeSection = current;
  }

  // --------------------------- display settings -----------------------------

  toggleTheme(): void {
    this.display.toggleTheme();
    this.analyticsService.sendAnalyticEvent('toggle_theme', 'header', this.display.theme);
  }

  toggleHighContrast(): void {
    this.display.toggleHighContrast();
    this.analyticsService.sendAnalyticEvent(
      'toggle_high_contrast',
      'header',
      String(this.display.isHighContrast),
    );
  }

  toggleReduceMotion(): void {
    this.display.toggleReduceMotion();
  }

  // -------------------------------- contact ---------------------------------

  get telHref(): string {
    return `tel:${this.profile.phone}`;
  }

  /** `wa.me` needs digits with the country code; {@link ProfileService} guarantees that shape. */
  get whatsAppHref(): string {
    return `https://wa.me/${this.profile.whatsapp}`;
  }

  // --------------------------------- auth -----------------------------------

  selectLanguage(code: string): void {
    this.i18n.use(code);
  }

  login(language: string): void {
    if (this.msalGuardConfig.authRequest) {
      const authRequest = { ...this.msalGuardConfig.authRequest } as RedirectRequest;
      authRequest.extraQueryParameters = { ui_locales: language };
      this.authService.loginRedirect(authRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  logout(): void {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: environment.AzureAdB2C.logoutRedirectUri,
    });
  }

  openExternal(url: string): void {
    if (!url) return;
    window.open(url, '_blank', 'noopener');
  }

  private updateCountdown(): void {
    if (!this.sessionExpiry) {
      this.sessionCountdown = '';
      return;
    }

    const msLeft = this.sessionExpiry - Date.now();
    if (msLeft <= 0) {
      this.sessionCountdown = '';
      return;
    }

    const minutes = Math.floor(msLeft / 60000);
    const seconds = Math.floor((msLeft % 60000) / 1000);
    this.sessionCountdown = `${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
  }
}
