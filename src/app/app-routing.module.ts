import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/general/not-found/not-found.component';
import { PrivacyPolicyComponent } from './components/general/legal/privacy-policy/privacy-policy.component';
import { TermsComponent } from './components/general/legal/terms/terms.component';
import { CookiePolicyComponent } from './components/general/legal/cookie-policy/cookie-policy.component';
import { DisclaimerComponent } from './components/general/legal/disclaimer/disclaimer.component';
// import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', data: { title: 'Keshav Singh — Portfolio' } },
  { path: 'privacy-policy', component: PrivacyPolicyComponent, data: { title: 'Privacy Policy — Keshav Singh' } },
  { path: 'terms', component: TermsComponent, data: { title: 'Terms & Conditions — Keshav Singh' } },
  { path: 'cookie-policy', component: CookiePolicyComponent, data: { title: 'Cookie Policy — Keshav Singh' } },
  { path: 'disclaimer', component: DisclaimerComponent, data: { title: 'Disclaimer — Keshav Singh' } },
  // Admin module is currently not present; route disabled
  { path: '404', component: NotFoundComponent, data: { title: 'Page Not Found — Keshav Singh' } },
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
