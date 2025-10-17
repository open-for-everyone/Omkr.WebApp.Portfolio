import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EpfoAuthService } from '../../../services/epfo/epfo-auth.service';
import { EpfoService } from '../../../services/epfo/epfo.service';
import {
  EpfoData,
  EpfoLoginRequest,
  EpfoAccountDetail,
  EpfoBalance,
  EpfoNomineeDetail,
  EpfoEmployerDetail,
  EpfoPassbook
} from '../../../models/epfo/epfo-data';

interface HttpErrorResponse {
  error?: { message?: string };
  status?: number;
  message?: string;
}

@Component({
  selector: 'app-epfo',
  templateUrl: './epfo.component.html',
  styleUrls: ['./epfo.component.css']
})
export class EpfoComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isAuthenticated = false;
  isLoading = false;
  loginError = '';
  
  epfoData: EpfoData = {};
  accountDetail?: EpfoAccountDetail;
  balance?: EpfoBalance;
  nominees: EpfoNomineeDetail[] = [];
  employers: EpfoEmployerDetail[] = [];
  passbook?: EpfoPassbook;
  
  currentUan = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: EpfoAuthService,
    private epfoService: EpfoService
  ) {
    this.loginForm = this.fb.group({
      uan: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Subscribe to authentication state
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        this.isAuthenticated = isAuth;
        if (isAuth && this.currentUan) {
          this.fetchEpfoData();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle login form submission
   */
  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.loginError = '';

    const loginRequest: EpfoLoginRequest = {
      uan: this.loginForm.value.uan,
      password: this.loginForm.value.password
    };

    this.authService.login(loginRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.currentUan = response.uan;
          this.fetchEpfoData();
        },
        error: (error) => {
          this.isLoading = false;
          this.loginError = this.getErrorMessage(error);
        }
      });
  }

  /**
   * Fetch all EPFO data after successful login
   */
  fetchEpfoData(): void {
    if (!this.currentUan) {
      return;
    }

    this.isLoading = true;

    // Fetch all data
    this.epfoService.getAllData(this.currentUan)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.epfoData = data;
          this.accountDetail = data.accountDetail;
          this.balance = data.balance;
          this.nominees = data.nominees || [];
          this.employers = data.employers || [];
          this.passbook = data.passbook;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error fetching EPFO data:', error);
        }
      });
  }

  /**
   * Handle logout
   */
  onLogout(): void {
    this.authService.logout();
    this.loginForm.reset();
    this.epfoData = {};
    this.accountDetail = undefined;
    this.balance = undefined;
    this.nominees = [];
    this.employers = [];
    this.passbook = undefined;
    this.currentUan = '';
    this.loginError = '';
  }

  /**
   * Get error message from HTTP error
   */
  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error && error.error.message) {
      return error.error.message;
    }
    
    if (error.status === 0) {
      return 'Unable to connect to EPFO server. Please check your internet connection or try again later.';
    }
    
    if (error.status === 401) {
      return 'Invalid UAN or password. Please check your credentials and try again.';
    }
    
    if (error.status === 403) {
      return 'Access denied. Please contact EPFO support.';
    }
    
    return 'An error occurred during login. Please try again later.';
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Format date for display
   */
  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
