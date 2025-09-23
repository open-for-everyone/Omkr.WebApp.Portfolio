import { Injectable } from '@angular/core';

export type ConsentKey = 'analytics' | 'geolocation' | 'marketing';
export interface ConsentState { [k: string]: boolean }

const STORAGE_KEY = 'consent.v1';

@Injectable({ providedIn: 'root' })
export class ConsentService {
  private state: ConsentState;

  constructor() {
    this.state = this.load();
  }

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
