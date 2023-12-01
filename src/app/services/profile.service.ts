import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'https://tzbmrk30i1.execute-api.eu-west-1.amazonaws.com/Prod/api/user/2'; // Replace with your actual URL

  constructor(private http: HttpClient) {}

  getUserDetails(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
