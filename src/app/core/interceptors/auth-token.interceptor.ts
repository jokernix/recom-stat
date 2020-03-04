import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from '../../auth/store/auth.state';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  store: Store;

  constructor(inj: Injector) {
    this.store = inj.get(Store);
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.includes('auth')) {
      const token = this.store.selectSnapshot(AuthState.getToken);
      request = request.clone({
        setHeaders: { 'Auth-Token': token || '' }
      });
    }

    return next.handle(request);
  }
}
