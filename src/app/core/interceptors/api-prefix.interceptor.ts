import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.startsWith('/') || /.(svg|json)$/.test(req.url)) {
      return next.handle(req);
    }

    const apiReq = req.clone({ url: `${environment.apiUrl}${req.url}` });
    return next.handle(apiReq);
  }
}
