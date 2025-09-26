import { Component, OnInit } from '@angular/core';
import { ResumeService } from '../../../services/resume/resume.service';
import { ResumeData } from '../../../models/resume/resume.model';

/**
 * ResumeComponent
 * Provides a print & PDF export of the resume.
 */
@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {
  generating = false;
  statusMsg = '';
  data?: ResumeData;
  // Removed links section per latest requirement

  constructor(private resumeService: ResumeService) {}

  ngOnInit(): void {
    this.resumeService.get().subscribe(d => this.data = d);
  }

  print(): void { window.print(); }

  trackExp(index: number, item: ResumeData['experience'][number]): string {
    return `${item.role}-${item.company}-${item.dateRange}`;
  }

  async downloadPdf(): Promise<void> {
    if (!this.data) { this.statusMsg = 'Data not loaded yet.'; return; }
    this.generating = true;
    this.statusMsg = 'Generating PDF…';
    try {
  // Dynamic import pdfmake (lazy chunk) - will be slimmed by pre-build script editing node_modules
  const pdfMakeMod = await import('pdfmake/build/pdfmake');
  const vfsFonts = await import('pdfmake/build/vfs_fonts');
  (pdfMakeMod as unknown as { vfs: unknown }).vfs = (vfsFonts as unknown as { vfs: unknown }).vfs;

      const d = this.data;
  interface Txt { text?: string; style?: string; margin?: number[]; tocItem?: boolean; ul?: string[]; columns?: unknown; alignment?: string; }
      const toc: Txt[] = [ { text: d.name, style: 'header', tocItem: true }, { text: d.title, style: 'subheader', margin: [0,0,0,10] }];

      const section = (title: string): Txt => ({ text: title, style: 'sectionHeader', tocItem: true, margin: [0,16,0,6] });

      const expBlocks: Txt[] = d.experience.map(e => {
        const headerLine = `${e.role} — ${e.company} (${e.dateRange} | ${e.location})`;
        const base: Txt[] = [{ text: headerLine, style: 'role' }];
        if (e.project) base.push({ text: `Project: ${e.project}`, style: 'meta' });
        if (e.projects) base.push({ text: `Projects: ${e.projects.join(' • ')}`, style: 'meta' });
        if (e.bullets) base.push({ ul: [...e.bullets], style: 'bullets' }); // clone to avoid mutation
        if (e.projectGroups) {
          e.projectGroups.forEach(pg => {
            base.push({ text: pg.name, style: 'meta' });
            base.push({ ul: [...pg.bullets], style: 'bullets' }); // clone to avoid mutation
          });
        }
        return base;
      }).flat();

      const skills = d.skills;
      const skillSection: Txt[] = [
        { columns: [
          [ { text: 'Languages & Frameworks', style: 'skillCat' }, { text: skills.languagesFrameworks.join(', '), style: 'skillList' } ],
          [ { text: 'AWS', style: 'skillCat' }, { text: skills.aws.join(', '), style: 'skillList' } ],
        ]},
        { columns: [
          [ { text: 'Azure', style: 'skillCat' }, { text: skills.azure.join(', '), style: 'skillList' } ],
          [ { text: 'Databases', style: 'skillCat' }, { text: skills.databases.join(', '), style: 'skillList' } ]
        ]},
        { columns: [
          [ { text: 'DevOps & Tools', style: 'skillCat' }, { text: skills.devopsTools.join(', '), style: 'skillList' } ],
          [ { text: 'Security & Observability', style: 'skillCat' }, { text: skills.securityObservability.join(', '), style: 'skillList' } ]
        ]},
        { text: 'Other: ' + skills.other.join(', '), style: 'skillList', margin: [0,4,0,0] }
      ];

  const eduBlocks = d.education.map(ed => `${ed.degree}, ${ed.institution} (${ed.dateRange}) ${ed.aggregate ? ' – ' + ed.aggregate : ''}`);

  // Links removed from PDF per requirement

      // Minimal doc definition type (subset of pdfmake) for typing
      interface DocDef { content: unknown[]; styles?: Record<string, unknown>; footer?: unknown; info?: Record<string, string>; defaultStyle?: Record<string, unknown>; }
      const docDefinition: DocDef = {
        info: { title: `${d.name} – Resume` },
        content: [
          ...toc,
          { text: `Email: ${d.contact.email}  |  Mobile: ${d.contact.mobile}`, style: 'contact', margin: [0,0,0,6] },
          section('Summary'),
          { text: d.summary, style: 'body' },
          section('Experience'),
          ...expBlocks,
          section('Skills'),
          ...skillSection,
          section('Education'),
            { ul: eduBlocks, style: 'bullets' },
          // Links section removed
        ],
        footer: (currentPage: number, pageCount: number) => ({
          columns: [
            { text: d.name, style: 'footerName', alignment: 'left', margin: [40,0,0,0] },
            { text: `${currentPage} / ${pageCount}`, alignment: 'right', margin: [0,0,40,0], style: 'footerPage' }
          ], margin: [0,4]
        }),
        styles: {
          header: { fontSize: 18, bold: true },
          subheader: { fontSize: 10, italics: true, color: '#555' },
          sectionHeader: { fontSize: 11, bold: true, margin: [0,14,0,4], color: '#222', decoration: 'underline' },
          role: { bold: true, margin: [0,6,0,2] },
          meta: { fontSize: 8, color: '#555', margin: [0,0,0,2] },
          bullets: { fontSize: 9, margin: [0,0,0,4] },
          body: { fontSize: 9, margin: [0,0,0,4] },
          skillCat: { bold: true, fontSize: 8, margin: [0,4,0,1] },
          skillList: { fontSize: 8 },
          footerName: { fontSize: 7, color: '#555' },
          footerPage: { fontSize: 7, color: '#555' },
          contact: { fontSize: 8, color: '#222' }
        },
        defaultStyle: { fontSize: 9 }
      };
      (pdfMakeMod as { createPdf: (def: DocDef) => { download: (n: string) => void } })
        .createPdf(docDefinition)
        .download('Keshav_Singh_Resume.pdf');
      this.statusMsg = 'Download ready.';
    } catch (err) {
      console.error('pdfmake generation failed', err);
      this.statusMsg = 'PDF generation failed. You can still use browser Print → Save as PDF.';
    } finally {
      setTimeout(() => { this.generating = false; }, 500);
    }
  }
}
