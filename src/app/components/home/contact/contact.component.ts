import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fadeInOut } from 'src/app/models/animations/animations';
import { AnalyticService } from 'src/app/services/Analytics/analytic.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactService } from 'src/app/services/message/contact.service';
import { ContactMessage } from 'src/app/models/general/contact-message';

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

  constructor(
    public analyticsService: AnalyticService,
    private fb: FormBuilder,
    private contactService: ContactService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.latitude = pos.coords.latitude;
          this.longitude = pos.coords.longitude;
          this.accuracy = pos.coords.accuracy;
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
