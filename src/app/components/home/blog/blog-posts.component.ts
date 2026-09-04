import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BlogPostSummary } from 'src/app/models/content/site-content.model';
import { AnalyticService } from 'src/app/services/Analytics/analytic.service';
import { BlogFeedService } from 'src/app/services/content/blog-feed.service';
import { StructuredContentService } from 'src/app/services/content/structured-content.service';
import { RuntimeConfigService } from 'src/app/services/general/runtime-config.service';
import { environment } from 'src/environments/environment';

/** How many cards to show before sending the reader to the blog itself. */
const POST_LIMIT = 6;

/**
 * Writing from the sibling blog, surfaced on the portfolio.
 *
 * The section hides itself entirely when the feed returns nothing — an empty "From the blog" panel
 * is worse than no panel, and the blog is a separate origin that can be unreachable independently
 * of this site.
 *
 * Deliberately titled "From the blog" rather than "Latest posts": the blog's public index carries no
 * publication dates, so any claim about recency would be invented. See {@link BlogFeedService}.
 */
@Component({
  standalone: false,
  selector: 'app-blog-posts',
  templateUrl: './blog-posts.component.html',
  styleUrls: ['./blog-posts.component.css'],
})
export class BlogPostsComponent implements OnInit, OnDestroy {
  title = 'From the blog';
  posts: BlogPostSummary[] = [];
  loading = true;

  /** Fixed array: an inline literal in the template is a new identity on every check. */
  readonly skeletons = [0, 1, 2];

  private readonly destroyed$ = new Subject<void>();

  constructor(
    private feed: BlogFeedService,
    private structured: StructuredContentService,
    private config: RuntimeConfigService,
    public analyticsService: AnalyticService,
  ) {}

  /** Cross-site link, from shared runtime config with the build's value as fallback. */
  get blogUrl(): string {
    return this.config.text('url.blog', environment.blogUrl);
  }

  /** Nothing to show and nothing pending: the section renders no markup at all. */
  get isHidden(): boolean {
    return !this.loading && this.posts.length === 0;
  }

  ngOnInit(): void {
    this.feed
      .posts(POST_LIMIT)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((posts) => {
        this.posts = posts;
        this.loading = false;
      });

    this.structured
      .text('Blog.Title', 'From the blog')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((title) => (this.title = title));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  trackPost(_index: number, post: BlogPostSummary): string {
    return post.url;
  }

  onOpen(post: BlogPostSummary): void {
    this.analyticsService.sendAnalyticEvent('open_post', 'blog', post.title);
  }
}
