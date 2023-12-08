import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void => *', animate('300ms ease-in')),
    ])
  ]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
