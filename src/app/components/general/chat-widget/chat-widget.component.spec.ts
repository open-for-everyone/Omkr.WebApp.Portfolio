import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { provideCommonTestServices } from 'src/testing/test-support';
import { ChatWidgetComponent } from './chat-widget.component';

describe('ChatWidgetComponent', () => {
  let component: ChatWidgetComponent;
  let fixture: ComponentFixture<ChatWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ChatWidgetComponent is standalone — it is created dynamically by AppComponent, unlike the
      // rest of the app — so it is imported, not declared. Declaring it failed outright.
      imports:[FormsModule, MatButtonModule, MatIconModule, ChatWidgetComponent],
      // ChatService is root-provided and needs HttpClient; listing the service alone did not give it one.
      providers:[provideCommonTestServices()]
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
