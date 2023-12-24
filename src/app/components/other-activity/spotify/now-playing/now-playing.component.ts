import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/guards/auth/auth.service';
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

  constructor(private spotifyService: SpotifyService, private authService: AuthService, private route: ActivatedRoute) {
}


  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        console.log('Code:', code);
        // Call the backend service to exchange the code for an access token
        this.spotifyService.getToken().subscribe(accessToken => {
          console.log('Access token:', accessToken);
          console.log('Authenticated:', this.spotifyService.isAuthenticated());
          // Store the access token and proceed with the authenticated part of your application
          localStorage.setItem('spotify_access_token', accessToken);

          this.spotifyService.getCurrentlyPlaying().subscribe(
            data => {
              this.currentTrack = data.item; // The structure includes information about the track
            },
            error => {
              console.error(error);
            }
          );

        });
      } else if (!this.spotifyService.isAuthenticated()) {
        console.log('Not authenticated');
        this.spotifyService.redirectToSpotifyLogin();
      }
    });
  }
}
