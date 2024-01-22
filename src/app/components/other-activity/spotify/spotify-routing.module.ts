import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NowPlayingComponent } from './now-playing/now-playing.component';
import { SpotifyComponent } from './spotify.component';

const routes: Routes = [
  {
    path: "", component: SpotifyComponent, children: [
      {
        path: "now-playing",
        component: NowPlayingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpotifyRoutingModule { }
