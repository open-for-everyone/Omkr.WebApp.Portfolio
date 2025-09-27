import { TestBed } from '@angular/core/testing';
import { ChatService } from './chat.service';
import { take } from 'rxjs/operators';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatService);
  });

  it('should create and have initial assistant greeting', (done) => {
    service.stream.pipe(take(1)).subscribe(msgs => {
      expect(msgs.length).toBeGreaterThan(0);
      expect(msgs[0].role).toBe('assistant');
      done();
    });
  });

  it('should add user message and later assistant reply', (done) => {
    service.sendMessage('Tell me about skills');
    setTimeout(() => {
      service.stream.pipe(take(1)).subscribe(msgs => {
        const hasUser = msgs.some(m => m.role === 'user');
        const hasAssistant = msgs.filter(m => m.role === 'assistant').length >= 1;
        expect(hasUser).toBeTrue();
        expect(hasAssistant).toBeTrue();
        done();
      });
    }, 1200);
  });
});
