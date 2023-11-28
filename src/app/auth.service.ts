import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor() { }

  login(username: string, password: string): boolean {
    // Here you should implement your authentication logic, e.g., check credentials against a backend
    // For this example, we're just setting isAuthenticated to true
    this.isAuthenticated.next(true);
    console.log('user authenticated successfully!');
    return true;
  }



  logout(): void {
    console.log('user logged out successfully!');
    this.isAuthenticated.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }
}
