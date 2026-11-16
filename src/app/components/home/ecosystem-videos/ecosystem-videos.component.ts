import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import {
  CatalogVideoItem,
  EcosystemChannelCard,
  EcosystemVideosService,
  EcosystemWebsiteCard,
  VideoFacetItem,
} from 'src/app/services/content/ecosystem-videos.service';

@Component({
  standalone: false,
  selector: 'app-ecosystem-videos',
  templateUrl: './ecosystem-videos.component.html',
  styleUrls: ['./ecosystem-videos.component.css'],
})
export class EcosystemVideosComponent implements OnInit, OnDestroy {
  websites: EcosystemWebsiteCard[] = [];
  channels: EcosystemChannelCard[] = [];
  videos: CatalogVideoItem[] = [];
  channelFacets: VideoFacetItem[] = [];
  totalVideos = 0;

  loadingDirectory = true;
  loadingVideos = true;

  query = '';
  selectedChannel = '';
  selectedLocale = 'all';
  selectedFormat = 'all';

  private readonly searchInput$ = new Subject<string>();
  private readonly destroyed$ = new Subject<void>();

  constructor(private ecosystemVideos: EcosystemVideosService) {}

  ngOnInit(): void {
    this.ecosystemVideos
      .getDirectory()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((dir) => {
        this.websites = dir.websites;
        this.channels = dir.channels;
        this.loadingDirectory = false;
      });

    this.searchInput$
      .pipe(debounceTime(260), distinctUntilChanged(), takeUntil(this.destroyed$))
      .subscribe((q) => {
        this.query = q;
        this.loadVideos();
      });

    this.loadVideos();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onQueryChange(value: string): void {
    this.searchInput$.next(value);
  }

  selectChannel(handle: string): void {
    this.selectedChannel = this.selectedChannel === handle ? '' : handle;
    this.loadVideos();
  }

  selectLocale(locale: string): void {
    this.selectedLocale = locale;
    this.loadVideos();
  }

  selectFormat(format: string): void {
    this.selectedFormat = format;
    this.loadVideos();
  }

  resetFilters(): void {
    this.query = '';
    this.selectedChannel = '';
    this.selectedLocale = 'all';
    this.selectedFormat = 'all';
    this.loadVideos();
  }

  trackWebsite(_: number, item: EcosystemWebsiteCard): string {
    return item.key || item.url;
  }

  trackVideo(_: number, item: CatalogVideoItem): string {
    return item.videoId || item.id;
  }

  private loadVideos(): void {
    this.loadingVideos = true;
    this.ecosystemVideos
      .searchVideos({
        q: this.query,
        channel: this.selectedChannel,
        locale: this.selectedLocale,
        format: this.selectedFormat,
        limit: 18,
      })
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.videos = res.items ?? [];
        this.totalVideos = res.total ?? 0;
        this.channelFacets = res.facets?.channels ?? [];
        this.loadingVideos = false;
      });
  }
}
