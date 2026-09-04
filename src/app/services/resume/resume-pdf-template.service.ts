import { Injectable } from '@angular/core';
import type { Content, TDocumentDefinitions, TVirtualFileSystem } from 'pdfmake/interfaces';
import { ResumeData } from 'src/app/models/resume/resume.model';

/** The slice of pdfmake's API this service uses. */
interface PdfMakeApi {
  createPdf(definition: TDocumentDefinitions): { download(fileName: string): void };
  addVirtualFileSystem(vfs: TVirtualFileSystem): void;
}

/**
 * Builds and downloads the CV as a PDF.
 *
 * This file existed as a zero-byte placeholder alongside two other empty resume-builder services,
 * while the generation code sat inline in `ResumeComponent` — where it did not work. Two bugs kept
 * every "Download PDF" click falling into the catch block and showing "PDF generation failed. You
 * can still use browser Print":
 *
 * 1. It registered fonts with `pdfMake.vfs = vfsFonts.vfs`. That was the pdfmake 0.2 API; 0.3 (the
 *    version installed) requires `addVirtualFileSystem(vfs)`, and `vfs_fonts` exports the font table
 *    as its whole module rather than under a `.vfs` property, so the assigned value was `undefined`
 *    either way.
 * 2. It called `createPdf` on the module namespace. pdfmake ships a UMD bundle, so under the
 *    bundler's CommonJS interop the callable object arrives as the namespace's `default`.
 *
 * Both module shapes are now probed rather than assumed, since which one you get depends on bundler
 * interop settings that are easy to change by accident.
 *
 * pdfmake and its embedded fonts are ~2 MB, so the import stays dynamic: the cost is paid on the
 * first click, not on every page load.
 */
@Injectable({ providedIn: 'root' })
export class ResumePdfTemplateService {
  /** Resolved once and reused — re-importing would re-register the fonts on every download. */
  private pdfMake?: PdfMakeApi;

  /**
   * Generates the CV and hands it to the browser's downloader.
   *
   * @param data     resume content, as rendered on `/resume`
   * @param fileName name offered in the save dialog
   * @throws if pdfmake cannot be loaded; the caller reports it and points at browser Print instead
   */
  async download(data: ResumeData, fileName: string): Promise<void> {
    const pdfMake = await this.load();
    pdfMake.createPdf(this.build(data)).download(fileName);
  }

  private async load(): Promise<PdfMakeApi> {
    if (this.pdfMake) return this.pdfMake;

    // Typed as unknown deliberately: the runtime shape depends on interop, so it is probed below
    // rather than trusted from the declaration files.
    const pdfMakeModule: unknown = await import('pdfmake/build/pdfmake');
    const vfsModule: unknown = await import('pdfmake/build/vfs_fonts');

    const api = this.resolveApi(pdfMakeModule);
    if (!api) throw new Error('pdfmake loaded but exposes no createPdf()');

    const vfs = this.resolveVfs(vfsModule);
    if (vfs) api.addVirtualFileSystem(vfs);

    this.pdfMake = api;
    return api;
  }

  /** Accepts either the module namespace or its `default`, whichever actually carries the API. */
  private resolveApi(module: unknown): PdfMakeApi | null {
    for (const candidate of this.candidates(module)) {
      const maybe = candidate as Partial<PdfMakeApi>;
      if (typeof maybe.createPdf === 'function' && typeof maybe.addVirtualFileSystem === 'function') {
        return maybe as PdfMakeApi;
      }
    }
    return null;
  }

  /** The font table is the module itself, so `default` is preferred and the namespace is the fallback. */
  private resolveVfs(module: unknown): TVirtualFileSystem | null {
    for (const candidate of this.candidates(module)) {
      if (candidate && typeof candidate === 'object' && Object.keys(candidate).length > 0) {
        return candidate as TVirtualFileSystem;
      }
    }
    return null;
  }

  private candidates(module: unknown): unknown[] {
    if (!module || typeof module !== 'object') return [];
    const withDefault = module as { default?: unknown };
    return withDefault.default ? [withDefault.default, module] : [module];
  }

  // ------------------------------ document ---------------------------------

