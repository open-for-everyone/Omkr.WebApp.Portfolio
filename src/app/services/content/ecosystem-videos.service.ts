import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface EcosystemWebsiteCard {
  key: string;
  name: string;
  url: string;
  icon?: string;
  badgeText?: string;
  tagline?: string;
  description?: string;
  showInEcosystemBar?: boolean;
  sortOrder?: number;
}

export interface EcosystemChannelCard {
  key: string;
  name: string;
  handle: string;
  platform: string;
  url: string;
  niche?: string;
  tagline?: string;
  isEnabled?: boolean;
}

export interface CatalogVideoItem {
  id: string;
  videoId: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  channelKey: string;
  channelName: string;
  channelHandle: string;
  platform: string;
  niche: string;
  language: string;
  format: string;
  sourceApp: string;
  views: number;
  viewsPerSubscriber: number;
  durationSeconds: number;
  tags: string[];
  publishedAtUtc: string;
}

export interface VideoFacetItem {
  value: string;
  label: string;
  count: number;
}

export interface VideoSearchResponse {
  items: CatalogVideoItem[];
  total: number;
  facets: {
    channels: VideoFacetItem[];
    niches: VideoFacetItem[];
    languages: VideoFacetItem[];
    formats: VideoFacetItem[];
  };
}

export interface EcosystemDirectorySnapshot {
  websites: EcosystemWebsiteCard[];
  channels: EcosystemChannelCard[];
}

const DEFAULT_ECOSYSTEM: EcosystemDirectorySnapshot = {
  websites: [
    {
      key: 'studio',
      name: 'AnimStudio AI',
      url: 'https://studio.keshavsingh.in',
      icon: 'movie_creation',
      badgeText: '3D Video Studio',
      description: 'Automated 3D animated stories, comedy shorts, and live quiz broadcasting.',
      showInEcosystemBar: true,
      sortOrder: 10,
    },
    {
      key: 'panchang',
      name: 'Hindu Panchang',
      url: 'https://panchang.keshavsingh.in',
      icon: 'brightness_5',
      badgeText: 'Daily Panchang & Katha',
      description: 'Live Tithi, Nakshatra, Shubh Muhurat, and daily devotional 3D katha reels.',
      showInEcosystemBar: true,
      sortOrder: 20,
    },
    {
      key: 'pratiyogita',
      name: 'Pratiyogita',
      url: 'https://pratiyogita.keshavsingh.in/winners',
      icon: 'emoji_events',
      badgeText: 'Live Quiz & Winners',
      description: 'Community competitions and verified Hall of Winners for YouTube live quizzes.',
      showInEcosystemBar: true,
      sortOrder: 30,
    },
    {
      key: 'social',
      name: 'SocialPulse Analytics',
      url: 'https://social.keshavsingh.in',
      icon: 'insights',
      badgeText: 'Outliers & Growth',
      description: 'Real-time YouTube channel analytics, Views / Subscriber outliers, and RPM tools.',
      showInEcosystemBar: true,
      sortOrder: 40,
    },
  ],
  channels: [
    {
      key: 'keshavsinghworld',
      name: 'Keshav Singh World',
      handle: '@keshavsinghworld',
      platform: 'YouTube',
      url: 'https://www.youtube.com/@keshavsinghworld',
      niche: 'Tech, Engineering & Ecosystem',
      isEnabled: true,
    },
    {
      key: 'omkarshivbhakti',
      name: 'Omkar Shiv Bhakti',
      handle: '@OmkarShivBhakti',
      platform: 'YouTube',
      url: 'https://www.youtube.com/@OmkarShivBhakti',
      niche: 'Devotional 3D Animations',
      isEnabled: true,
    },
    {
      key: 'keshavanimff',
      name: 'Keshav Anim FF',
      handle: '@KESHAV-ANIM-FF',
      platform: 'YouTube',
      url: 'https://www.youtube.com/@KESHAV-ANIM-FF',
      niche: '3D Comedy Shorts',
      isEnabled: true,
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class EcosystemVideosService {
  private directory$?: Observable<EcosystemDirectorySnapshot>;

  constructor(private http: HttpClient) {}

  getDirectory(): Observable<EcosystemDirectorySnapshot> {
    if (!this.directory$) {
      this.directory$ = this.http
        .get<{ websites?: EcosystemWebsiteCard[]; channels?: EcosystemChannelCard[] }>(
          `${environment.idpApiBaseUrl}/config`,
        )
        .pipe(
          map((res) => {
            const websites = (res?.websites ?? [])
              .filter((w) => w && w.url && w.showInEcosystemBar !== false)
              .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
            const channels = (res?.channels ?? []).filter((c) => c && c.isEnabled !== false);
            return {
              websites: websites.length > 0 ? websites : DEFAULT_ECOSYSTEM.websites,
              channels: channels.length > 0 ? channels : DEFAULT_ECOSYSTEM.channels,
            };
          }),
          catchError(() => of(DEFAULT_ECOSYSTEM)),
          shareReplay({ bufferSize: 1, refCount: false }),
        );
    }
    return this.directory$;
  }

  searchVideos(filters: {
    q?: string;
    channel?: string;
    locale?: string;
    format?: string;
    limit?: number;
  }): Observable<VideoSearchResponse> {
    let params = new HttpParams().set('limit', String(filters.limit ?? 18));
    if (filters.q?.trim()) params = params.set('q', filters.q.trim());
    if (filters.channel?.trim()) params = params.set('channel', filters.channel.trim());
    if (filters.locale && filters.locale !== 'all') params = params.set('locale', filters.locale);
    if (filters.format && filters.format !== 'all') params = params.set('format', filters.format);

    return this.http
      .get<VideoSearchResponse>(`${environment.idpApiBaseUrl}/videos/search`, { params })
      .pipe(
        catchError(() =>
          of({
            items: [],
            total: 0,
            facets: { channels: [], niches: [], languages: [], formats: [] },
          }),
        ),
      );
  }
}
