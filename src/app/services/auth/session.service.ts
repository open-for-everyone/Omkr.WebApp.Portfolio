/*
  SessionService
  ----------------
  Responsibilities:
  - Expose reactive login state (isLoggedIn$) based on MSAL account presence & events.
  - Start a client-side session window of 30 minutes (absolute). After this period, user is force logged out.
  - Track user activity (click, key, mouse, scroll, touch). If no activity for 2 minutes, show a blocking dialog warning.
  - Provide a 30 second countdown in the dialog; user can Continue Session (resets inactivity timer) or Logout.
  - Display snack notifications on login and absolute expiry.

  Notes / Limitations:
  - Azure AD B2C tokens have their own lifetimes (ID/access/refresh). This service enforces a *client-side* absolute cap.
  - Refresh events (ACQUIRE_TOKEN_SUCCESS) simply keep the user authenticated but do NOT extend the 30m absolute cap.
  - For production you may wish to:
      * Persist the absoluteExpiry in localStorage to survive tab reloads.
      * Synchronize logout across tabs via BroadcastChannel or storage events.
      * Replace forceLogout() with an API call to revoke refresh tokens (if using confidential flows via a backend).
*/
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, fromEvent, Subscription, timer } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface SessionState {
  loggedIn: boolean;
  // ms timestamp when session will hard-expire (30 min after login)
  absoluteExpiry?: number;
  // ms timestamp when inactivity warning dialog is scheduled (after 2m inactivity)
  inactivityDeadline?: number;
  // true when inactivity dialog currently visible
  inactivityWarningVisible: boolean;
  // seconds remaining in inactivity countdown (30 -> 0)
  inactivityCountdown?: number;
}

