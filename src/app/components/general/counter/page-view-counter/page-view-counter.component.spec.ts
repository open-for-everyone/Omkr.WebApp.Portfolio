import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageViewCounterComponent } from './page-view-counter.component';

describe('PageViewCounterComponent', () => {
  let component: PageViewCounterComponent;
  let fixture: ComponentFixture<PageViewCounterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageViewCounterComponent]
    });
    fixture = TestBed.createComponent(PageViewCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
