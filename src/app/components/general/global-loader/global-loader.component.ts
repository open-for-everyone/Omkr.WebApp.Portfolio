import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoadingService } from 'src/app/services/general/loading.service';

@Component({
  selector: 'app-global-loader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading.active()) {
      <div class="pf-top-progress" role="progressbar" aria-label="Loading">
        <div class="pf-top-progress-bar"></div>
      </div>
    }
    @if (loading.slow()) {
      <div class="pf-slow-banner" role="status" aria-live="polite">
        <span class="pf-slow-dot" aria-hidden="true"></span>
        <span>Waking up Portfolio…</span>
      </div>
    }
  `,
  styles: [`
    .pf-top-progress {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      z-index: 2100;
      pointer-events: none;
      overflow: hidden;
      background: rgba(77, 139, 240, 0.16);
    }
    .pf-top-progress-bar {
      position: absolute;
      inset: 0 auto 0 0;
      width: 42%;
      background: linear-gradient(90deg, var(--primary, #4d8bf0), var(--accent, #5eead4));
      border-radius: 999px;
      animation: pfIndeterminate 1.25s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    .pf-slow-banner {
      position: fixed;
      top: 76px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2099;
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.45rem 0.95rem;
      border-radius: 999px;
      border: 1px solid var(--border-strong, rgba(203, 213, 225, 0.3));
      background: var(--bg-elevated, #111a2e);
      color: var(--text-strong, #e8eefc);
      box-shadow: var(--shadow-md, 0 6px 18px rgba(2, 6, 23, 0.45));
      font-size: 0.82rem;
      font-weight: 600;
      pointer-events: none;
      animation: pfBannerIn 180ms ease-out;
    }
    .pf-slow-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent, #5eead4);
      animation: pfPulse 1.1s ease-in-out infinite;
    }
    @keyframes pfIndeterminate {
      0% { transform: translateX(-110%); }
      55% { transform: translateX(135%); }
      100% { transform: translateX(260%); }
    }
    @keyframes pfBannerIn {
      from { opacity: 0; transform: translate(-50%, -6px); }
      to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes pfPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.75); }
    }
  `],
})
export class GlobalLoaderComponent {
  readonly loading = inject(LoadingService);
}
