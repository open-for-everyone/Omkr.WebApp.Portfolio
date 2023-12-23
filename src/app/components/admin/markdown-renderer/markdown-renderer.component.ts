import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { marked } from 'marked';
import * as DOMPurify from 'dompurify';

@Component({
  selector: 'app-markdown-renderer',
  templateUrl: './markdown-renderer.component.html',
  styleUrls: ['./markdown-renderer.component.css']
})
export class MarkdownRendererComponent implements OnInit {
  htmlContent = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('https://github.com/keshavsingh4522/BasicConcept/wiki/GOF_Design_Pattern/Creational/Abstract.md', { responseType: 'text' })
      .subscribe(
        data => this.convertMarkdownToHtml(data),
        error => console.error(error)
      );
  }

  private convertMarkdownToHtml(markdown: string) {
    const dirtyHtml = marked(markdown);
    Promise.resolve(dirtyHtml).then(html => {
      this.htmlContent = DOMPurify.sanitize(html || '');
    });
  }
}
