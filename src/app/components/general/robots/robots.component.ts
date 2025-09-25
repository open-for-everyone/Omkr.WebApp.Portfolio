import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-robots',
  templateUrl: './robots.component.html',
  styleUrls: ['./robots.component.css']
})
export class RobotsComponent implements OnInit {
  content = '';
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('/robots.txt', { responseType: 'text' }).subscribe({
      next: text => this.content = text,
      error: () => this.content = 'robots.txt not found (dev server may need rebuild).'
    });
  }
}
