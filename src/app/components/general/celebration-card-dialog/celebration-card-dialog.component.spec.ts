import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CelebrationCardDialogComponent } from './celebration-card-dialog.component';

describe('CelebrationCardDialogComponent', () => {
  let component: CelebrationCardDialogComponent;
  let fixture: ComponentFixture<CelebrationCardDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CelebrationCardDialogComponent]
    });
    fixture = TestBed.createComponent(CelebrationCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
