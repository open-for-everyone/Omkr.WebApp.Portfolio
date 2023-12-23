import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatMessage } from 'src/app/models/admin/chat/message';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  apiUrl = "";
  constructor(private http: HttpClient ) {}

  // Get messages from the server
  getMessages(orgId:string,fromUser:string, toUser:string): Observable<ChatMessage[]> {
    this.apiUrl = `${environment.awsUserApiBaseUrl}${environment.messageApiEndpoints.getMessages}`;
    this.apiUrl = this.apiUrl.replace("{orgId}", (orgId) ?? '')
      .replace("{fromUserId}", (fromUser) ?? '')
      .replace("{toUserId}", (toUser) ?? '');

    console.log('getMessages endpoint: ' + this.apiUrl);
    return this.http.get<ChatMessage[]>(this.apiUrl);
  }

  // Send a new message to the server
  sendMessage(message: ChatMessage): Observable<ChatMessage> {
    this.apiUrl = `${environment.awsUserApiBaseUrl}${environment.messageApiEndpoints.createMessage}`;

    console.log('sendMessage endpoint: ' + this.apiUrl);
    return this.http.post<ChatMessage>(this.apiUrl, message);
  }
}
