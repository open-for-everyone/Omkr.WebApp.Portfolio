import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatMessage } from 'src/app/models/admin/chat/message';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private apiUrl = `${environment.awsUserApiBaseUrl}${environment.messageApiEndpoints.message}`;
  constructor(private http: HttpClient ) {}

  // Get messages from the server
  getMessages(orgId:string,userName:string): Observable<ChatMessage[]> {
    this.apiUrl = this.apiUrl.replace("{orgId}", (orgId) ?? '')
      .replace("{userName}", (userName) ?? '');

    console.log('getMessages endpoint: ' + this.apiUrl);
    return this.http.get<ChatMessage[]>(this.apiUrl);
  }

  // Send a new message to the server
  sendMessage(message: ChatMessage): Observable<ChatMessage> {
    this.apiUrl = this.apiUrl.replace("{orgId}", (message.organizationId) ?? '')
               .replace("{userName}", (message.userName) ?? '');

    console.log('sendMessage endpoint: ' + this.apiUrl);
    return this.http.post<ChatMessage>(this.apiUrl, message);
  }
}
