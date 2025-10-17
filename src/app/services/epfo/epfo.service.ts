import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  EpfoData,
  EpfoAccountDetail,
  EpfoPassbook,
  EpfoNomineeDetail,
  EpfoBalance
} from '../../models/epfo/epfo-data';
import { EpfoAuthService } from './epfo-auth.service';

@Injectable({
  providedIn: 'root'
})
export class EpfoService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private authService: EpfoAuthService
  ) {
    this.apiUrl = environment.awsUserApiBaseUrl;
  }

  /**
   * Get EPFO account details
   */
  getAccountDetails(uan: string): Observable<EpfoAccountDetail> {
    const url = `${this.apiUrl}/${environment.epfoApiEndpoints.accountDetails}`
      .replace('{uan}', uan);
    
    return this.http.get<EpfoAccountDetail>(url, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Get EPFO passbook with contribution history
   */
  getPassbook(uan: string): Observable<EpfoPassbook> {
    const url = `${this.apiUrl}/${environment.epfoApiEndpoints.passbook}`
      .replace('{uan}', uan);
    
    return this.http.get<EpfoPassbook>(url, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Get EPFO balance
   */
  getBalance(uan: string): Observable<EpfoBalance> {
    const url = `${this.apiUrl}/${environment.epfoApiEndpoints.balance}`
      .replace('{uan}', uan);
    
    return this.http.get<EpfoBalance>(url, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Get EPFO nominee details
   */
  getNominees(uan: string): Observable<EpfoNomineeDetail[]> {
    const url = `${this.apiUrl}/${environment.epfoApiEndpoints.nominees}`
      .replace('{uan}', uan);
    
    return this.http.get<EpfoNomineeDetail[]>(url, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Get all EPFO data (consolidated)
   */
  getAllData(uan: string): Observable<EpfoData> {
    const url = `${this.apiUrl}/${environment.epfoApiEndpoints.allData}`
      .replace('{uan}', uan);
    
    return this.http.get<EpfoData>(url, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
