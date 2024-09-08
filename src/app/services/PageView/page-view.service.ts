import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';
import { PageViewDetail } from 'src/app/models/PageView/page-view-detail';

@Injectable({
  providedIn: 'root'
})
export class PageViewService {
  apiUrl = '';
  constructor(private http: HttpClient) { }

  incrementPageView(path: string): Observable<unknown> {
    const pageId = this.createPageIdFromPath(path);

    this.apiUrl = `${environment.awsUserApiBaseUrl}/${environment.mapConfig.analytics}/${environment.pageViewApiEndpoints.incrementPageView}`;
    this.apiUrl = this.apiUrl.replace("{pageId}", (pageId) ?? '');
    return this.http.post(this.apiUrl, { path });
  }

  getPageViewCount(path: string): Observable<PageViewDetail> {
    const pageId = this.createPageIdFromPath(path);

    this.apiUrl = `${environment.awsUserApiBaseUrl}/${environment.mapConfig.analytics}/${environment.pageViewApiEndpoints.pageView}`;
    this.apiUrl = this.apiUrl.replace("{pageId}", (pageId) ?? '');
    return this.http.get<PageViewDetail>(this.apiUrl);
  }

  createPageIdFromPath(path: string): string {
    const hash = CryptoJS.SHA256(path).toString(CryptoJS.enc.Hex);
    console.log('pageId: ' + hash);
    console.log('path: ' + path);

    return hash;
  }
}
