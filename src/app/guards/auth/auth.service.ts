import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDetails } from '../../models/user-details';
import { ProfileService } from '../../services/profile/profile.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OAuthService, AuthConfig, OAuthSuccessEvent } from 'angular-oauth2-oidc';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private isAuthenticated = new BehaviorSubject<boolean>(false);
  private authState = new BehaviorSubject<boolean>(this.hasValidToken());
  private readonly tokenStorageKey = 'access_token';

  constructor(private profileService: ProfileService, private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute) {
  }
  isAuthenticated() {
    return this.authState.asObservable();
  }
  saveAccessToken(token: string) {
    localStorage.setItem(this.tokenStorageKey, token);
    this.authState.next(true);
  }
  getAccessToken() {
    return localStorage.getItem(this.tokenStorageKey);
  }
  hasValidToken(): boolean {
    const token = this.getAccessToken();
    // Here you would check if the token is valid, e.g., not expired
    // For simplicity, we assume a token exists means it's valid
    return !!token;
  }

  public login(organizationId: string, username: string, password: string): boolean {
    // Here you should implement your authentication logic, e.g., check credentials against a backend
    // For this example, we're just setting isAuthenticated to true
    this.authState.next(true);
    console.log('user authenticated successfully!');
    console.log(password);

    // Assuming getUserDetails returns an Observable, you need to subscribe to it to get the data
    this.profileService.get(organizationId, username).subscribe((userDetails: UserDetails) => {
      // Store user data after retrieving it from the profile service
      this.storeUserData('some-token', userDetails); // Replace 'some-token' with the actual token
    });

    return true;
  }



  logout(): void {
    // this.isAuthenticated.next(false);
    this.authState.next(false);

    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUserName');
    localStorage.removeItem('organizationId');

    console.log('user logged out successfully!');
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated();
    // return this.isAuthenticated.asObservable();
  }

  storeUserData(token: string, user: UserDetails) {
    localStorage.setItem('token', token);
    localStorage.setItem('currentUserName', user.userName);
    localStorage.setItem('organizationId', user.organizationId);
    // ... store other necessary information
  }

  getCurrentUserName(): string | null {
    return localStorage.getItem('currentUserName');
  }

  getOrganizationId(): string | null {
    return localStorage.getItem('organizationId');
  }

  // External OAuth login
  loginWithOAuth(provider: string): void {
    // Redirect to the backend endpoint that initiates the OAuth process
    // The backend should redirect to the OAuth provider's login page
    const oauthUrl = `/auth/${provider.toLowerCase()}`;
    window.location.href = oauthUrl;
  }

  public handleAuthentication(): void {
    // Get the code from the URL query parameters
    this.route.queryParams.subscribe(params => {
      const code = params['code'];

      if (code) {
        this.sendCodeToBackend(code);
      } else {
        // Handle the case where there is no code in the query parameters
      }
    });
  }
  private sendCodeToBackend(code: string): void {
    const apiUrl = `${environment.awsUserApiBaseUrl}`;
    this.http.post<any>(`${apiUrl}/github/callback`, { code }).subscribe(
      response => {
        // The backend should return an object containing the access token or the session info
        // Save the session info as needed
        // Redirect or perform actions as needed after successful login
        console.log('response from github callback:');
        console.log(response);

        this.router.navigate(['/index']); // Redirect to dashboard or other component
      },
      err => {
        console.error('Error exchanging code for token:', err);
        // Handle the error
      }
    );
  }

  public initiateGithubLogin(): void {
    const clientId = environment.github.clientId;
    const redirectUri = environment.github.redirectUri;
    const scope = 'read:user'; // Adjust the scope according to your needs
    const state = this.generateRandomString(); // A random string to prevent CSRF attacks

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

    window.location.href = githubAuthUrl;
  }
  private generateRandomString(): string {
    const array = new Uint32Array(10);
    window.crypto.getRandomValues(array);
    return array.join('');
  }

}
