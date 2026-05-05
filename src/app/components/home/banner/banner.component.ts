import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { AnalyticService } from 'src/app/services/Analytics/analytic.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  animations: [
    trigger('bannerTrigger', [
      transition(':enter', [
        query('.hero-text > *', [
          style({ opacity: 0, transform: 'translateY(24px)' }),
          stagger(120, [
            animate('450ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true }),
        query('.hero-avatar', [
          style({ opacity: 0, transform: 'scale(.92)' }),
          animate('600ms 200ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
        ], { optional: true })
      ])
    ])
  ]
})
export class BannerComponent implements OnInit, OnDestroy {
  /** Roles cycled through by the typing animation */
  readonly roles = ['Backend Developer', 'Cloud Engineer', '.NET Architect', 'API Designer'];

  currentRole = '';
  private roleIdx = 0;
  private charIdx = 0;
  private isTyping = true;
  private typingTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(public analyticsService: AnalyticService, private library: FaIconLibrary) {
    library.addIcons(faGithub, faLinkedinIn, faEnvelope);
  }

  ngOnInit(): void {
    this.type();
  }

  ngOnDestroy(): void {
    if (this.typingTimer) clearTimeout(this.typingTimer);
  }

  private type(): void {
    const target = this.roles[this.roleIdx];
    if (this.isTyping) {
      this.currentRole = target.slice(0, ++this.charIdx);
      if (this.charIdx >= target.length) {
        this.isTyping = false;
        this.typingTimer = setTimeout(() => this.type(), 2000);
        return;
      }
    } else {
      this.currentRole = target.slice(0, --this.charIdx);
      if (this.charIdx === 0) {
        this.isTyping = true;
        this.roleIdx = (this.roleIdx + 1) % this.roles.length;
      }
    }
    this.typingTimer = setTimeout(() => this.type(), this.isTyping ? 85 : 45);
  }
}
