import {
  HttpContext,
  HttpContextToken,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/general/loading.service';

export const SILENT_HTTP = new HttpContextToken<boolean>(() => false);

/** Opt a background HTTP request out of the global progress bar / wakeup banner. */
export function silentHttpContext(): HttpContext {
  return new HttpContext().set(SILENT_HTTP, true);
}

const SILENT_URL_RE =
  /\/assets\/|\/analytics\/visit|\/visitor-chat\/poll|\/visitor-chat\/typing|nominatim\.openstreetmap\.org/;

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loading: LoadingService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.context.get(SILENT_HTTP) || SILENT_URL_RE.test(req.url)) {
      return next.handle(req);
    }
    const done = this.loading.beginHttp();
    return next.handle(req).pipe(finalize(done));
  }
}
