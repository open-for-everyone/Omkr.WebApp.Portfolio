import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChatService } from '../../../services/chat/chat.service';
import { Subscription } from 'rxjs';
import { ChatMessage } from '../../../models/chat/chat-message.model';

/**
 * The chat bubble. Messages go to the admin app's visitor queue and a person answers them, so the panel
 * is honest about that — it is not an assistant, and it says when nobody is around.
 */
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
  /** True while the person on the other end is writing back. */
  replying = false;

  private subs = new Subscription();
  /** Typing pings are throttled — one every few seconds keeps the indicator alive. */
  private lastTypingPing = 0;

  constructor(private chat: ChatService) {}

  ngOnInit(): void {
    this.subs.add(this.chat.stream.subscribe(list => {
      this.messages = list;
      setTimeout(() => this.scrollToBottom(), 0);
    }));
    this.subs.add(this.chat.replyingStream.subscribe(replying => {
      this.replying = replying;
      if (replying) setTimeout(() => this.scrollToBottom(), 0);
    }));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.chat.close();
  }

  toggle(){
    this.open = !this.open;
    // Only talk to the API while the panel is actually open.
    if (this.open) {
      this.chat.open();
      setTimeout(() => this.focusInput(), 10);
    } else {
      this.chat.close();
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
      return;
    }
    this.pingTyping();
  }

  private pingTyping(): void {
    const now = Date.now();
    if (now - this.lastTypingPing < 3000) return;
    this.lastTypingPing = now;
    this.chat.notifyTyping();
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
      this.chat.close();
    }
  }

  trackMsg(index: number, m: ChatMessage){ return m.id; }
}
