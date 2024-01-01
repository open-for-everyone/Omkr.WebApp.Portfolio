import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsharpInterviewQaComponent } from './csharp-interview-qa.component';

describe('CsharpInterviewQaComponent', () => {
  let component: CsharpInterviewQaComponent;
  let fixture: ComponentFixture<CsharpInterviewQaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CsharpInterviewQaComponent]
    });
    fixture = TestBed.createComponent(CsharpInterviewQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
