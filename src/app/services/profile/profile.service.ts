import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDetails } from '../../models/user-details';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {

  private apiBaseUrl = `${environment.awsUserApiBaseUrl}${environment.awsUserApiEndpoints.getUser}`;
  private apiUrl=`${environment.awsUserApiBaseUrl}${environment.awsUserApiEndpoints.user}`;
  constructor(private http: HttpClient) { }

  get(organizationId: string, userName: string): Observable<UserDetails> {
    this.apiBaseUrl = this.apiBaseUrl.replace("{orgId}", (organizationId) ?? '')
      .replace("{username}", (userName) ?? '');

    console.log('getUserDetails endpoint: ' + this.apiBaseUrl);
    return this.http.get<UserDetails>(this.apiBaseUrl);
  }

  insert(userDetails: UserDetails): Observable<unknown> {
    console.log('insertUserDetails endpoint: ' + this.apiUrl);

    // Return the observable so the caller can subscribe to it
    return this.http.post(this.apiUrl, userDetails);
  }
}
