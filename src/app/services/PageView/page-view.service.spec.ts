import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { PageViewService } from './page-view.service';

const TRACK_URL = `${environment.contactApiBaseUrl}/api/analytics/visit`;

/**
 * The counter reports to the admin API's central analytics. These cover the two properties that
 * matter: it posts what the admin expects, and it never lets a reporting failure surface to the
 * visitor.
 *
 * The spec used to configure an empty TestBed for a service that injects `HttpClient`, so it failed
 * with `NullInjectorError` before asserting anything.
 */
describe('PageViewService', () => {
  let service: PageViewService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PageViewService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('is created', () => {
    expect(service).toBeTruthy();
  });

  it('posts the visit with the site key and path', () => {
    service.incrementPageView('/resume').subscribe();

    const request = http.expectOne(TRACK_URL);
    expect(request.request.method).toBe('POST');
    expect(request.request.body.websiteKey).toBe('portfolio');
    expect(request.request.body.path).toBe('/resume');
    request.flush({});
  });

  it('substitutes the site root for an empty path', () => {
    service.incrementPageView('').subscribe();

    const request = http.expectOne(TRACK_URL);
    expect(request.request.body.path).toBe('/');
    request.flush({});
  });

  it('completes quietly when reporting fails', (done) => {
    let errored = false;

    service.incrementPageView('/').subscribe({
      error: () => (errored = true),
      complete: () => {
        // A visitor must never notice that analytics is down.
        expect(errored).toBe(false);
        done();
      },
    });

    http.expectOne(TRACK_URL).flush({}, { status: 500, statusText: 'Server Error' });
  });
});
