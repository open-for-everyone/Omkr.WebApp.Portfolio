import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInOut } from 'src/app/models/animations/animations';
import { AnalyticService } from 'src/app/services/Analytics/analytic.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactService } from 'src/app/services/message/contact.service';
import { ContactMessage } from 'src/app/models/general/contact-message';
import { HttpClient } from '@angular/common/http';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

interface Place { display_name: string; lat: string; lon: string }

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  animations: [fadeInOut]
})
export class ContactComponent implements OnInit {
  form!: FormGroup;
  submitting = false;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  // search state
  searchControl = new FormControl<string | Place>('');
  options$: Observable<Place[]> = of([]);
  selectedDisplay?: string;
  isPinned = false;
  selectionSource: 'search' | 'gps' | 'auto' | undefined;
  pulse = false;

  @ViewChild(MatAutocompleteTrigger) autoTrigger?: MatAutocompleteTrigger;
  @ViewChild('searchEl') searchEl?: ElementRef<HTMLInputElement>;

  // type for Nominatim place
  displayFn = (p?: Place | string) => typeof p === 'string' ? p : (p?.display_name ?? '');

  constructor(
    public analyticsService: AnalyticService,
    private fb: FormBuilder,
    private contactService: ContactService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });

    // reactive search options via Nominatim
    this.options$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => {
        const query = typeof q === 'string' ? q : q?.display_name;
        if (!query || query.trim().length < 3) {
          return of([]);
        }
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
        return this.http.get<Place[]>(url).pipe(catchError(() => of([])));
      })
    );

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.latitude = pos.coords.latitude;
          this.longitude = pos.coords.longitude;
          this.accuracy = pos.coords.accuracy;
          if (!this.selectedDisplay) {
            this.selectedDisplay = 'Current location';
          }
          this.selectionSource = 'auto';
          this.triggerPulse();
        },
        () => {
          // Ignore errors silently; user can still submit without location
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
      );
    }
  }

  get mapUrl(): string | null {
    if (this.latitude != null && this.longitude != null) {
      const lat = this.latitude.toFixed(6);
      const lng = this.longitude.toFixed(6);
      return `https://www.openstreetmap.org/export/embed.html?bbox=${(+lng - 0.01).toFixed(6)}%2C${(+lat - 0.01).toFixed(6)}%2C${(+lng + 0.01).toFixed(6)}%2C${(+lat + 0.01).toFixed(6)}&layer=mapnik&marker=${lat}%2C${lng}`;
    }
    return null;
  }

  pickPlace(opt: Place) {
    if (this.isPinned) {
      this.snackBar.open('Location is pinned. Unpin to change.', 'Close', { duration: 3000 });
      // keep control value for visual, but don't move marker
      this.searchControl.setValue(opt);
      return;
    }
    this.selectedDisplay = opt.display_name;
    this.latitude = parseFloat(opt.lat);
    this.longitude = parseFloat(opt.lon);
    this.searchControl.setValue(opt);
    this.selectionSource = 'search';
    this.triggerPulse();
    this.autoTrigger?.closePanel();
    this.searchEl?.nativeElement.blur();
  }

  togglePin() {
    this.isPinned = !this.isPinned;
    this.snackBar.open(this.isPinned ? 'Location pinned' : 'Location unpinned', 'Close', { duration: 2000 });
  }

  useMyLocation() {
    if (!navigator.geolocation) {
      this.snackBar.open('Geolocation not available on this device.', 'Close', { duration: 3000 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (this.isPinned) {
          this.snackBar.open('Location is pinned. Unpin to change.', 'Close', { duration: 3000 });
          return;
        }
        this.latitude = pos.coords.latitude;
        this.longitude = pos.coords.longitude;
        this.accuracy = pos.coords.accuracy;
        this.selectedDisplay = 'Current location';
        this.selectionSource = 'gps';
        this.triggerPulse();
      },
      () => this.snackBar.open('Unable to fetch current location.', 'Close', { duration: 3000 }),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
    );
  }

  get selectionLabel(): string {
    if (this.selectedDisplay && this.selectedDisplay.trim().length > 0) {
      return this.selectedDisplay;
    }
    if (this.latitude != null && this.longitude != null) {
      return `${this.latitude.toFixed(5)}, ${this.longitude.toFixed(5)}`;
    }
    return '—';
  }

  clearSelection() {
    this.isPinned = false;
    this.selectedDisplay = undefined;
    this.selectionSource = undefined;
    this.latitude = undefined;
    this.longitude = undefined;
    this.accuracy = undefined;
    this.searchControl.setValue('');
    this.triggerPulse();
    // close panel and blur input to avoid overlay overlapping footer
    this.autoTrigger?.closePanel();
    this.searchEl?.nativeElement.blur();
  }

  private triggerPulse() {
    this.pulse = false;
    requestAnimationFrame(() => {
      this.pulse = true;
      setTimeout(() => (this.pulse = false), 700);
    });
  }

  submit(): void {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: ContactMessage = {
      name: this.form.value.name,
      email: this.form.value.email,
      message: this.form.value.message,
      location: {
        latitude: this.latitude,
        longitude: this.longitude,
        accuracy: this.accuracy
      },
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      createdAt: new Date().toISOString()
    };

    this.submitting = true;
    this.contactService.submit(payload).subscribe({
      next: () => {
        this.snackBar.open('Thanks! I will get back to you soon.', 'Close', { duration: 4000 });
        this.form.reset();
      },
      error: () => {
        this.snackBar.open('Failed to send message. Try again later.', 'Close', { duration: 5000 });
      }
    }).add(() => {
      this.submitting = false;
    });
  }
}
