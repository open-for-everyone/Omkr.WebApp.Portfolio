import { Component, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageViewService } from 'src/app/services/PageView/page-view.service';
import { CelebrationCardDialogService } from 'src/app/services/general/celebration/celebration-card-dialog.service';
import { CelebrationCardDialogComponent } from '../general/celebration-card-dialog/celebration-card-dialog.component';
import { FileService } from 'src/app/services/general/file/file.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnChanges {

  pageUrl = '';
  currentEvent: unknown = null;
  @Input() show = false;
  confetti: any[] = [];
  /**
   *
   */
  constructor(private renderer2: Renderer2, private pageViewService: PageViewService, private router: Router,
    private celebrationDialogService: CelebrationCardDialogService, private dialog: MatDialog,
    private fileService: FileService) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && this.show) {
      this.startConfetti();
    } else {
      this.stopConfetti();
    }
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

        console.log('Retrieving file URL');
        this.fileService.getUrl2(event.imageUrl).subscribe(fileUrl => {
          // Now you have the additional URL (fileUrl), you can modify the event object or pass it separately
          console.log('Opening dialog with file URL');
          event.imageUrl = fileUrl;
          this.dialog.open(CelebrationCardDialogComponent, {
            data: event, // Pass the additional URL as part of the data
            width: '400px'
          });
        }, fileServiceError => {
          console.error('Error retrieving file URL:', fileServiceError);
          // Handle errors from file service here
        });
      }
    }, error => {
      console.log(error);
      // Handle errors here, for example, logging them
    });

  }
  startConfetti() {
    // Generate confetti particles
    this.confetti = Array.from({ length: 100 }).map(() => ({
      style: {
        left: `${Math.random() * 100}%`,
        backgroundColor: this.getRandomColor(),
        // Add more randomized styles for animation, size, etc.
      }
    }));

    // Start the animation (if using JavaScript to animate, otherwise rely on CSS)
    setTimeout(() => {
      this.stopConfetti();
    }, 50000); // Stop after 5 seconds
  }

  stopConfetti() {
    // Clear the confetti particles
    this.confetti = [];
  }

  getRandomColor() {
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff']; // Add more colors
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
