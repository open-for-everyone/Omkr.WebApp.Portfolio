import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { OauthRoutingModule } from './oauth-routing.module';
import { ForgotPasswordComponent } from './password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './password/reset-password/reset-password.component';
import { LoginComponent } from './login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { SignupComponent } from './signup/signup.component';
import { OauthButtonComponent } from './oauth-button/oauth-button.component';
import { LoginSuccessComponent } from './login-success/login-success.component';
import { LoginFailureComponent } from './login-failure/login-failure.component';

@NgModule({
  declarations: [
    ForgotPasswordComponent,
    ResetPasswordComponent,
    LoginComponent,
    SignupComponent,
    OauthButtonComponent,
    LoginSuccessComponent,
    LoginFailureComponent
  ],
  imports: [
    CommonModule,
    OauthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
  ]
})
export class OauthModule { }
