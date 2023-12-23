import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message/message.service';
import { AuthService } from 'src/app/guards/auth/auth.service';
import { ChatMessage } from 'src/app/models/admin/chat/message';
import { UserDetails } from 'src/app/models/user-details';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
  messages: ChatMessage[] = []; // Array of chat messages
  newMessage = '';
  organizationId = this.authService.getOrganizationId();
  userName = this.authService.getCurrentUserName();
  users: UserDetails[] = []; // Array of user details
  selectedUserId = '';

  constructor(
    private chatService: MessageService,
    private authService: AuthService,
    private userService: ProfileService // Inject UserService
  ) { }

  ngOnInit(): void {
    this.loadOrgUsers(); // Load users when the component initializes
  }
  onUserSelected(): void {
    console.log(this.selectedUserId); // Add this to debug and check if the value changes

    if (this.selectedUserId) {
      this.loadMessages();
    } else {
      this.messages = []; // Clear messages if no user is selected
    }
  }

  loadOrgUsers(): void {
    // Check if organizationId is available before making the call
    if (this.organizationId) {
      this.userService.getOrgUsers(this.organizationId).subscribe(
        (usersFetched: UserDetails[]) => {
          this.users = usersFetched; // Update the users array with the fetched users
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
    } else {
      console.error('No organization ID provided');
    }
  }

  loadMessages(): void {
    // Assuming getMessages requires organizationId
    this.chatService.getMessages(this.organizationId || '', this.userName || '', this.selectedUserId).subscribe(
      (messages: ChatMessage[]) => {
        this.messages = messages; // Update the messages array with the fetched messages
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedUserId) {
      const messageDetails: ChatMessage = {
        fromUser: this.authService.getCurrentUserName() || '', // Assuming you have a method to get the current user's ID
        toUser: this.selectedUserId,
        message: this.newMessage,
        organizationId: this.organizationId || '',
      };

      this.chatService.sendMessage(messageDetails).subscribe(
        (sentMessage: ChatMessage) => {
          console.log('Message sent successfully:', sentMessage);
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
