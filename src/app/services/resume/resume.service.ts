import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { ResumeData } from '../../models/resume/resume.model';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private cache$?: Observable<ResumeData>;
  constructor(private http: HttpClient) {}

  get(): Observable<ResumeData> {
    if (!this.cache$) {
      this.cache$ = this.http.get<ResumeData>('assets/data/resume.json').pipe(shareReplay(1));
    }
    return this.cache$;
  }
}
