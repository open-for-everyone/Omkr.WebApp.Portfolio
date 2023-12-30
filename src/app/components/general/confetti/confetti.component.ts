import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-confetti',
  templateUrl: './confetti.component.html',
  styleUrls: ['./confetti.component.css']
})
export class ConfettiComponent implements OnChanges {
  @Input() show = false;
  confetti: any[] = [];
  private intervalId: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && this.show) {
      this.startContinuousConfetti();
    } else {
      this.stopContinuousConfetti();
    }
  }

  startContinuousConfetti() {
    this.intervalId = setInterval(() => {
      this.createConfettiParticle();
    }, 500); // Adjust time interval as needed
  }

  stopContinuousConfetti() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.confetti = [];
  }

  createConfettiParticle() {
    const confetto = {
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        backgroundColor: this.getRandomColor(),
        width: `${this.getRandomSize()}px`,
        height: `${this.getRandomSize()}px`,
        animation: 'grow 1s forwards'
      }
    };
    this.confetti.push(confetto);

    // Optionally, remove the particle after the animation ends
    setTimeout(() => {
      this.confetti.shift();
    }, 1000); // Match the duration of the grow animation
  }

  getRandomColor() {
    const colors = ['#ff0', '#f0f', '#0ff', '#f00', '#0f0', '#00f'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getRandomSize() {
    return Math.random() * 10 + 5; // Size in pixels
  }
}
