import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { PageViewService } from 'src/app/services/PageView/page-view.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pageUrl = '';
  /**
   *
   */
  constructor(private renderer2: Renderer2, private pageViewService: PageViewService, private router: Router) {

  }
  ngOnInit(): void {
    this.pageUrl = this.router.url;
    this.renderer2.setStyle(document.body, "background-color", "#0a192f");
    this.pageViewService.incrementPageView(this.router.url).subscribe();
  }
}
