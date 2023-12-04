import { Component, OnInit } from '@angular/core';
import { AnalyticService } from 'src/app/services/Analytics/analytic.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  active = 0

  constructor(
    public analyticsService: AnalyticService
  ) { }

  ngOnInit(): void {
    console.log('job page loaded');
  }
}
