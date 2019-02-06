import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.includes('auth')) {
      const token = localStorage['tkn'];
      request = request.clone({
        setHeaders: { 'Auth-Token': token || '' }
      });
    }

    return next.handle(request);
  }
}
