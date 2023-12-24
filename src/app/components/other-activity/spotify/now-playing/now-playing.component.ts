import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/Spotify/spotify.service';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate(2000)),
    ]),
  ]
})
export class NowPlayingComponent implements OnInit{

  currentTrack: any = null;

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit() {
    this.spotifyService.getCurrentlyPlaying().subscribe(
      data => {
        this.currentTrack = data.item; // The structure includes information about the track
      },
      error => {
        console.error(error);
      }
    );
  }
}
