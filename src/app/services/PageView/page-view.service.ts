import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, catchError, of } from 'rxjs';

/**
 * Page views, recorded in the central analytics on the admin API (admin → Analytics), which is where
 * every site in the family reports. The old AWS endpoint this used to call was retired, so its requests
 * only ever produced CORS errors in the console.
 *
 * Failures are swallowed on purpose: a visit counter must never be something a visitor notices, and an
 * analytics outage is not worth a red console or a broken page.
 */
@Injectable({
  providedIn: 'root'
})
export class PageViewService {
  /** Which site this is, in the admin's website registry. */
  private readonly websiteKey = 'portfolio';
  private readonly trackUrl = `${environment.contactApiBaseUrl}/api/analytics/visit`;

  constructor(private http: HttpClient) { }

  /** Records one visit. Fire and forget — nothing in the UI waits on it. */
  incrementPageView(path: string): Observable<unknown> {
    return this.http
      .post(this.trackUrl, {
        websiteKey: this.websiteKey,
        path: path || '/',
        referrer: typeof document !== 'undefined' && document.referrer ? document.referrer : null,
      })
      .pipe(catchError(() => of(null)));
  }
}
