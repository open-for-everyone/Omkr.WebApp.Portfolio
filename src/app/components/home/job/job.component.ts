import { Component, OnInit } from '@angular/core';
import { AnalyticService } from 'src/app/services/Analytics/analytic.service';
import { ExperienceService } from 'src/app/services/Portfolio/Experience/experience.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  experienceData: any;
  active = 0
  constructor(
    public analyticsService: AnalyticService,
    private experienceService: ExperienceService
  ) { }

  ngOnInit(): void {
    console.log('job page loaded');
    this.fetchExperienceData();
  }

  fetchExperienceData(): void {
    this.experienceService.getWorkExperiences().subscribe(
      (data) => {
        console.log('API Response:', data);  // Log the data to verify
        this.experienceData = data;
      },
      (error) => {
        console.error('Error fetching experience data', error);
      }
    );
  }
}
