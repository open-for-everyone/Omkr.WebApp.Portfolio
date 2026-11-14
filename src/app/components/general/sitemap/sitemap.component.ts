import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingStateComponent } from '../loading-state/loading-state.component';

interface SiteUrl { loc: string; changefreq?: string; priority?: string; }

@Component({
  standalone: true,
  imports: [CommonModule, LoadingStateComponent],
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.css']
})
export class SitemapComponent implements OnInit {
  urls: SiteUrl[] = [];
  raw = '';
  loading = true;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('/sitemap.xml', { responseType: 'text' }).subscribe({
      next: xml => {
        this.raw = xml;
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'application/xml');
        const nodes = Array.from(doc.querySelectorAll('urlset > url'));
        this.urls = nodes.map(n => ({
          loc: n.querySelector('loc')?.textContent || '',
          changefreq: n.querySelector('changefreq')?.textContent || undefined,
          priority: n.querySelector('priority')?.textContent || undefined
        }));
        this.loading = false;
      },
      error: () => {
        this.raw = 'sitemap.xml not found (try running: npm run sitemap && ng serve)';
        this.loading = false;
      }
    });
  }
}
