import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageViewService } from 'src/app/services/PageView/page-view.service';
import { ConsentService } from 'src/app/services/general/consent.service';
import { SeoService } from 'src/app/services/general/seo.service';

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
  constructor(private pageViewService: PageViewService, private router: Router,
    private dialog: MatDialog,
    private consent: ConsentService,
    private seo: SeoService) {

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
    // Ensure description exists if navigated directly (SSR/prerender safety net)
    this.seo.update({
      description: 'Backend developer portfolio showcasing APIs, microservices, AWS, Azure DevOps and software engineering projects.'
    });
    if (this.consent.isAllowed('analytics')) {
      this.pageViewService.incrementPageView(this.router.url).subscribe();
    }
  }
  startConfetti() {
    this.confetti = Array.from({ length: 100 }).map(() => ({
      style: {
        left: `${Math.random() * 100}%`,
        backgroundColor: this.getRandomColor(),
      }
    }));
    setTimeout(() => {
      this.stopConfetti();
    }, 50000); // Stop after 5 seconds
  }

  stopConfetti() {
    this.confetti = [];
  }

  getRandomColor() {
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff']; // Add more colors
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
