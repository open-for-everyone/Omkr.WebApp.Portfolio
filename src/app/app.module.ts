import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BasicInfoComponent } from './components/setting/basic-info/basic-info.component';
import { ChangePasswordComponent } from './components/oauth/password/change-password/change-password.component';
import { QualificationComponent } from './components/setting/qualification/qualification.component';
import { BankAccountComponent } from './components/setting/bank-account/bank-account.component';
import { SettingComponent } from './components/setting/setting.component';
import { OauthComponent } from './components/oauth/oauth.component';
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
import { OtherActivityComponent } from './components/other-activity/other-activity.component';
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
import { GithubCallbackComponent } from './components/callback/github-callback/github-callback.component';
import { AuthInterceptor } from './guards/auth/interceptor/auth-interceptor.service';
import { AdminLoginComponent } from './components/admin/auth/admin-login/admin-login.component';

// AOT compilation support
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    BasicInfoComponent,
    ChangePasswordComponent,
    QualificationComponent,
    BankAccountComponent,
    SettingComponent,
    OauthComponent,
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
    OtherActivityComponent,
    CelebrationCardComponent,
    CelebrationCardDialogComponent,
    ConfettiComponent,
    FileUploadComponent,
    ConfirmDialogComponent,
    QuestionEditDialogComponent,
    GithubCallbackComponent,
    AdminLoginComponent
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
    MatChipsModule // Add this line
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
