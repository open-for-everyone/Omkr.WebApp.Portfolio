import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtherActivityComponent } from './other-activity.component';
import { SpotifyComponent } from './spotify/spotify.component';

const routes: Routes = [{
  path: "", component: OtherActivityComponent, children: [
    {
      path: "spotify",
      loadChildren: () => import('./spotify/spotify.module').then(m => m.SpotifyModule)
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherActivityRoutingModule { }
