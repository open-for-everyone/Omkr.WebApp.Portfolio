import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { PageViewService } from 'src/app/services/PageView/page-view.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PageViewDetail } from 'src/app/models/PageView/page-view-detail';
import { ConsentService } from 'src/app/services/general/consent.service';

@Component({
  selector: 'app-page-view-counter',
  templateUrl: './page-view-counter.component.html',
  styleUrls: ['./page-view-counter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageViewCounterComponent implements OnInit {
  @Input() pageId!: string;
  pageViewCount$!: Observable<number>;

  constructor(private pageViewService: PageViewService, private consent: ConsentService) { }

  ngOnInit(): void {
    if (this.pageId && this.consent.isAllowed('analytics')) {
      this.pageViewService.incrementPageView(this.pageId).subscribe();
      this.pageViewCount$ = this.pageViewService.getPageViewCount(this.pageId).pipe(
        map((detail: PageViewDetail) => detail.viewCount)
      );
    }
  }
}
