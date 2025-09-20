import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/general/not-found/not-found.component';
// import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  // Admin module is currently not present; route disabled
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
