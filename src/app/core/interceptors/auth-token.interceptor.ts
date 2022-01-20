import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Store } from '@ngxs/store';
import jwtDecode from 'jwt-decode';
import { Observable, switchMap, switchMapTo } from 'rxjs';
import { SaveTokens } from '../../auth/store/auth.actions';
import { AuthState } from '../../auth/store/auth.state';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  private authService: AuthService;
  private store: Store;

  constructor(inj: Injector) {
    this.store = inj.get(Store);
    this.authService = inj.get(AuthService);
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.store.selectSnapshot(AuthState.getToken);

    if (!request.url.includes('access_tokens') && !request.url.includes('login')) {
      const refreshToken = this.store.selectSnapshot(AuthState.getRefreshToken);

      const decodedToken =
        jwtDecode<{ jti: string; iss: string; exp: number; iat: number; scope: string }>(
          accessToken
        );

      if (decodedToken.exp < Date.now() / 1000) {
        return this.authService.getAccessToken(refreshToken).pipe(
          switchMap((tokens) => this.store.dispatch(new SaveTokens(tokens))),
          switchMapTo(next.handle(this.addAuthenticationToken(request, accessToken)))
        );
      }
    }

    return next.handle(this.addAuthenticationToken(request, accessToken));
  }

  private addAuthenticationToken(request: HttpRequest<any>, accessToken: string) {
    return !accessToken
      ? request
      : request.clone({
          setHeaders: { Authorization: `Bearer ${accessToken}` },
        });
  }
}
