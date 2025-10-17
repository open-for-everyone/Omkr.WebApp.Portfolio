import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  EpfoLoginRequest,
  EpfoLoginResponse
} from '../../models/epfo/epfo-data';

@Injectable({
  providedIn: 'root'
})
export class EpfoAuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for existing token on initialization
    const storedToken = this.getStoredToken();
    if (storedToken) {
      this.tokenSubject.next(storedToken);
      this.isAuthenticatedSubject.next(true);
    }
  }

  /**
   * Login to EPFO portal
   */
  login(request: EpfoLoginRequest): Observable<EpfoLoginResponse> {
    const url = `${environment.awsUserApiBaseUrl}/${environment.epfoApiEndpoints.login}`;
    
    return this.http.post<EpfoLoginResponse>(url, request).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  /**
   * Logout from EPFO portal
   */
  logout(): void {
    localStorage.removeItem('epfo_token');
    this.tokenSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value && !!this.getToken();
  }

  /**
   * Store token in localStorage
   */
  private setToken(token: string): void {
    localStorage.setItem('epfo_token', token);
    this.tokenSubject.next(token);
  }

  /**
   * Retrieve token from localStorage
   */
  private getStoredToken(): string | null {
    return localStorage.getItem('epfo_token');
  }

  /**
   * Get HTTP headers with authentication token
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }
}
