import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OrganizationDetails } from '../abstraction/organization-details';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  private apiUrl = `${environment.awsUserApiBaseUrl}${environment.awsUserApiEndpoints.organizations}`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<OrganizationDetails[]> {

    console.log('getUserDetails endpoint: ' + this.apiUrl);
    return this.http.get<OrganizationDetails[]>(this.apiUrl);
  }
}
