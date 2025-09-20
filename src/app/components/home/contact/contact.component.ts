import { Component } from '@angular/core';
import { fadeInOut } from 'src/app/models/animations/animations';
import { AnalyticService } from 'src/app/services/Analytics/analytic.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  animations: [fadeInOut]
})
export class ContactComponent {
  constructor(public analyticsService: AnalyticService) { }
}
