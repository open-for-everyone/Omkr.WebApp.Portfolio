import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
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
    OtherActivityComponent
  ],
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
