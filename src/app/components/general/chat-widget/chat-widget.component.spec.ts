import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatWidgetComponent } from './chat-widget.component';
import { ChatService } from '../../../services/chat/chat.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

describe('ChatWidgetComponent', () => {
  let component: ChatWidgetComponent;
  let fixture: ComponentFixture<ChatWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[FormsModule, MatButtonModule, MatIconModule],
      declarations:[ChatWidgetComponent],
      providers:[ChatService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
