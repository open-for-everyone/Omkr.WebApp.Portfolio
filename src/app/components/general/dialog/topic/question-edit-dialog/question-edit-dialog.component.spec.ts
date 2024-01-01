import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionEditDialogComponent } from './question-edit-dialog.component';

describe('QuestionEditDialogComponent', () => {
  let component: QuestionEditDialogComponent;
  let fixture: ComponentFixture<QuestionEditDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionEditDialogComponent]
    });
    fixture = TestBed.createComponent(QuestionEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
