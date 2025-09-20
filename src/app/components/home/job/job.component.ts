import { Component, OnInit } from '@angular/core';
import { fadeInOut } from 'src/app/models/animations/animations';
import { AnalyticService } from 'src/app/services/Analytics/analytic.service';
import { ExperienceService } from 'src/app/services/Portfolio/Experience/experience.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css'],
  animations: [fadeInOut]
})
export class JobComponent implements OnInit {
  experienceData: Array<{ companyName: string; positionTitle: string; employmentPeriod: string; responsibilities: string[]; companyWebsite?: string }>|null = null;
  active = 0
  constructor(
    public analyticsService: AnalyticService,
    private experienceService: ExperienceService
  ) { }

  ngOnInit(): void {
    this.fetchExperienceData();
  }

  fetchExperienceData(): void {
    this.experienceService.getWorkExperiences().subscribe(
      (data) => { this.experienceData = data; },
      (error) => {
        console.error('Error fetching experience data', error);
      }
    );
  }
}
