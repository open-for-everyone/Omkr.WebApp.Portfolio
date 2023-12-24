import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/guards/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private accessToken: string | null = null;
  private apiUrl = ''; // Endpoint to get auth URL from your backend

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
    this.accessToken = localStorage.getItem('spotify_access_token');
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  redirectToSpotifyLogin(): void {
    this.apiUrl = `${environment.awsUserApiBaseUrl}${environment.spotifyApiEndpoints.authUrl}`;
    this.apiUrl = this.apiUrl.replace("{orgId}", (this.authService.getOrganizationId()) ?? '')
    .replace("{userName}", (this.authService.getCurrentUserName()) ?? '');

    console.log('authUrl endpoint: ' + this.apiUrl);

    // this.http.get<{ authUrl: string }>(this.apiUrl).subscribe(response => {
    //   window.location.href = response.authUrl; // Redirect to Spotify's login page
    // });
    this.getAuthUrl().subscribe(authUrl => {
      window.location.href = authUrl; // Redirect to Spotify's login page
    });
  }
  getAuthUrl(): Observable<string> {
    return this.http.get(this.apiUrl, { responseType: 'text' }); // Set responseType to 'text'
  }

  getAccessToken(): Observable<string> {
    this.apiUrl = `${environment.awsUserApiBaseUrl}${environment.spotifyApiEndpoints.accessToken}`;
    this.apiUrl = this.apiUrl.replace("{orgId}", (this.authService.getOrganizationId()) ?? '')
    .replace("{userName}", (this.authService.getCurrentUserName()) ?? '');

    return this.http.get(this.apiUrl, { responseType: 'text' }); // Set responseType to 'text'
  }
}
