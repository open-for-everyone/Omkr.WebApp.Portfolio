import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ChatMessage } from '../../models/chat/chat-message.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly messages$ = new BehaviorSubject<ChatMessage[]>([]);
  private sessionId = this.generateId();

  get stream(): Observable<ChatMessage[]> { return this.messages$.asObservable(); }

  constructor() {
    // Initial system greeting
    this.pushMessage({
      id: this.generateId(),
      role: 'assistant',
      content: 'Hi! I\'m your virtual assistant. Ask me about the site, skills, or anything else.',
      createdUtc: new Date().toISOString()
    });
  }

  sendMessage(text: string): void {
    const trimmed = text.trim();
    if (!trimmed) return;
    const user: ChatMessage = { id: this.generateId(), role: 'user', content: trimmed, createdUtc: new Date().toISOString() };
    this.pushMessage(user);
    this.simulateAssistantReply(trimmed);
  }

  // Placeholder for future HTTP AI integration
  // private callBackend(history: ChatMessage[]): Observable<string> { ... }

  private simulateAssistantReply(prompt: string) {
    const reply = this.generateHeuristicReply(prompt);
    of(reply).pipe(delay(600 + Math.random()*400)).subscribe(content => {
      this.pushMessage({ id: this.generateId(), role: 'assistant', content, createdUtc: new Date().toISOString() });
    });
  }

  private generateHeuristicReply(prompt: string): string {
    const lower = prompt.toLowerCase();
    if (lower.includes('resume')) return 'You can view and download the resume via the Resume page — PDF export is selectable text.';
    if (lower.includes('skill')) return 'Main stacks include Angular, Node.js, AWS, Azure, Databases, DevOps tooling, and security/observability.';
    if (lower.includes('contact')) return 'Use the contact section form or call the phone icon in the header.';
    if (lower.includes('theme')) return 'Theme toggle (light/dark) is in the header; high contrast mode was simplified earlier.';
    if (environment.aiChat?.baseUrl && lower.includes('api')) return `An API placeholder is configured at ${environment.aiChat.baseUrl} (no live key in client).`;
    return 'I noted your question. A fuller AI backend can improve this response once integrated.';
  }

  private pushMessage(msg: ChatMessage) {
    this.messages$.next([...this.messages$.value, msg]);
  }

  private generateId(): string { return 'm_' + Math.random().toString(36).slice(2, 10); }
}
