import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SessionService } from '../../../services/auth/session.service';
import { map } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-session-timeout-dialog',
  templateUrl: './session-timeout-dialog.component.html',
  styleUrls: ['./session-timeout-dialog.component.css']
})
export class SessionTimeoutDialogComponent {
  countdown$ = this.session.sessionState$.pipe(map(s => s.inactivityCountdown));

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { seconds: number },
    private dialogRef: MatDialogRef<SessionTimeoutDialogComponent>,
    private session: SessionService
  ){}

  continue(){
    this.dialogRef.close('continue');
  }

  logout(){
    this.dialogRef.close('logout');
  }
}
