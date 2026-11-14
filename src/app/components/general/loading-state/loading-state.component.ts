import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (variant() === 'cards') {
      <div class="pf-skel-cards" role="status" [attr.aria-label]="message()">
        @for (item of items(); track item) {
          <div class="pf-skel-card">
            <div class="pf-skel pf-skel-title"></div>
            <div class="pf-skel pf-skel-line"></div>
            <div class="pf-skel pf-skel-line short"></div>
          </div>
        }
      </div>
    } @else if (variant() === 'spinner') {
      <div class="pf-loading-spinner" role="status" aria-live="polite">
        <span class="pf-spinner" aria-hidden="true"></span>
        <span>{{ message() }}</span>
      </div>
    } @else {
      <div class="pf-skel-rows" role="status" [attr.aria-label]="message()">
        @for (item of items(); track item) {
          <div class="pf-skel-row">
            <div class="pf-skel pf-skel-row-main"></div>
            <div class="pf-skel pf-skel-row-meta"></div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .pf-skel-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: 1rem;
      padding: 0.25rem 0;
    }
    .pf-skel-card,
    .pf-skel-row {
      border-radius: var(--radius-md, 10px);
      border: 1px solid var(--border, rgba(203, 213, 225, 0.16));
      background: var(--card, #0e1729);
    }
    .pf-skel-card {
      padding: 1.1rem;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }
    .pf-skel-rows {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      padding: 0.5rem 0;
    }
    .pf-skel-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.85rem 1rem;
    }
    .pf-skel {
      background: linear-gradient(
        90deg,
        var(--glass, rgba(255, 255, 255, 0.045)) 25%,
        var(--glass-strong, rgba(255, 255, 255, 0.08)) 50%,
        var(--glass, rgba(255, 255, 255, 0.045)) 75%
      );
      background-size: 200% 100%;
      border-radius: 6px;
      animation: pfSkelShimmer 1.4s ease-in-out infinite;
    }
    .pf-skel-title { height: 1rem; width: 58%; }
    .pf-skel-line { height: 0.78rem; width: 92%; }
    .pf-skel-line.short { width: 45%; }
    .pf-skel-row-main { height: 0.9rem; width: 62%; }
    .pf-skel-row-meta { height: 0.9rem; width: 18%; }
    .pf-loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.7rem;
      padding: 2rem 1rem;
      color: var(--muted, #93a3ba);
      font-size: 0.9rem;
      font-weight: 500;
    }
    .pf-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid var(--border-strong, rgba(203, 213, 225, 0.3));
      border-top-color: var(--accent, #5eead4);
      border-radius: 50%;
      animation: pfSkelSpin 0.7s linear infinite;
    }
    @keyframes pfSkelShimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @keyframes pfSkelSpin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class LoadingStateComponent {
  readonly variant = input<'cards' | 'rows' | 'spinner'>('rows');
  readonly count = input(4);
  readonly message = input('Loading…');

  readonly items = computed(() => Array.from({ length: Math.max(1, this.count()) }, (_, i) => i));
}
