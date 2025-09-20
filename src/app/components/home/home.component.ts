import { Component, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageViewService } from 'src/app/services/PageView/page-view.service';
import { CelebrationCardDialogService } from 'src/app/services/general/celebration/celebration-card-dialog.service';
import { CelebrationCardDialogComponent } from '../general/celebration-card-dialog/celebration-card-dialog.component';
import { FileService } from 'src/app/services/general/file/file.service';

interface ConfettiParticle { style: { left: string; backgroundColor: string } }

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnChanges {

  pageUrl = '';
  currentEvent: unknown = null;
  @Input() show = false;
  confetti: ConfettiParticle[] = [];
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
    this.pageViewService.incrementPageView(this.router.url).subscribe();

    this.celebrationDialogService.getEventForCurrentDate().subscribe(event => {
      if (event) {
        this.fileService.getUrl2(event.imageUrl).subscribe(fileUrl => {
          event.imageUrl = fileUrl;
          this.dialog.open(CelebrationCardDialogComponent, {
            data: event,
            width: '400px'
          });
        }, fileServiceError => {
          console.error('Error retrieving file URL:', fileServiceError);
        });
      }
    }, error => {
      console.error('Error fetching celebration event:', error);
    });

  }
  startConfetti() {
    // Generate confetti particles
    this.confetti = Array.from({ length: 100 }).map(() => ({
      style: {
        left: `${Math.random() * 100}%`,
        backgroundColor: this.getRandomColor(),
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
