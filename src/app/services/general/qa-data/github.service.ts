import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface GithubRepo {
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  language: string;
  forks_count: number;
  updated_at: string;
  topics?: string[];
}

export interface GithubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
}

@Injectable({ providedIn: 'root' })
export class GithubService {
  constructor(private http: HttpClient){}

  private ttlMs = 5 * 60 * 1000; // 5 minutes

  private getCache<T>(key: string): T | null {
    try{
      const raw = localStorage.getItem(key);
      if(!raw) return null;
      const parsed = JSON.parse(raw) as { ts: number; data: T };
      if(Date.now() - parsed.ts > this.ttlMs){
        localStorage.removeItem(key);
        return null;
      }
      return parsed.data;
    } catch{ return null; }
  }

  private setCache<T>(key: string, data: T){
    try{ localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })); } catch(_e){ /* ignore quota */ }
  }

  getUser(username = environment.github.username): Observable<GithubUser | null> {
    const key = `gh:user:${username}`;
    const cached = this.getCache<GithubUser>(key);
    if(cached) return of(cached);
    return this.http.get<GithubUser>(`${environment.github.apiBase}/users/${username}`, { headers: { Accept: 'application/vnd.github+json' } }).pipe(
      map(u => { this.setCache(key, u); return u; }),
      catchError(() => of(null))
    );
  }

  getRecentRepos(username = environment.github.username, perPage = 8, page = 1): Observable<GithubRepo[]> {
    const key = `gh:repos:${username}:${perPage}:${page}`;
    const cached = this.getCache<GithubRepo[]>(key);
    if(cached) return of(cached);
    const url = `${environment.github.apiBase}/users/${username}/repos?sort=updated&per_page=${perPage}&page=${page}`;
    return this.http.get<GithubRepo[]>(url, { headers: { Accept: 'application/vnd.github+json' } }).pipe(
      map(list => list.filter(r => !r.name.toLowerCase().includes('test'))),
      map(list => { this.setCache(key, list); return list; }),
      catchError(() => of([]))
    );
  }

  getRepoTopics(owner = environment.github.username, repo: string): Observable<string[]>{
    const key = `gh:topics:${owner}:${repo}`;
    const cached = this.getCache<string[]>(key);
    if(cached) return of(cached);
    const url = `${environment.github.apiBase}/repos/${owner}/${repo}/topics`;
    return this.http.get<{names:string[]}>(url, { headers: { Accept: 'application/vnd.github.mercy-preview+json' } })
      .pipe(
        map(r => r.names||[]),
        map(names => { this.setCache(key, names); return names; }),
        catchError(() => of([]))
      );
  }
}
