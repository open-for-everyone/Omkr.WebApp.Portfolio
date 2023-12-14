import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VisitorDetail } from 'src/app/models/admin/visitor/visitor-detail';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  apiUrl="";
  constructor(private http: HttpClient) { }

  getAll(): Observable<VisitorDetail[]> {
    this.apiUrl = `${environment.awsUserApiBaseUrl}${environment.visitorApiEndpoints.visitors}`;

    console.log('getUserVisitors endpoint: ' + this.apiUrl);
    return this.http.get<VisitorDetail[]>(this.apiUrl);
  }
}
