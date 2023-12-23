import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message/message.service';
import { AuthService } from 'src/app/guards/auth/auth.service';
import { ChatMessage } from 'src/app/models/admin/chat/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: ChatMessage[] = []; // Use ChatMessage type for the array
  newMessage = '';
  organizationId = this.authService.getOrganizationId();
  userName = this.authService.getCurrentUserName();

  constructor(private chatService: MessageService, private authService: AuthService) {}

  ngOnInit(): void {
    // Load messages when the component initializes
    this.loadMessages();
  }

  loadMessages(): void {
    // Assuming getMessages requires organizationId and userName
    this.chatService.getMessages(this.organizationId || '', this.userName || '').subscribe(
      (messages: ChatMessage[]) => {
        this.messages = messages; // Update the messages array with the fetched messages
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const messageDetails: ChatMessage = {
        userName: this.userName || '', // Ensure userName is of type string
        message: this.newMessage,
        organizationId: this.organizationId || '',
      };

      this.chatService.sendMessage(messageDetails).subscribe(
        (sentMessage: ChatMessage) => {
          this.messages.push(sentMessage); // Update the messages list with the new message
          this.newMessage = ''; // Clear the input field
        },
        (error) => {
          console.error('Error sending message:', error);
        }
      );
    }
  }
}
