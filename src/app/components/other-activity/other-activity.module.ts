import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OtherActivityRoutingModule } from './other-activity-routing.module';
import { SpotifyComponent } from './spotify/spotify.component';


@NgModule({
  declarations: [
    SpotifyComponent
  ],
  imports: [
    CommonModule,
    OtherActivityRoutingModule
  ]
})
export class OtherActivityModule { }
