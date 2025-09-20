import { Component, Input } from '@angular/core';

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  summary: string;
  stack: string[];
}

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent {
  @Input() title = 'Experience';
  @Input() items: ExperienceItem[] = [
    {
      company: 'Acme Inc.',
      role: 'Backend Developer',
      period: '2023 — Present',
      summary: 'Designing REST APIs, microservices, and CI/CD pipelines with emphasis on reliability and observability.',
      stack: ['.NET', 'Azure', 'Docker', 'PostgreSQL']
    },
    {
      company: 'TechWorks',
      role: 'Software Engineer',
      period: '2021 — 2023',
      summary: 'Delivered features across API, caching, and messaging, collaborating with cross-functional teams.',
      stack: ['Node.js', 'Redis', 'RabbitMQ', 'Angular']
    }
  ];
}