  private build(data: ResumeData): TDocumentDefinitions {
    return {
      info: { title: `${data.name} – Resume`, author: data.name },
      pageMargins: [40, 40, 40, 50],
      content: [
        { text: data.name, style: 'header' },
        { text: data.title, style: 'subheader' },
        { text: this.contactLine(data), style: 'contact' },
        this.section('Summary'),
        { text: data.summary, style: 'body' },
        this.section('Experience'),
        ...this.experience(data),
        this.section('Skills'),
        ...this.skills(data),
        this.section('Education'),
        {
          ul: data.education.map(
            (entry) =>
              `${entry.degree}, ${entry.institution} (${entry.dateRange})` +
              (entry.aggregate ? ` – ${entry.aggregate}` : ''),
          ),
          style: 'bullets',
        },
      ],
      footer: (currentPage: number, pageCount: number) => ({
        columns: [
          { text: data.name, alignment: 'left', margin: [40, 0, 0, 0], style: 'footerText' },
          {
            text: `${currentPage} / ${pageCount}`,
            alignment: 'right',
            margin: [0, 0, 40, 0],
            style: 'footerText',
          },
        ],
        margin: [0, 4],
      }),
      styles: {
        header: { fontSize: 20, bold: true, margin: [0, 0, 0, 2] },
        subheader: { fontSize: 11, italics: true, color: '#555555', margin: [0, 0, 0, 6] },
        contact: { fontSize: 8, color: '#222222', margin: [0, 0, 0, 6] },
        sectionHeader: {
          fontSize: 11,
          bold: true,
          color: '#222222',
          decoration: 'underline',
          margin: [0, 14, 0, 4],
        },
        role: { bold: true, fontSize: 10, margin: [0, 6, 0, 2] },
        meta: { fontSize: 8, color: '#555555', margin: [0, 0, 0, 2] },
        bullets: { fontSize: 9, margin: [0, 0, 0, 4] },
        body: { fontSize: 9, margin: [0, 0, 0, 4] },
        skillCat: { bold: true, fontSize: 8, margin: [0, 4, 0, 1] },
        skillList: { fontSize: 8 },
        footerText: { fontSize: 7, color: '#555555' },
      },
      defaultStyle: { fontSize: 9 },
    };
  }

  private contactLine(data: ResumeData): string {
    return [
      `Email: ${data.contact.email}`,
      `Mobile: ${data.contact.mobile}`,
      data.contact.portfolio,
      data.contact.locations.join(' / '),
    ]
      .filter((part) => !!part)
      .join('  |  ');
  }

  private section(title: string): Content {
    return { text: title, style: 'sectionHeader' };
  }

  private experience(data: ResumeData): Content[] {
    const blocks: Content[] = [];

    for (const entry of data.experience) {
      blocks.push({
        text: `${entry.role} — ${entry.company} (${entry.dateRange} | ${entry.location})`,
        style: 'role',
      });

      if (entry.project) blocks.push({ text: `Project: ${entry.project}`, style: 'meta' });
      if (entry.projects?.length) {
        blocks.push({ text: `Projects: ${entry.projects.join(' • ')}`, style: 'meta' });
      }
      // Cloned: pdfmake mutates the arrays it is handed, which would corrupt the cached resume data
      // and make a second download differ from the first.
      if (entry.bullets?.length) blocks.push({ ul: [...entry.bullets], style: 'bullets' });

      for (const group of entry.projectGroups ?? []) {
        blocks.push({ text: group.name, style: 'meta' });
        blocks.push({ ul: [...group.bullets], style: 'bullets' });
      }
    }

    return blocks;
  }

  private skills(data: ResumeData): Content[] {
    const s = data.skills;
    const pair = (leftLabel: string, left: string[], rightLabel: string, right: string[]): Content => ({
      columns: [
        [
          { text: leftLabel, style: 'skillCat' },
          { text: left.join(', '), style: 'skillList' },
        ],
        [
          { text: rightLabel, style: 'skillCat' },
          { text: right.join(', '), style: 'skillList' },
        ],
      ],
    });

    return [
      pair('Languages & Frameworks', s.languagesFrameworks, 'AWS', s.aws),
      pair('Azure', s.azure, 'Databases', s.databases),
      pair('DevOps & Tools', s.devopsTools, 'Security & Observability', s.securityObservability),
      { text: `Other: ${s.other.join(', ')}`, style: 'skillList', margin: [0, 4, 0, 0] },
    ];
  }
}
