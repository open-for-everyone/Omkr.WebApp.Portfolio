import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDetails } from '../../models/user-details';
import { ProfileService } from '../../services/profile/profile.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = new BehaviorSubject<boolean>(false);
  constructor(private profileService: ProfileService) { }

  login(organizationId: string, username: string, password: string): boolean {
    // Here you should implement your authentication logic, e.g., check credentials against a backend
    // For this example, we're just setting isAuthenticated to true
    this.isAuthenticated.next(true);
    console.log('user authenticated successfully!');
    console.log(password);

    // Assuming getUserDetails returns an Observable, you need to subscribe to it to get the data
    this.profileService.get(organizationId,username).subscribe((userDetails: UserDetails) => {
      // Store user data after retrieving it from the profile service
      this.storeUserData('some-token', userDetails); // Replace 'some-token' with the actual token
    });

    return true;
  }



  logout(): void {
    this.isAuthenticated.next(false);

    localStorage.removeItem('token');
    localStorage.removeItem('currentUserName');
    localStorage.removeItem('organizationId');

    console.log('user logged out successfully!');
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
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
}
