import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { PageViewService } from 'src/app/services/PageView/page-view.service';
import { ConsentService } from 'src/app/services/general/consent.service';

/**
 * Records a view of the page it sits on, if the visitor allowed analytics.
 *
 * It no longer shows a count: views are now kept in the admin's central analytics, whose figures are
 * behind an admin login, and publishing a live traffic number to anyone who visits is not something
 * this site needs to do. The template renders nothing while there is no count to render.
 */
@Component({
  selector: 'app-page-view-counter',
  templateUrl: './page-view-counter.component.html',
  styleUrls: ['./page-view-counter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageViewCounterComponent implements OnInit {
  @Input() pageId!: string;

  constructor(private pageViewService: PageViewService, private consent: ConsentService) { }

  ngOnInit(): void {
    if (this.pageId && this.consent.isAllowed('analytics')) {
      this.pageViewService.incrementPageView(this.pageId).subscribe();
    }
  }
}
