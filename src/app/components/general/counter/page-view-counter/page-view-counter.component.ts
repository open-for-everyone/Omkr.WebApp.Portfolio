import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageViewDetail } from 'src/app/models/PageView/page-view-detail';
import { PageViewService } from 'src/app/services/PageView/page-view.service';

@Component({
  selector: 'app-page-view-counter',
  templateUrl: './page-view-counter.component.html',
  styleUrls: ['./page-view-counter.component.css']
})
export class PageViewCounterComponent implements OnInit {

  @Input() pageId = '';
  viewCount = 0;

  /**
   *
   */
  constructor(private pageViewService: PageViewService, private router: Router) {
  }
  ngOnInit(): void {
    this.getPageViewCount();
  }

  getPageViewCount(): void {
    console.log('Page counter url: ' + this.router.url);
    this.pageViewService.getPageViewCount(this.router.url).subscribe(
      (pageViewDetail: PageViewDetail) => {
        this.viewCount = pageViewDetail.viewCount;
        console.log('Response View count: ' + pageViewDetail.viewCount);
        console.log('Response View:', pageViewDetail);
      },
      (error) => {
        console.error('Error fetching view count:', error);
      }
    );
  }
}
