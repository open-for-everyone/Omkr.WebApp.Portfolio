import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/general/footer/footer.component';
import { HeaderComponent } from './components/general/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AboutComponent } from './components/home/about/about.component';
import { BannerComponent } from './components/home/banner/banner.component';
import { JobComponent } from './components/home/job/job.component';
import { ContactComponent } from './components/home/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/general/not-found/not-found.component';
import { ProgressBarComponent } from './components/general/progress-bar/progress-bar.component';
import { VideoComponent } from './components/home/video/video.component';
import { PageViewCounterComponent } from './components/general/counter/page-view-counter/page-view-counter.component';
import { MatIconModule } from '@angular/material/icon';
import { CelebrationCardComponent } from './components/general/celebration-card/celebration-card.component';
import { MatCardModule } from '@angular/material/card';
import { CelebrationCardDialogComponent } from './components/general/celebration-card-dialog/celebration-card-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfettiComponent } from './components/general/confetti/confetti.component';
import { FileUploadComponent } from './components/general/file/file-upload/file-upload.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from './components/general/dialog/confirm-dialog/confirm-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QuestionEditDialogComponent } from './components/general/dialog/topic/question-edit-dialog/question-edit-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';

// Import MSAL and MSAL browser libraries.
import { MSAL_INTERCEPTOR_CONFIG, MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent, MsalService } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';

// Import the Azure AD B2C configuration
import { msalConfig } from './auth-config';
import { MSALInterceptorConfigFactory } from './interceptor-config';

export function initializeMsal(msalService: MsalService) {
  return () => msalService.initialize();
}

// AOT compilation support
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    AboutComponent,
    BannerComponent,
    ContactComponent,
    JobComponent,
    HomeComponent,
    NotFoundComponent,
    ProgressBarComponent,
    VideoComponent,
    //Remove the following line:
    PageViewCounterComponent,
    CelebrationCardComponent,
    CelebrationCardDialogComponent,
    ConfettiComponent,
    FileUploadComponent,
    ConfirmDialogComponent,
    QuestionEditDialogComponent,
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
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatChipsModule, // Add this line
    MatProgressBarModule,
    MatChipsModule, // Add this line
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
    /* Changes start here. */
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeMsal,
      deps: [MsalService],
      multi: true
    },
    // {
    //   provide: MSAL_INTERCEPTOR_CONFIG,
    //   useFactory: MSALInterceptorConfigFactory,
    // },

    MsalGuard
    /* Changes end here. */
  ],
  bootstrap: [
    AppComponent,
    /* Changes start here. */
    MsalRedirectComponent
    /* Changes end here. */
  ]
})
export class AppModule { }
