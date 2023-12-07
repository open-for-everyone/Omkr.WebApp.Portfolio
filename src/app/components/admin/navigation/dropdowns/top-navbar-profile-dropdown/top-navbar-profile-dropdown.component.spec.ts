import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNavbarProfileDropdownComponent } from './top-navbar-profile-dropdown.component';

describe('TopNavbarProfileDropdownComponent', () => {
  let component: TopNavbarProfileDropdownComponent;
  let fixture: ComponentFixture<TopNavbarProfileDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopNavbarProfileDropdownComponent]
    });
    fixture = TestBed.createComponent(TopNavbarProfileDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
