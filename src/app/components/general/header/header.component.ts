import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { FormControl } from '@angular/forms';
import { AnalyticService } from 'src/app/services/Analytics/analytic.service';
import { Subject } from 'rxjs';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, RedirectRequest } from '@azure/msal-browser';

@Component({
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
  languages: { code: string; name: string }[] = [];
  selectedLanguage = 'en'; // Default language

  // Declare a variable to hold the authentication status
  responsiveMenuVisible = false;
  pageYPosition = 0;
  cvName = "";
  languageFormControl: FormControl = new FormControl();

  constructor(private router: Router, public analyticsService: AnalyticService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration, private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {
    // this.msalBroadcastService.msalSubject$.subscribe((event: EventMessage) => {
    //   if (event.eventType === EventType.LOGIN_SUCCESS) {
    //     console.log('Login success:', event);
    //   } else if (event.eventType === EventType.LOGIN_FAILURE) {
    //     console.error('Login failure:', event);
    //   } else if (event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
    //     console.log('Token acquired:', event);
    //   } else if (event.eventType === EventType.ACQUIRE_TOKEN_FAILURE) {
    //     console.error('Token acquisition failed:', event);
    //   }
    // });
  }
  ngOnInit(): void {
    console.log('navbar page loaded');
    this.setLoginDisplay();
  }


  isNavbarCollapsed = true;

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

  downloadCV() {
    // app url
    const url = window.location.href;

    // Open a new window with the CV
    window.open(url + "/../assets/cv/" + this.cvName, "_blank");
  }

  @HostListener('window:scroll', ['$event'])
  getScrollPosition(event: Event) {
    this.pageYPosition = window.pageYOffset;
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

  logout() {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: 'http://localhost:4200'
    });
    localStorage.removeItem('accountId');
  }

  setLoginDisplay() {
    // total accounts
    console.log("total accounts: ", this.authService.instance.getAllAccounts().length);
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    // Add your code here
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
