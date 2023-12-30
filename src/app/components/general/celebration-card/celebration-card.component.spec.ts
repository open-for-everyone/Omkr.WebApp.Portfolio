import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CelebrationCardComponent } from './celebration-card.component';

describe('CelebrationCardComponent', () => {
  let component: CelebrationCardComponent;
  let fixture: ComponentFixture<CelebrationCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CelebrationCardComponent]
    });
    fixture = TestBed.createComponent(CelebrationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
