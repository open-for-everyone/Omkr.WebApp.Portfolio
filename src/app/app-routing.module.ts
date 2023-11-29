import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { NavbarComponent } from './navbar/navbar.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { EmployeeComponent } from './employee/employee.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { QualificationComponent } from './qualification/qualification.component';

const routes: Routes = [
  { path: '', redirectTo: 'basic-info', pathMatch: 'full' },
  { path: 'basic-info', component: BasicInfoComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'bank-account', component: BankAccountComponent },
  { path: 'qualifications', component: QualificationComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'employee', component: EmployeeComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
