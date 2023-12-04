import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { DepartmentComponent } from './department/department.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { QualificationComponent } from './qualification/qualification.component';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { SettingComponent } from './setting/setting.component';
import { OauthComponent } from './oauth/oauth.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './general/footer/footer.component';
import { HeaderComponent } from './general/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
