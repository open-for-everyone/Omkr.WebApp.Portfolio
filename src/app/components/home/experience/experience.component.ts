import { Component, Input } from '@angular/core';

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  summary: string;
  stack: string[];
}

@Component({
  standalone: false,
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent {
  @Input() title = 'Experience';
  @Input() items: ExperienceItem[] =[
  {
    company: "Publicis Sapient",
    role: "Senior Associate Technology L1",
    period: "July 2025 — Present",
    summary: "Created landing page using Angular based on Figma design for UPS Prism project.",
    stack: [ ".Net core", "JFROG","Azure DevOps", "Angular", "Figma", "TypeScript", "HTML", "CSS", "JavaScript", "Bootstrap", "Material UI", "Git" , "Slingshot", "SonarQube", "OpenAPI" , "Swagger" , "Postman", "RESTful APIs", "Entity Framework" , "SQL Server", "LINQ" , "Asynchronous Programming" , "Dependency Injection" , "AutoMapper" , "Moq" , "xUnit" , "NUnit" , "TDD", "Agile", "Scrum", "Kanban", "CI/CD", "Docker", "Kubernetes"," Microservices", "gRPC", "RabbitMQ", "OAuth2", "OpenID Connect", "Azure AD B2C", "SignalR", "Datadog", "MassTransit"]
  },
  {
    company: "R Systems",
    role: "Senior Software Engineer",
    period: "Feb 2024 — July 2025",
    summary: "Delivered multiple POCs and solutions including ARM deployments, OAuth integration with Azure AD B2C, push notifications with SignalR, Kubernetes deployments, Datadog integration, microservices migration using gRPC, and event-driven architecture with AWS services. Assisted team with Angular, Blazor, .NET Core, Azure, and Power Platform tasks.",
    stack: [".NET Core", "Angular", "Blazor", "Azure", "Kubernetes", "AWS", "gRPC", "Datadog", "SignalR", "MassTransit"]
  },
  {
    company: "Marlabs",
    role: "Backend Developer",
    period: "July 2023 — Oct 2023",
    summary: "Developed APIs with Entity Framework and optimized code. Integrated AWS KMS for encryption/decryption at model binder level.",
    stack: [".NET Core", "Entity Framework", "AWS KMS", "SQL"]
  },
  {
    company: "Unthinkable Solutions LLP",
    role: "Backend .NET Developer",
    period: "Jan 2021 — July 2023",
    summary: "Implemented gRPC microservices with .NET Core, improved API performance by 40% using AWS SQS and MassTransit, created reusable NuGet packages, prepared RCA reports, practiced TDD with NUnit & MOQ, worked on POCs and agile methodologies. Delivered RESTful APIs using AWS Serverless stack for Push Doctor project with MFA and OAuth flows, and built event-driven Customer Support APIs using Event Bus, AppFlow, Lambda, and Salesforce.",
    stack: [".NET Core", "gRPC", "AWS", "SQS", "MassTransit", "NuGet", "NUnit", "MOQ", "API Gateway", "Lambda", "Salesforce"]
  }
];
}
