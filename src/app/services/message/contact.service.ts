import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactMessage } from 'src/app/models/general/contact-message';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly baseUrl = environment.contactApiBaseUrl;
  private readonly submitPath = environment.contactApiEndpoints?.submit ?? '/api/contact';

  constructor(private http: HttpClient) {}

  submit(message: ContactMessage): Observable<{ success: boolean; message?: string }> {
    const url = `${this.baseUrl}${this.submitPath}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<{ success: boolean; message?: string }>(url, message, { headers });
  }
}
