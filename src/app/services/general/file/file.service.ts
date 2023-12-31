import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private apiUrl = ``;
  private url = ``;

  constructor(private http: HttpClient) { }

  getUrl(fileName: string): Observable<string> {

    this.apiUrl = `${environment.awsUserApiBaseUrl}${environment.fileApiEndpoints.getUrl}`;
    this.apiUrl = this.apiUrl.replace('{key}', fileName);
    console.log('get file Url endpoint: ' + this.apiUrl);
    return this.http.get<string>(this.apiUrl, { responseType: 'text' as 'json' });
  }

  getUrl2(url: string): Observable<string> {
    console.log('get file Url endpoint: ' + url);
    return this.http.get<string>(url, { responseType: 'text' as 'json' });
  }


  generateUrl(fileName: string): Observable<string> {
    const apiUrl = `${environment.awsUserApiBaseUrl}${environment.fileApiEndpoints.generateUrl}`;
    const urlWithFileName = apiUrl.replace('{key}', fileName);
    console.log('generate file Url endpoint: ' + urlWithFileName);
    return this.http.get<string>(urlWithFileName, { responseType: 'text' as 'json' });
  }

  uploadFile(file: File, fileName: string): Observable<any> {
    if (!fileName) {
      fileName = file.name;
    }

    // Use switchMap to use the URL from generateUrl to make the PUT request
    return this.generateUrl(fileName).pipe(
      switchMap((url: string) => {
        console.log('generatedUrl: ' + url);

        const req = new HttpRequest('PUT', url, file, {
          reportProgress: true, // Enable progress reporting
          responseType: 'json'
        });

        // Make the PUT request directly with the file in the request body
        // Note: Do not set Content-Type header as it is automatically set by the browser
        // when passing a File object as the body, which is required for pre-signed S3 URLs
        return this.http.request(req);
      })
    );
  }
}
