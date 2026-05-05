import { Component } from '@angular/core';
import { AnalyticService } from 'src/app/services/Analytics/analytic.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  readonly keySkills = [
    '.NET Core', 'AWS', 'Azure', 'Azure DevOps',
    'Microservices', 'Swagger', 'Jira', 'TDD', 'CI/CD', 'gRPC'
  ];

  constructor(public readonly analyticsService: AnalyticService) {}
}
