import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../material.module';
import { EpfoComponent } from './epfo.component';
import { EpfoAuthService } from '../../../services/epfo/epfo-auth.service';
import { EpfoService } from '../../../services/epfo/epfo.service';

describe('EpfoComponent', () => {
  let component: EpfoComponent;
  let fixture: ComponentFixture<EpfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpfoComponent ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MaterialModule
      ],
      providers: [
        EpfoAuthService,
        EpfoService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with login form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('uan')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('should validate UAN field as required', () => {
    const uanControl = component.loginForm.get('uan');
    uanControl?.setValue('');
    expect(uanControl?.hasError('required')).toBeTruthy();
  });

  it('should validate password field as required', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.hasError('required')).toBeTruthy();
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(10000);
    expect(formatted).toContain('10,000');
  });
});
