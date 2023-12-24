import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/guards/auth/auth.service';
import { SpotifyService } from 'src/app/services/Spotify/spotify.service';

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.css']
})
export class SpotifyComponent implements OnInit {

  constructor(private spotifyService: SpotifyService, private authService: AuthService, private route: ActivatedRoute) {
  }
  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        // Call the backend service to exchange the code for an access token
        this.spotifyService.getAccessToken().subscribe(accessToken => {
          // Store the access token and proceed with the authenticated part of your application
          localStorage.setItem('spotify_access_token', accessToken);
        });
      } else if (!this.spotifyService.isAuthenticated()) {
        this.spotifyService.redirectToSpotifyLogin();
      }
    });
  }

}
