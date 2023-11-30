import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { NavbarComponent } from './navbar/navbar.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { QualificationComponent } from './qualification/qualification.component';
import { SettingComponent } from './setting/setting.component';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'setting', redirectTo: 'setting/basic-info', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },

  { path: 'setting', component: SettingComponent, canActivate: [authGuard], children: [
    { path: 'basic-info', component: BasicInfoComponent },
    { path: 'change-password', component: ChangePasswordComponent },
    { path: 'bank-account', component: BankAccountComponent },
    { path: 'qualification', component: QualificationComponent },
  ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
