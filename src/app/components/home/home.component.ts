import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageViewService } from 'src/app/services/PageView/page-view.service';
import { CelebrationCardDialogService } from 'src/app/services/general/celebration/celebration-card-dialog.service';
import { CelebrationCardDialogComponent } from '../general/celebration-card-dialog/celebration-card-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pageUrl = '';
  currentEvent: unknown = null;

  /**
   *
   */
  constructor(private renderer2: Renderer2, private pageViewService: PageViewService, private router: Router,
    private celebrationDialogService: CelebrationCardDialogService,private dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.pageUrl = this.router.url;
    this.renderer2.setStyle(document.body, "background-color", "#0a192f");
    this.pageViewService.incrementPageView(this.router.url).subscribe();
    // this.celebrationDialogService.openCelebrationDialog();

    // this.celebrationDialogService.getEventForCurrentDate().subscribe(event => {
    //   console.log(event);
    //   this.currentEvent = event;
    //   if (this.currentEvent) {
    //     console.log('opening dialog');
    //     this.celebrationDialogService.openCelebrationDialog();
    //   }
    // });

    this.celebrationDialogService.getEventForCurrentDate().subscribe(event => {
      if (event) {
        console.log('opening dialog');
        this.dialog.open(CelebrationCardDialogComponent, {
          data: event,
          width: '400px'
        });
      }
    }, error => {
      console.log(error);
      // Handle errors here, for example, logging them
    });
  }
}
