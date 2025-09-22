import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit, OnDestroy {
  now = new Date();
  private timerId?: number;

  ngOnInit(): void {
    this.timerId = window.setInterval(() => {
      this.now = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      window.clearInterval(this.timerId);
    }
  }

  get time(): string {
    return this.now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  get date(): string {
    return this.now.toLocaleDateString([], { weekday: 'short', month: 'short', day: '2-digit' });
  }
}
