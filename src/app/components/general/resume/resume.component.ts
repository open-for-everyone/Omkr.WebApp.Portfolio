import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ResumeData } from 'src/app/models/resume/resume.model';
import { ProfileService } from 'src/app/services/content/profile.service';
import { ResumePdfTemplateService } from 'src/app/services/resume/resume-pdf-template.service';
import { ResumeService } from 'src/app/services/resume/resume.service';

/**
 * The printable CV at `/resume`.
 *
 * Two ways out of here: the browser's own print dialog, and a generated PDF. The PDF is built by
 * {@link ResumePdfTemplateService} rather than inline, which is what let its two loading bugs sit
 * unnoticed behind a catch block that told the visitor to use Print instead.
 */
@Component({
  standalone: false,
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css'],
})
export class ResumeComponent implements OnInit, OnDestroy {
  generating = false;
  statusMsg = '';
  data?: ResumeData;

  /** File name offered in the save dialog. Admin-managed, with a sensible built-in default. */
  private fileName = 'Keshav_Singh_CV.pdf';

  private readonly destroyed$ = new Subject<void>();

  constructor(
    private resumeService: ResumeService,
    private pdf: ResumePdfTemplateService,
    private profile: ProfileService,
  ) {}

  ngOnInit(): void {
    this.resumeService
      .get()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => (this.data = data));

    this.profile.profile$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((profile) => (this.fileName = profile.resumeFileName));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  print(): void {
    window.print();
  }

  trackExp(_index: number, item: ResumeData['experience'][number]): string {
    return `${item.role}-${item.company}-${item.dateRange}`;
  }

  async downloadPdf(): Promise<void> {
    if (!this.data) {
      this.statusMsg = 'Resume is still loading — try again in a moment.';
      return;
    }

    this.generating = true;
    this.statusMsg = 'Generating PDF…';

    try {
      await this.pdf.download(this.data, this.fileName);
      this.statusMsg = 'Download ready.';
    } catch (error) {
      console.error('PDF generation failed', error);
      this.statusMsg = 'PDF generation failed. You can still use browser Print → Save as PDF.';
    } finally {
      this.generating = false;
    }
  }
}
