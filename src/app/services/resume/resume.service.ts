import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, shareReplay } from 'rxjs';
import { ResumeData } from '../../models/resume/resume.model';
import { environment } from 'src/environments/environment';

interface PublicWebsiteContentView {
  siteKey: string;
  contentKey: string;
  payloadJson: string;
  version: number;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private cache$?: Observable<ResumeData>;
  constructor(private http: HttpClient) {}

  get(): Observable<ResumeData> {
    if (!this.cache$) {
      const local$ = this.http.get<ResumeData>('assets/data/resume.json');
      const remoteUrl = `${environment.idpApiBaseUrl}/website-content/public/omkr-portfolio/resume`;

      this.cache$ = this.http.get<PublicWebsiteContentView>(remoteUrl).pipe(
        map(remote => JSON.parse(remote.payloadJson) as ResumeData),
        catchError(() => local$),
        shareReplay(1)
      );
    }
    return this.cache$;
  }
}