const ABSOLUTE_SESSION_MINUTES = environment.sessionConfig.absoluteSessionMinutes;
const INACTIVITY_MINUTES = environment.sessionConfig.inactivityMinutes;
const WARNING_COUNTDOWN_SECONDS = environment.sessionConfig.warningCountdownSeconds;
const SESSION_EXPIRY_KEY = 'sessionAbsoluteExpiry';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private state$ = new BehaviorSubject<SessionState>({ loggedIn: false, inactivityWarningVisible: false });
  readonly sessionState$ = this.state$.asObservable();
  readonly isLoggedIn$ = this.sessionState$.pipe(map(s => s.loggedIn));

  private activityEvents = ['click','mousemove','keydown','scroll','touchstart'];
  private activitySub?: Subscription;
  private inactivityTimerSub?: Subscription; // fires after 2 minutes of inactivity
  private warningCountdownSub?: Subscription; // ticks every second during 30s warning
  private absoluteExpirySub?: Subscription; // fires after 30 minutes from login

  constructor(
    private msal: MsalService,
    private msalBroadcast: MsalBroadcastService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private zone: NgZone,
  ){
    this.initMsalEvents();
    this.bootstrapExistingAccount();
  }

  private initMsalEvents(){
    this.msalBroadcast.msalSubject$
      .pipe(filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS || msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS))
      .subscribe(()=>{
        // user logged in (or token refreshed) ensure session started
        this.startSession();
      });

    this.msalBroadcast.inProgress$
      .pipe(filter(status => status === InteractionStatus.None))
      .subscribe(()=>{
        // after interaction finishes, update login state (covers redirect return)
        const hasAccount = this.msal.instance.getAllAccounts().length > 0;
        if(hasAccount){
          // if not already started
          if(!this.state$.value.loggedIn){
            this.startSession();
          }
        } else {
          this.endSession(false);
        }
      });

    this.msalBroadcast.msalSubject$
      .pipe(filter((msg: EventMessage) => msg.eventType === EventType.LOGOUT_SUCCESS))
      .subscribe(()=> this.endSession(true));
  }

  private bootstrapExistingAccount(){
    if(this.msal.instance.getAllAccounts().length > 0){
      // Try to restore expiry from localStorage
      const expiryStr = localStorage.getItem(SESSION_EXPIRY_KEY);
      let expiry: number | undefined = undefined;
      if (expiryStr) {
        const parsed = parseInt(expiryStr, 10);
        if (!isNaN(parsed) && parsed > Date.now()) {
          expiry = parsed;
        }
      }
      this.startSession(expiry);
    } else {
      localStorage.removeItem(SESSION_EXPIRY_KEY);
    }
  }

  private startSession(restoredExpiry?: number){
    let absoluteExpiry = restoredExpiry ?? (Date.now() + ABSOLUTE_SESSION_MINUTES * 60 * 1000);
    localStorage.setItem(SESSION_EXPIRY_KEY, absoluteExpiry.toString());
    this.clearTimers();
    this.state$.next({
      ...this.state$.value,
      loggedIn: true,
      absoluteExpiry,
      inactivityWarningVisible: false,
      inactivityCountdown: undefined,
      inactivityDeadline: Date.now() + INACTIVITY_MINUTES * 60 * 1000,
    });
    this.attachActivityListeners();
    this.scheduleInactivityTimer();
    this.scheduleAbsoluteExpiry(absoluteExpiry);
    this.snack.open(`Logged in. Session valid for ${ABSOLUTE_SESSION_MINUTES} minutes.`, 'OK', { duration: 5000 });
  }

  private endSession(triggerMsalLogout: boolean){
    this.clearTimers();
    this.detachActivityListeners();
    localStorage.removeItem(SESSION_EXPIRY_KEY);
    this.state$.next({ loggedIn: false, inactivityWarningVisible: false });
    if(triggerMsalLogout){
      // already handled by header calling logoutRedirect
    }
  }

  private attachActivityListeners(){
    this.detachActivityListeners();
    const group = new Subscription();
    this.activityEvents.forEach(evt => {
      group.add(fromEvent(document, evt).subscribe(()=> this.onUserActivity()));
    });
    this.activitySub = group;
  }

  private detachActivityListeners(){
    if(this.activitySub){
      this.activitySub.unsubscribe();
      this.activitySub = undefined;
    }
  }

  private onUserActivity(){
    const st = this.state$.value;
    if(!st.loggedIn) return;
    // If warning visible, treat activity as continue session
    if(st.inactivityWarningVisible){
      this.continueSession();
      return;
    }
    // Reset inactivity deadline
    this.state$.next({ ...st, inactivityDeadline: Date.now() + INACTIVITY_MINUTES * 60 * 1000 });
    this.scheduleInactivityTimer();
  }

  private scheduleInactivityTimer(){
    if(this.inactivityTimerSub){
      this.inactivityTimerSub.unsubscribe();
    }
    const st = this.state$.value;
    if(!st.loggedIn || !st.inactivityDeadline) return;
    const due = Math.max(0, st.inactivityDeadline - Date.now());
    this.inactivityTimerSub = timer(due).subscribe(()=> this.showInactivityWarning());
  }

  private showInactivityWarning(){
    const st = this.state$.value;
    if(!st.loggedIn) return;
    // Set state to show dialog
    this.state$.next({ ...st, inactivityWarningVisible: true, inactivityCountdown: WARNING_COUNTDOWN_SECONDS });
    this.startWarningCountdown();
    // Open dialog lazily (dynamic import to avoid circular)
    import('../../components/general/session-timeout-dialog/session-timeout-dialog.component').then(m => {
      const ref = this.dialog.open(m.SessionTimeoutDialogComponent, {
        disableClose: true,
        data: { seconds: WARNING_COUNTDOWN_SECONDS }
      });
      ref.afterClosed().pipe(take(1)).subscribe(result => {
        if(result === 'continue'){
          this.continueSession();
        } else {
          this.forceLogout();
        }
      });
    });
  }

  private startWarningCountdown(){
    this.warningCountdownSub?.unsubscribe();
    this.warningCountdownSub = timer(0, 1000).pipe(map(i => WARNING_COUNTDOWN_SECONDS - i), filter(v => v >= 0))
      .subscribe(sec => {
        const st = this.state$.value;
        if(!st.inactivityWarningVisible) return;
        if(sec === 0){
          this.forceLogout();
          return;
        }
        this.state$.next({ ...st, inactivityCountdown: sec });
      });
  }

  continueSession(){
    const st = this.state$.value;
    if(!st.loggedIn) return;
    this.warningCountdownSub?.unsubscribe();
    this.state$.next({
      ...st,
      inactivityWarningVisible: false,
      inactivityCountdown: undefined,
      inactivityDeadline: Date.now() + INACTIVITY_MINUTES * 60 * 1000,
    });
    this.scheduleInactivityTimer();
  }

  private scheduleAbsoluteExpiry(expiry: number){
    this.absoluteExpirySub?.unsubscribe();
    const due = Math.max(0, expiry - Date.now());
    this.absoluteExpirySub = timer(due).subscribe(()=> {
      this.snack.open('Session expired. You have been logged out.', 'Dismiss', { duration: 6000 });
      this.forceLogout();
    });
  }

  private forceLogout(){
    this.clearTimers();
    this.state$.next({ loggedIn: false, inactivityWarningVisible: false });
    this.msal.logoutRedirect();
  }

  private clearTimers(){
    this.inactivityTimerSub?.unsubscribe();
    this.warningCountdownSub?.unsubscribe();
    this.absoluteExpirySub?.unsubscribe();
    this.inactivityTimerSub = this.warningCountdownSub = this.absoluteExpirySub = undefined;
  }
}
