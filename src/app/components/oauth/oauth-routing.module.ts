import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OauthComponent } from './oauth.component';
import { ForgotPasswordComponent } from './password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './password/reset-password/reset-password.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LoginSuccessComponent } from './login-success/login-success.component';
import { LoginFailureComponent } from './login-failure/login-failure.component';
import { GithubCallbackComponent } from '../callback/github-callback/github-callback.component';

const routes: Routes = [
  {
    "path": "",
    component: OauthComponent,
    children: [
      { path: "forgot-password", component: ForgotPasswordComponent },
      { path: "reset-password", component: ResetPasswordComponent },
      { path: "login", component: LoginComponent },
      { path: "signup", component: SignupComponent },
      { path: 'login-success', component: LoginSuccessComponent },
      { path: 'login-failure', component: LoginFailureComponent },
      { path: 'github-callback', component: GithubCallbackComponent },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OauthRoutingModule { }
