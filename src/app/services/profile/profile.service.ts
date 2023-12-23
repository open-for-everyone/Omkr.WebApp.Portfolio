import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDetails } from '../../models/user-details';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {

  private apiUrl='';

  constructor(private http: HttpClient) { }

  get(organizationId: string, userName: string): Observable<UserDetails> {
    this.apiUrl=`${environment.awsUserApiBaseUrl}${environment.awsUserApiEndpoints.getUser}`;
    this.apiUrl = this.apiUrl.replace("{orgId}", (organizationId) ?? '')
      .replace("{username}", (userName) ?? '');

    console.log('getUserDetails endpoint: ' + this.apiUrl);
    return this.http.get<UserDetails>(this.apiUrl);
  }
  getOrgUsers(organizationId: string): Observable<UserDetails[]> {
    this.apiUrl=`${environment.awsUserApiBaseUrl}${environment.awsUserApiEndpoints.getOrgUsers}`;

    this.apiUrl = this.apiUrl.replace("{orgId}", (organizationId) ?? '');

    console.log('getUserDetails endpoint: ' + this.apiUrl);
    return this.http.get<UserDetails[]>(this.apiUrl);
  }

  getAllUsers(): Observable<UserDetails[]> {
    this.apiUrl=`${environment.awsUserApiBaseUrl}${environment.awsUserApiEndpoints.getAllUsers}`;

    console.log('getUserDetails endpoint: ' + this.apiUrl);
    return this.http.get<UserDetails[]>(this.apiUrl);
  }

  insert(userDetails: UserDetails): Observable<unknown> {
    this.apiUrl=`${environment.awsUserApiBaseUrl}${environment.awsUserApiEndpoints.user}`;
    console.log('insertUserDetails endpoint: ' + this.apiUrl);

    // Return the observable so the caller can subscribe to it
    return this.http.post(this.apiUrl, userDetails);
  }
}
