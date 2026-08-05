import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, interval, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ChatMessage } from '../../models/chat/chat-message.model';
import { environment } from 'src/environments/environment';

interface StartResponse { token: string; sessionId: string; greeting: string }
interface PollMessage { id: string; author: string; staffName: string | null; body: string; sentAt: string }
interface PollResponse { status: string; staffTyping: boolean; messages: PollMessage[] }

/** Where the visitor's session token lives. Losing it just starts a new conversation. */
const TOKEN_KEY = 'visitorChat.token.v1';

/** How often the widget asks for new messages while it is open, in milliseconds. */
const POLL_MS = 4000;

/**
 * The chat bubble, wired to the admin API: messages land in the Visitor chat queue at
 * admin.keshavsingh.in and replies come back here. It is a real conversation with a person, not a bot —
 * so the widget says so rather than pretending to be an assistant.
 *
 * Delivery is polling while the panel is open; nothing runs in the background. The session token is the
 * visitor's only credential, kept in localStorage so a refresh doesn't lose the thread, and never sent
 * anywhere but this API.
 */
@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly messages$ = new BehaviorSubject<ChatMessage[]>([]);
  private readonly typing$ = new BehaviorSubject<boolean>(false);
  private readonly baseUrl = `${environment.contactApiBaseUrl}/api/visitor-chat`;

  private token: string | null = null;
  private lastMessageId: string | null = null;
  private polling?: Subscription;
  private starting = false;

  get stream(): Observable<ChatMessage[]> { return this.messages$.asObservable(); }

  /** True while whoever is answering is typing back. */
  get replyingStream(): Observable<boolean> { return this.typing$.asObservable(); }

  constructor(private http: HttpClient) {
    this.token = this.readToken();
  }

  /**
   * Called when the panel opens. A returning visitor picks their conversation back up; a new one just
   * sees the greeting — no session is created, and nothing is stored, until they actually write
   * something. Opening a chat window out of curiosity shouldn't leave a record of you anywhere.
   */
  open(): void {
    if (this.token) {
      this.startPolling();
      return;
    }
    if (this.messages$.value.length === 0) {
      this.push({
        id: 'greeting',
        role: 'assistant',
        content: "Hi! Ask me anything — your message goes straight to my admin inbox and I'll reply here.",
        createdUtc: new Date().toISOString(),
      });
    }
  }

  /** Called when the panel closes — no reason to keep polling an invisible widget. */
  close(): void {
    this.polling?.unsubscribe();
    this.polling = undefined;
  }

  sendMessage(text: string): void {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Shown immediately: a message that only appears after a round trip feels broken.
    this.push({
      id: `local_${Date.now()}`,
      role: 'user',
      content: trimmed,
      createdUtc: new Date().toISOString(),
    });

    this.withSession(token => {
      this.http.post(`${this.baseUrl}/message`, { body: trimmed }, { headers: this.headers(token) })
        .pipe(catchError(() => {
          this.push({
            id: `err_${Date.now()}`,
            role: 'system',
            content: 'That message could not be delivered. Please try again, or use the contact form.',
            createdUtc: new Date().toISOString(),
          });
          return of(null);
        }))
        .subscribe(() => this.pollOnce());
    });
  }

  /** Tells the other side the visitor is writing. Fire and forget — it expires server-side. */
  notifyTyping(): void {
    if (!this.token) return;
    this.http.post(`${this.baseUrl}/typing`, {}, { headers: this.headers(this.token) })
      .pipe(catchError(() => of(null)))
      .subscribe();
  }

  private startPolling(): void {
    if (this.polling) return;
    this.pollOnce();
    this.polling = interval(POLL_MS)
      .pipe(switchMap(() => this.pollRequest()))
      .subscribe(response => this.applyPoll(response));
  }

  private pollOnce(): void {
    this.pollRequest().subscribe(response => this.applyPoll(response));
  }

  private pollRequest(): Observable<PollResponse | null> {
    if (!this.token) return of(null);
    const after = this.lastMessageId ? `?after=${encodeURIComponent(this.lastMessageId)}` : '';
    return this.http.get<PollResponse>(`${this.baseUrl}/poll${after}`, { headers: this.headers(this.token) })
      .pipe(catchError(error => {
        // A token the server doesn't know (cleared data, deleted conversation) starts over cleanly.
        if (error?.status === 404) this.forgetSession();
        return of(null);
      }));
  }

  private applyPoll(response: PollResponse | null): void {
    if (!response) return;
    this.typing$.next(response.staffTyping);

    for (const message of response.messages) {
      this.lastMessageId = message.id;
      this.push({
        id: message.id,
        role: message.author === 'staff' ? 'assistant' : 'user',
        content: message.body,
        createdUtc: message.sentAt,
      });
    }
  }

  /** Runs an action that needs a session, opening one first if this is the visitor's first message. */
  private withSession(action: (token: string) => void): void {
    if (this.token) { action(this.token); return; }
    if (this.starting) return;
    this.starting = true;

    const body = {
      source: 'portfolio',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    this.http.post<StartResponse>(`${this.baseUrl}/session`, body)
      .pipe(catchError(() => of(null)))
      .subscribe(response => {
        this.starting = false;
        if (!response) {
          this.push({
            id: `offline_${Date.now()}`,
            role: 'system',
            content: 'Chat is unavailable right now. The contact form below still reaches me.',
            createdUtc: new Date().toISOString(),
          });
          return;
        }
        this.token = response.token;
        this.writeToken(response.token);
        this.startPolling();
        action(response.token);
      });
  }

  private forgetSession(): void {
    this.token = null;
    this.lastMessageId = null;
    this.close();
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* storage disabled; nothing to clean up */ }
  }

  private headers(token: string): HttpHeaders {
    return new HttpHeaders({ 'X-Visitor-Token': token });
  }

  private push(message: ChatMessage): void {
    // The visitor's own messages come back from the server too; keep the local copy, drop the echo.
    const isEcho = message.role === 'user'
      && this.messages$.value.some(m => m.content === message.content && m.id.startsWith('local_'));
    if (isEcho) return;

    this.messages$.next([...this.messages$.value, message]);
  }

  private readToken(): string | null {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  }

  private writeToken(token: string): void {
    try { localStorage.setItem(TOKEN_KEY, token); } catch { /* private mode: session lasts this visit */ }
  }
}
