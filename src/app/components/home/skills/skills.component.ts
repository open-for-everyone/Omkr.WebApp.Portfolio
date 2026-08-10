import { Component, Input } from '@angular/core';

interface SkillCategory {
  label: string;
  icon: string;
  skills: string[];
}

@Component({
  standalone: false,
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent {
  @Input() title = 'Tech Stack';

  @Input() categories: SkillCategory[] = [
    {
      label: 'Backend',
      icon: 'memory',
      skills: ['C#', '.NET Core', 'ASP.NET Web API', 'Node.js', 'NestJS', 'gRPC', 'Entity Framework', 'LINQ', 'MassTransit', 'SignalR']
    },
    {
      label: 'Cloud & DevOps',
      icon: 'cloud',
      skills: ['Azure', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Azure DevOps', 'JFROG', 'SonarQube', 'Datadog', 'SQS', 'Lambda']
    },
    {
      label: 'Databases',
      icon: 'storage',
      skills: ['SQL Server', 'PostgreSQL', 'Redis', 'MongoDB', 'Azure Cosmos DB', 'AWS RDS']
    },
    {
      label: 'Frontend',
      icon: 'web',
      skills: ['Angular', 'TypeScript', 'HTML', 'CSS', 'Bootstrap', 'Angular Material', 'Blazor']
    },
    {
      label: 'Architecture & Practices',
      icon: 'hub',
      skills: ['Microservices', 'Event-Driven', 'REST APIs', 'OAuth2 / OpenID', 'TDD', 'DDD', 'Agile / Scrum', 'Clean Architecture']
    }
  ];
}
