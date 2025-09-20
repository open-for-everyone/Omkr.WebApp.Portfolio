import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { from, Observable, switchMap } from 'rxjs';
import { PageViewDetail } from 'src/app/models/PageView/page-view-detail';

@Injectable({
  providedIn: 'root'
})
export class PageViewService {
  apiUrl = '';
  constructor(private http: HttpClient) { }

  incrementPageView(path: string): Observable<unknown> {
    return from(this.sha256Hex(path)).pipe(
      switchMap(pageId => {
        this.apiUrl = `${environment.awsUserApiBaseUrl}/${environment.mapConfig.analytics}/${environment.pageViewApiEndpoints.incrementPageView}`;
        this.apiUrl = this.apiUrl.replace("{pageId}", pageId ?? '');
        return this.http.post(this.apiUrl, { path });
      })
    );
  }

  getPageViewCount(path: string): Observable<PageViewDetail> {
    return from(this.sha256Hex(path)).pipe(
      switchMap(pageId => {
        this.apiUrl = `${environment.awsUserApiBaseUrl}/${environment.mapConfig.analytics}/${environment.pageViewApiEndpoints.pageView}`;
        this.apiUrl = this.apiUrl.replace("{pageId}", pageId ?? '');
        return this.http.get<PageViewDetail>(this.apiUrl);
      })
    );
  }

  private async sha256Hex(input: string): Promise<string> {
    const data = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
