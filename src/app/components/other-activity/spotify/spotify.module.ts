import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpotifyRoutingModule } from './spotify-routing.module';
import { NowPlayingComponent } from './now-playing/now-playing.component';


@NgModule({
  declarations: [
    NowPlayingComponent
  ],
  imports: [
    CommonModule,
    SpotifyRoutingModule
  ]
})
export class SpotifyModule { }
