import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ApiTranslateLoader } from './services/general/api-translate.loader';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/general/footer/footer.component';
import { HeaderComponent } from './components/general/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AboutComponent } from './components/home/about/about.component';
import { BannerComponent } from './components/home/banner/banner.component';
import { ContactComponent } from './components/home/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/general/not-found/not-found.component';
import { ProgressBarComponent } from './components/general/progress-bar/progress-bar.component';
import { VideoComponent } from './components/home/video/video.component';
import { PageViewCounterComponent } from './components/general/counter/page-view-counter/page-view-counter.component';
import { MaterialModule } from './material.module';
import { ConfettiComponent } from './components/general/confetti/confetti.component';
import { RevealDirective } from './directives/reveal.directive';
// Removed individual Material imports in favor of shared MaterialModule

// Import MSAL and MSAL browser libraries.
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent, MsalService } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';

// Import the Azure AD B2C configuration
import { msalConfig } from './auth-config';
import { MSALInterceptorConfigFactory } from './interceptor-config';
import { getSaver, SAVER } from './services/file/saver.provider';
import { SkillsComponent } from './components/home/skills/skills.component';
import { ExperienceComponent } from './components/home/experience/experience.component';
import { ProjectsCarouselComponent, ProjectDialogComponent } from './components/home/projects/projects-carousel.component';
import { CommandPaletteComponent } from './components/general/command-palette/command-palette.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { PrivacyPolicyComponent } from './components/general/legal/privacy-policy/privacy-policy.component';
import { TermsComponent } from './components/general/legal/terms/terms.component';
import { CookiePolicyComponent } from './components/general/legal/cookie-policy/cookie-policy.component';
import { DisclaimerComponent } from './components/general/legal/disclaimer/disclaimer.component';
import { CookieConsentComponent } from './components/general/cookie-consent/cookie-consent.component';
import { RobotsComponent } from './components/general/robots/robots.component';
import { SitemapComponent } from './components/general/sitemap/sitemap.component';
import { ResumeComponent } from './components/general/resume/resume.component';
import { SessionTimeoutDialogComponent } from './components/general/session-timeout-dialog/session-timeout-dialog.component';

export function initializeMsal(msalService: MsalService) {
  return () => msalService.initialize();
}

/**
 * Feeds ngx-translate from the identity provider's catalogue instead of `assets/i18n/*.json`, so this
 * site's text is a database edit rather than a redeploy — and so it gets Hindi for free. The bundled
 * JSON is still merged underneath as an offline base, so an API outage renders real English rather than
 * raw key names. See {@link ApiTranslateLoader}.
 *
 * AOT needs an exported factory function, hence this rather than a `useClass`.
 */
export function ApiTranslateLoaderFactory(http: HttpClient): TranslateLoader {
  return new ApiTranslateLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    AboutComponent,
    BannerComponent,
    ContactComponent,
    HomeComponent,
    NotFoundComponent,
    ProgressBarComponent,
    VideoComponent,
    ConfettiComponent,
    SkillsComponent,
    ExperienceComponent,
    ProjectsCarouselComponent,
    ProjectDialogComponent,
    PageViewCounterComponent,
  CommandPaletteComponent,
  SafeUrlPipe,
  PrivacyPolicyComponent,
  TermsComponent,
  CookiePolicyComponent,
  DisclaimerComponent,
  CookieConsentComponent,
  RobotsComponent,
  SitemapComponent,
  ResumeComponent,
  SessionTimeoutDialogComponent,
  RevealDirective,
  ],
  // ...

  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: ApiTranslateLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MaterialModule,
    // Initiate the MSAL library with the MSAL configuration object
    MsalModule.forRoot(new PublicClientApplication(msalConfig),
      {
        // The routing guard configuration.
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ['openid', 'profile', 'offline_access']
        }
      },
      MSALInterceptorConfigFactory()
    )
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeMsal,
      deps: [MsalService],
      multi: true
    },
    MsalGuard,
    {provide: SAVER, useFactory: getSaver}
  ],
  bootstrap: [
    AppComponent,
    MsalRedirectComponent
  ]
})
export class AppModule { }
