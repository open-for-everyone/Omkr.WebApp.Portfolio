import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EnvironmentProviders, Provider } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';
import {
  provideTranslateLoader,
  provideTranslateService,
  TranslateNoOpLoader,
} from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';
import { SessionService } from 'src/app/services/auth/session.service';

/**
 * Shared TestBed wiring.
 *
 * The specs in this project were CLI scaffolds that declared a component and nothing else. That was
 * already failing before these components gained any new dependencies: `HeaderComponent` injects
 * `MSAL_GUARD_CONFIG` and `MsalService`, neither of which a bare `declarations: [...]` provides, so
 * the suite raised `NullInjectorError` rather than asserting anything.
 *
 * Everything here is a stub. These are smoke tests — they check a component constructs and its
 * template binds — so nothing should reach a network, a real MSAL instance, or a real router.
 */

/** MSAL, stubbed. Constructing the real client needs a browser crypto context and a live authority. */
export function provideMsalStubs(): Provider[] {
  return [
    {
      provide: MSAL_GUARD_CONFIG,
      useValue: { interactionType: InteractionType.Redirect, authRequest: { scopes: [] } },
    },
    {
      provide: MsalService,
      useValue: {
        instance: { getAllAccounts: () => [] },
        initialize: () => of(undefined),
        loginRedirect: () => undefined,
        logoutRedirect: () => undefined,
      },
    },
    {
      provide: MsalBroadcastService,
      useValue: { msalSubject$: EMPTY, inProgress$: EMPTY },
    },
    {
      provide: SessionService,
      useValue: {
        isLoggedIn$: of(false),
        sessionState$: of({ loggedIn: false, inactivityWarningVisible: false }),
      },
    },
  ];
}

/**
 * The providers nearly every component in this app needs: HTTP (mocked), routing, translations and
 * animations turned off.
 *
 * The return type admits `EnvironmentProviders` as well as `Provider`, because that is what
 * `provideHttpClient` and `provideRouter` return.
 */
export function provideCommonTestServices(): (Provider | EnvironmentProviders)[] {
  return [
    provideHttpClient(),
    provideHttpClientTesting(),
    provideRouter([]),
    provideNoopAnimations(),
    ...provideTranslateService({
      // A no-op loader keeps specs off the network; components fall back to their compiled-in
      // defaults, which is exactly the path worth smoke-testing.
      loader: provideTranslateLoader(TranslateNoOpLoader),
    }),
  ];
}
