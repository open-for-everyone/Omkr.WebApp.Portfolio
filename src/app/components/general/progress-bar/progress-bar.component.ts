import { animate, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
  animations: [
    trigger('animateProgressBar', [
      transition('* => *', [
        animate('1s ease-in-out', style({ width: '{{progress}}%' })),
      ]),
    ]),
  ],
})
export class ProgressBarComponent {
  progress = 0;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollTop = window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    const height = this.document.documentElement.scrollHeight - this.document.documentElement.clientHeight;
    this.progress = (scrollTop / height) * 100;
  }
}
