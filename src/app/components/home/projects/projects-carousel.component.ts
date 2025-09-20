import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Project {
  title: string;
  image: string;
  summary: string;
  tags: string[];
  link?: string;
}

@Component({
  selector: 'app-projects-carousel',
  templateUrl: './projects-carousel.component.html',
  styleUrls: ['./projects-carousel.component.css']
})
export class ProjectsCarouselComponent {
  constructor(private dialog: MatDialog) {}

  projects: Project[] = [
    { title:'Payments API', image:'assets/images/keshav-singh-portfolio-preview.png', summary:'High-throughput .NET microservice with idempotency, metrics and retries.', tags:['.NET','PostgreSQL','Docker'], link:'https://github.com' },
    { title:'Docs Portal', image:'assets/images/keshav-singh-portfolio-preview.png', summary:'Angular + Swagger UI portal with role-based access.', tags:['Angular','Swagger'], link:'https://github.com' },
    { title:'Events Pipeline', image:'assets/images/keshav-singh-portfolio-preview.png', summary:'Event-driven pipeline with queues, DLQs and observability.', tags:['Node.js','RabbitMQ','Grafana'] }
  ];

  openDetails(p: Project){
    this.dialog.open(ProjectDialogComponent, { data: p, panelClass: 'project-dialog' });
  }
}

@Component({
  selector: 'app-project-dialog',
  template: `
  <div class="dialog">
  <img [src]="data.image" alt="Project image" loading="lazy" width="800" height="450" />
    <h3>{{ data.title }}</h3>
    <p>{{ data.summary }}</p>
    <div class="chips">
      <span class="chip" *ngFor="let t of data.tags">{{ t }}</span>
    </div>
    <div style="margin-top:1rem;">
      <a class="btn-modern" *ngIf="data.link" [href]="data.link" target="_blank">View Repo</a>
    </div>
  </div>
  `,
  styles: [`
    .dialog { max-width:680px; padding:1rem; }
    img{ width:100%; border-radius:12px; margin-bottom:.6rem; }
    h3{ color:#e6eef8; margin:.25rem 0; }
    p{ margin:0; }
    .chips{ display:flex; gap:.4rem; flex-wrap:wrap; margin-top:.6rem; }
    .chip{ background:rgba(255,255,255,0.06); padding:.25rem .6rem; border-radius:999px; font-size:.8rem; }
  `]
})
export class ProjectDialogComponent { constructor(@Inject(MAT_DIALOG_DATA) public data: Project){} }
