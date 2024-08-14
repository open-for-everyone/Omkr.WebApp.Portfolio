import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Saver, SAVER } from './saver.provider';
import { download, Download } from './Download';
import { saveAs } from 'file-saver';


@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private http: HttpClient,
    @Inject(SAVER) private save: Saver
  ) {
  }

  download(url: string, filename?: string): Observable<Download> {
    return this.http.get(url, {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      }),
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    }).pipe(download(blob => this.save(blob, filename)))
  }


  blob(url: string, filename?: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'
    })
  }

  getUrl(url: string): Observable<string> {
    return this.http.get(url, {
      responseType: 'text',
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      })
    })
  }
}
