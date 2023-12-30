import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fadeInOut } from 'src/app/models/animations/animations';
import { CelebrationCardDialogService } from 'src/app/services/general/celebration/celebration-card-dialog.service';

@Component({
  selector: 'app-celebration-card-dialog',
  templateUrl: './celebration-card-dialog.component.html',
  styleUrls: ['./celebration-card-dialog.component.css'],
  animations: [fadeInOut]
})
export class CelebrationCardDialogComponent implements OnInit {

  event: any = null;

  constructor(private eventService: CelebrationCardDialogService,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.eventService.getEventForCurrentDate().subscribe(event => {
      this.event = event;
    });
  }
}
