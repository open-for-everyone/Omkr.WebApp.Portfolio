import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingStateComponent } from '../loading-state/loading-state.component';

@Component({
  standalone: true,
  imports: [CommonModule, LoadingStateComponent],
  selector: 'app-robots',
  templateUrl: './robots.component.html',
  styleUrls: ['./robots.component.css']
})
export class RobotsComponent implements OnInit {
  content = '';
  loading = true;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('/robots.txt', { responseType: 'text' }).subscribe({
      next: text => { this.content = text; this.loading = false; },
      error: () => { this.content = 'robots.txt not found (dev server may need rebuild).'; this.loading = false; }
    });
  }
}
