import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ConsentKey = 'analytics' | 'geolocation' | 'marketing';
export interface ConsentState { [k: string]: boolean }

const STORAGE_KEY = 'consent.v1';

@Injectable({ providedIn: 'root' })
export class ConsentService {
  private state: ConsentState;

  /**
   * Set when the visitor asks to review their choices again. Without this the banner only ever
   * appeared on a first visit, so anyone who declined once could never turn a feature back on —
   * "Use my location" would keep pointing at a banner that no longer existed.
   */
  private readonly reopened$ = new BehaviorSubject(false);

  constructor() {
    this.state = this.load();
  }

  /** Whether the consent panel should be on screen: undecided visitor, or one who reopened it. */
  get panelOpen$(): Observable<boolean> { return this.reopened$.asObservable(); }

  isPanelOpen(): boolean { return this.reopened$.value || !this.hasAnyDecision(); }

  /** Reopens the panel — from the footer's "Cookie settings", or from a blocked feature. */
  openPreferences(): void { this.reopened$.next(true); }

  closePreferences(): void { this.reopened$.next(false); }

  hasAnyDecision(): boolean {
    return Object.keys(this.state).length > 0;
  }

  isAllowed(key: ConsentKey): boolean {
    return !!this.state[key];
  }

  set(key: ConsentKey, allowed: boolean): void {
    this.state[key] = allowed;
    this.save();
  }

  setMany(entries: Partial<Record<ConsentKey, boolean>>): void {
    this.state = { ...this.state, ...entries };
    this.save();
  }

  reset(): void {
    this.state = {};
    localStorage.removeItem(STORAGE_KEY);
  }

  private load(): ConsentState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as ConsentState : {};
    } catch {
      return {};
    }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }
}
