import { Component } from '@angular/core';
import { AnalyticService } from 'src/app/services/Analytics/analytic.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  handleImageKeyUp($event: KeyboardEvent) {
    console.log($event.type);
}
  constructor(public analyticsService: AnalyticService) { }
}
