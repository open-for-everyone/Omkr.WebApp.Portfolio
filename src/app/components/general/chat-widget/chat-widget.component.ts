import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChatService } from '../../../services/chat/chat.service';
import { Subscription } from 'rxjs';
import { ChatMessage } from '../../../models/chat/chat-message.model';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css']
})
export class ChatWidgetComponent implements OnInit, OnDestroy {
  @ViewChild('messagesViewport') messagesViewport?: ElementRef<HTMLDivElement>;
  open = false;
  draft = '';
  messages: ChatMessage[] = [];
  private sub?: Subscription;

  constructor(private chat: ChatService) {}

  ngOnInit(): void {
    this.sub = this.chat.stream.subscribe(list => {
      this.messages = list;
      setTimeout(() => this.scrollToBottom(), 0);
    });
  }
  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  toggle(){
    this.open = !this.open;
    if(this.open){
      setTimeout(() => this.focusInput(), 10);
    }
  }

  send(){
    if(!this.draft.trim()) return;
    const text = this.draft;
    this.draft = '';
    this.chat.sendMessage(text);
  }

  onKey(e: KeyboardEvent){
    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault();
      this.send();
    }
  }

  private focusInput(){
    const el = document.getElementById('chat-input');
    el?.focus();
  }

  private scrollToBottom(){
    const el = this.messagesViewport?.nativeElement;
    if(el) el.scrollTop = el.scrollHeight;
  }

  @HostListener('document:keydown', ['$event'])
  handleGlobalKey(ev: KeyboardEvent){
    if(this.open && ev.key === 'Escape'){
      this.open = false;
    }
  }

  trackMsg(index: number, m: ChatMessage){ return m.id; }
}
