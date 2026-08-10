import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { FormControl } from '@angular/forms';
import { AnalyticService } from 'src/app/services/Analytics/analytic.service';
import { Observable, Subject } from 'rxjs';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';
import { FileService } from 'src/app/services/file/file.service';
import { DOCUMENT } from '@angular/common';
import { Download } from 'src/app/services/file/Download';
import { SessionService } from 'src/app/services/auth/session.service';
import { I18nService } from 'src/app/services/general/i18n.service';

@Component({
  standalone: false,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger("animateMenu", [
      transition(":enter", [
        query("*", [
          style({ opacity: 0, transform: "translateY(-50%)" }),
          stagger(50, [
            animate(
              "250ms cubic-bezier(0.35, 0, 0.25, 1)",
              style({ opacity: 1, transform: "none" }))
          ])
        ])
      ])
    ])
  ]
})

export class HeaderComponent implements OnInit, OnDestroy {
  // Start Auth
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  // End Auth
  /*
    The language list is no longer a field here: it comes from the localisation service, which gets it
    from the API. `i18n.locales` / `i18n.locale` / `i18n.showPicker` are what the template reads.
  */

  // Declare a variable to hold the authentication status
  responsiveMenuVisible = false;
  pageYPosition = 0;
  cvName = "";
  cvUrl="";
  blogUrl = environment.blogUrl;
  adminUrl = environment.adminUrl;
  languageFormControl: FormControl = new FormControl();
  // (A `slides` field built a resume URL against the retired dev-api-v2 host. Nothing read it — the
  // resume comes from the admin CMS now — so it has been removed rather than left to mislead.)

  download$!: Observable<Download>;
  isLight = false;
  // Removed high contrast toggle per user request
  // isHighContrast retained only if other parts rely on body class; currently not toggled
  isHighContrast = false;

  sessionCountdown: string = '';
  sessionExpiry: number | undefined;
  sessionSub?: any;
  constructor(private router: Router, public analyticsService: AnalyticService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration, private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private downloads: FileService,
    @Inject(DOCUMENT) private document: Document,
    public session: SessionService,
    public i18n: I18nService
  ) {}

  /** Switches language. The service persists the choice and reloads the catalogue. */
  selectLanguage(code: string): void {
    this.i18n.use(code);
  }
  ngOnInit(): void {
    this.session.isLoggedIn$.subscribe(v => this.loginDisplay = v);
    // Subscribe to sessionState$ for countdown
    this.sessionSub = this.session.sessionState$.subscribe(st => {
      if (st.loggedIn && st.absoluteExpiry) {
        this.sessionExpiry = st.absoluteExpiry;
        this.updateCountdown();
      } else {
        this.sessionCountdown = '';
        this.sessionExpiry = undefined;
      }
    });
    setInterval(() => this.updateCountdown(), 1000);
    const theme = (localStorage.getItem('theme') as 'dark'|'light') || 'dark';
    this.setTheme(theme);
    this.document.body.classList.remove('high-contrast');
  }

  updateCountdown() {
    if (!this.sessionExpiry) {
      this.sessionCountdown = '';
      return;
    }
    const msLeft = this.sessionExpiry - Date.now();
    if (msLeft <= 0) {
      this.sessionCountdown = '';
      return;
    }
    const min = Math.floor(msLeft / 60000);
    const sec = Math.floor((msLeft % 60000) / 1000);
    this.sessionCountdown = `${min}:${sec.toString().padStart(2, '0')} remaining`;
  }


  isNavbarCollapsed = true;
  activeSection: 'home'|'about'|'skills'|'experience'|'projects'|'contact'|null = null;

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }


  scroll(elementId: string) {
    if (document.getElementById(elementId)) {
      document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigate(['/home']).then(() => document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' }));
    }
    this.responsiveMenuVisible = false;
  }

  scrollTop(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll')
  getScrollPosition() {
    this.pageYPosition = window.pageYOffset;
    this.updateActiveSection();
  }

  login(language: string) {
    if (this.msalGuardConfig.authRequest) {
      const authRequest = { ...this.msalGuardConfig.authRequest } as RedirectRequest;
      authRequest.extraQueryParameters = {
        ui_locales: language // Set the language parameter
      };
      this.authService.loginRedirect(authRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  private updateActiveSection(){
    const sections = [
      { id: 'about', name: 'about' as const },
      { id: 'skills', name: 'skills' as const },
      { id: 'experience', name: 'experience' as const },
      { id: 'projects', name: 'projects' as const },
      { id: 'contact', name: 'contact' as const }
    ];
    let current: typeof this.activeSection = 'home';
    for(const s of sections){
      const el = document.getElementById(s.id);
      if(!el) continue;
      const rect = el.getBoundingClientRect();
      if(rect.top <= 120 && rect.bottom >= 120){
        current = s.name;
        break;
      }
    }
    this.activeSection = current;
  }

  logout() {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: environment.AzureAdB2C.logoutRedirectUri
    });
  }

  // setLoginDisplay() { /* replaced by session subscription */ }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    if (this.sessionSub) this.sessionSub.unsubscribe();
  }

  download({ name, url }: { name: string, url: string }) {
    this.downloads.getUrl(url).subscribe((url) => {
      this.download$ = this.downloads.download(url, name)
     });
  }

  // Theme toggle
  toggleTheme(){
    const current = localStorage.getItem('theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    this.setTheme(next);
  }

  private setTheme(mode: 'dark'|'light'){
    const body = this.document.body;
    body.classList.toggle('light', mode === 'light');
    body.classList.toggle('light-theme', mode === 'light');
    body.classList.toggle('dark-theme', mode === 'dark');
    this.isLight = mode === 'light';
  }

  // toggleHighContrast removed as per duplication cleanup

  openExternal(url: string){
    if(!url) return;
    window.open(url, '_blank', 'noopener');
  }
}
