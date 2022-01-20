import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, switchMapTo } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { FetchProfile, SaveTokens } from './store/auth.actions';

@Injectable({ providedIn: 'root' })
export class ThirdPartyGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<UrlTree> {
    const { token, refreshToken } = route.queryParams;

    return this.store
      .dispatch(new SaveTokens({ accessToken: token, refreshToken }))
      .pipe(
        switchMapTo(this.store.dispatch(new FetchProfile())),
        mapTo(this.router.createUrlTree(['/dashboard']))
      );
  }
}
