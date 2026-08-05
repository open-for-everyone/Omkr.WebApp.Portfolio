import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take } from 'rxjs/operators';
import { ChatService } from './chat.service';
import { environment } from 'src/environments/environment';

const BASE = `${environment.contactApiBaseUrl}/api/visitor-chat`;

/**
 * The widget talks to the admin API's visitor-chat endpoints — there is no canned assistant any more,
 * so these cover the parts that would silently break a real conversation: the session token, the
 * optimistic echo of what the visitor typed, and staff replies arriving from a poll.
 */
describe('ChatService', () => {
  let service: ChatService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ChatService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    service.close();
  });

  it('does not touch the API just because the panel was opened', (done) => {
    service.open();

    // Nothing is stored about someone who only looked: the session starts on the first message.
    http.expectNone(`${BASE}/session`);
    http.expectNone(r => r.url === `${BASE}/poll`);
    expect(localStorage.getItem('visitorChat.token.v1')).toBeNull();

    // They still get a greeting, so the panel isn't an empty box.
    service.stream.pipe(take(1)).subscribe(messages => {
      expect(messages.length).toBe(1);
      expect(messages[0].role).toBe('assistant');
      done();
    });
  });

  it('opens a session on the first message and keeps the token', () => {
    service.open();
    service.sendMessage('Hello there');

    const start = http.expectOne(`${BASE}/session`);
    expect(start.request.method).toBe('POST');
    expect(start.request.body.source).toBe('portfolio');
    start.flush({ token: 'tok-123', sessionId: 's1', greeting: 'Hi!' });

    // The token is the visitor's only credential, and rides every later call as a header.
    const poll = http.expectOne(r => r.url === `${BASE}/poll`);
    expect(poll.request.headers.get('X-Visitor-Token')).toBe('tok-123');
    poll.flush({ status: 'open', staffTyping: false, messages: [] });

    const sent = http.expectOne(`${BASE}/message`);
    expect(sent.request.body.body).toBe('Hello there');
    sent.flush({});

    expect(localStorage.getItem('visitorChat.token.v1')).toBe('tok-123');
  });

  it('shows the visitor their own message before the server confirms it', (done) => {
    service.open();
    service.sendMessage('Hello there');

    service.stream.pipe(take(1)).subscribe(messages => {
      expect(messages.some(m => m.role === 'user' && m.content === 'Hello there')).toBe(true);
      done();
    });

    http.expectOne(`${BASE}/session`).flush({ token: 't', sessionId: 's', greeting: 'Hi!' });
  });

  it('surfaces a staff reply and the typing indicator from a poll', (done) => {
    localStorage.setItem('visitorChat.token.v1', 'existing');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ChatService);
    http = TestBed.inject(HttpTestingController);

    service.open();

    http.expectOne(r => r.url === `${BASE}/poll`).flush({
      status: 'open',
      staffTyping: true,
      messages: [{ id: 'm1', author: 'staff', staffName: 'Keshav', body: 'Hi there', sentAt: '2026-01-01T00:00:00Z' }],
    });

    service.replyingStream.pipe(take(1)).subscribe(replying => {
      expect(replying).toBe(true);
      service.stream.pipe(take(1)).subscribe(messages => {
        expect(messages.some(m => m.role === 'assistant' && m.content === 'Hi there')).toBe(true);
        done();
      });
    });
  });

  it('starts over when the server no longer knows the token', () => {
    localStorage.setItem('visitorChat.token.v1', 'stale');
    // A fresh instance, so the constructor picks up the stored token.
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ChatService);
    http = TestBed.inject(HttpTestingController);

    service.open();
    http.expectOne(r => r.url === `${BASE}/poll`)
      .flush({ error: 'gone' }, { status: 404, statusText: 'Not Found' });

    expect(localStorage.getItem('visitorChat.token.v1')).toBeNull();
  });
});
