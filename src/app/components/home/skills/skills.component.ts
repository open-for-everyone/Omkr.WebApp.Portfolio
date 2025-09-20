import { Component, Input } from '@angular/core';

interface Skill {
  name: string;
  level: number; // 0-100
  hint?: string;
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent {
  @Input() title = 'Skills';
  @Input() skills: Skill[] = [
    { name: 'C#/.NET', level: 85, hint: 'APIs, EF Core, Async, LINQ' },
    { name: 'Node.js', level: 75, hint: 'NestJS/Express, REST, Auth' },
    { name: 'SQL', level: 80, hint: 'PostgreSQL, MSSQL, query tuning' },
    { name: 'Azure/AWS', level: 70, hint: 'Functions, S3, IAM, CI/CD' },
    { name: 'Angular', level: 70, hint: 'Material, RxJS, state' },
    { name: 'Microservices', level: 65, hint: 'Queues, contracts, observability' }
  ];
}
