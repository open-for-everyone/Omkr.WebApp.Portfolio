import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OauthComponent } from './oauth.component';
import { ForgotPasswordComponent } from './password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './password/reset-password/reset-password.component';
import { LoginComponent } from '../oauth/login/login.component';
import { SignupComponent } from '../oauth/signup/signup.component';

const routes: Routes = [
  {
    "path": "",
    component: OauthComponent,
    children: [
      { path: "forgot-password", component: ForgotPasswordComponent },
      { path: "reset-password", component: ResetPasswordComponent },
      { path: "login", component: LoginComponent },
      { path: "signup", component: SignupComponent }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OauthRoutingModule { }
