import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { BlogPostSummary } from 'src/app/models/content/site-content.model';
import { environment } from 'src/environments/environment';

/** A node of the blog's generated `structure.json` tree. */
interface StructureNode {
  name: string;
  path: string;
  isDirectory: boolean;
  title?: string;
  tags?: string[];
  children?: StructureNode[];
}

/** Hard ceiling on tree traversal, so a malformed or cyclic document cannot hang the page. */
const MAX_DEPTH = 12;

/**
 * Surfaces writing from the sibling blog (`content-blog`) on the portfolio.
 *
 * The blog publishes `structure.json` at its web root — a tree of every markdown document with its
 * title and tags — and renders a document at `#/file?path=<repo-relative path>`. That file is the
 * only public index the blog has, so it is what this reads.
 *
 * **It carries no publication dates.** So this deliberately does not claim to show "latest" posts:
 * it shows a selection, and the admin decides which ones through the `blog` content key. Sorting by
 * a date the source does not have would be inventing one.
 *
 * Cross-origin: the blog is a separate GitHub Pages origin, which serves static files with
 * `Access-Control-Allow-Origin: *`. If that ever stops being true, this resolves to an empty list
 * and the section hides itself rather than showing a broken panel.
 */
@Injectable({ providedIn: 'root' })
export class BlogFeedService {
  private posts$?: Observable<BlogPostSummary[]>;

  constructor(private http: HttpClient) {}

  /**
   * Documents from the blog's index.
   *
   * @param limit maximum number of cards to return
   * @returns post summaries; an empty list on any failure, never an error
   */
  posts(limit: number): Observable<BlogPostSummary[]> {
    if (!this.posts$) {
      const url = `${this.blogBase()}/structure.json`;
      this.posts$ = this.http.get<StructureNode>(url).pipe(
        map((root) => this.flatten(root)),
        catchError(() => of<BlogPostSummary[]>([])),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    }
    return this.posts$.pipe(map((posts) => posts.slice(0, Math.max(0, limit))));
  }

  /** Collects every markdown leaf in the tree into a renderable summary. */
  private flatten(root: StructureNode | null): BlogPostSummary[] {
    if (!root) return [];

    const out: BlogPostSummary[] = [];

    const walk = (node: StructureNode, depth: number): void => {
      if (!node || depth > MAX_DEPTH) return;

      if (node.isDirectory) {
        const children = Array.isArray(node.children) ? node.children : [];
        for (const child of children) walk(child, depth + 1);
        return;
      }

      if (typeof node.path !== 'string' || !node.path.toLowerCase().endsWith('.md')) return;

      // `name` is not guaranteed by the generator, so the path's last segment is the last resort.
      const fallbackName = node.name ?? node.path.split('/').pop() ?? node.path;

      out.push({
        title: node.title?.trim() || this.humanise(fallbackName),
        url: this.postUrl(node.path),
        tags: Array.isArray(node.tags) ? node.tags.slice(0, 3) : [],
      });
    };

    walk(root, 0);
    return out;
  }

  /** The blog renders documents from a hash route, so the path travels as a query parameter. */
  private postUrl(path: string): string {
    return `${this.blogBase()}/#/file?path=${encodeURIComponent(path)}`;
  }

  private blogBase(): string {
    return environment.blogUrl.replace(/\/+$/, '');
  }

  private humanise(name: string): string {
    const stem = name.replace(/\.md$/i, '').replace(/[-_.]+/g, ' ').trim();
    return stem.length > 0 ? stem[0].toUpperCase() + stem.slice(1) : name;
  }
}
