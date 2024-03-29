import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicInfoComponent } from './components/setting/basic-info/basic-info.component';
import { ChangePasswordComponent } from './components/oauth/password/change-password/change-password.component';
import { BankAccountComponent } from './components/setting/bank-account/bank-account.component';
import { QualificationComponent } from './components/setting/qualification/qualification.component';
import { SettingComponent } from './components/setting/setting.component';
import { authGuard } from './guards/auth/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/general/not-found/not-found.component';
import { OauthButtonComponent } from './components/oauth/oauth-button/oauth-button.component';
import { AdminLoginComponent } from './components/admin/auth/admin-login/admin-login.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'setting', component: SettingComponent, canActivate: [authGuard], children: [
      { path: 'basic-info', component: BasicInfoComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'bank-account', component: BankAccountComponent },
      { path: 'qualification', component: QualificationComponent },
    ]
  },
  // Lazy loading for admin module
  {
    path: 'admin',
    loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'authentication',
    loadChildren: () => import('./components/oauth/oauth.module').then(m => m.OauthModule)
  },
  {
    path: 'other',
    loadChildren: () => import('./components/other-activity/other-activity.module').then(m => m.OtherActivityModule)
  },
  {
    path: "admin-login", component: AdminLoginComponent,
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
