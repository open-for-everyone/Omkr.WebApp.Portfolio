import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { CelebrationCardDialogComponent } from 'src/app/components/general/celebration-card-dialog/celebration-card-dialog.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CelebrationCardDialogService {

  constructor(public dialog: MatDialog, private http: HttpClient) { }

  public openCelebrationDialog(): void {
    this.dialog.open(CelebrationCardDialogComponent, {
      width: '400px'
    });
  }

  private apiUrl = ''; // Replace with your actual API URL


  getEventForCurrentDate(): Observable<any> {
    this.apiUrl = `${environment.awsUserApiBaseUrl}${environment.eventApiEndpoints.getEventByDate}`;
    const currentDate = new Date().toISOString().split('T')[0];

    this.apiUrl = this.apiUrl.replace('{date}', currentDate);
    return this.http.get<any>(`${this.apiUrl}`);
  }
}
