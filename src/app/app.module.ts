import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { DepartmentComponent } from './department/department.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BasicInfoComponent } from './components/setting/basic-info/basic-info.component';
import { ChangePasswordComponent } from './components/setting/change-password/change-password.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { QualificationComponent } from './components/setting/qualification/qualification.component';
import { BankAccountComponent } from './components/setting/bank-account/bank-account.component';
import { SettingComponent } from './components/setting/setting.component';
import { OauthComponent } from './oauth/oauth.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './general/footer/footer.component';
import { HeaderComponent } from './general/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AboutComponent } from './components/home/about/about.component';
import { BannerComponent } from './components/home/banner/banner.component';
import { JobComponent } from './components/home/job/job.component';
import { ContactComponent } from './components/home/contact/contact.component';
import { HomeComponent } from './components/home/home.component';

// AOT compilation support
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    DepartmentComponent,
    BasicInfoComponent,
    ChangePasswordComponent,
    PrivacyComponent,
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
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
