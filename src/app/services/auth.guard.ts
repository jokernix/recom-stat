import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginRedirect } from '../auth/store/auth.actions';
import { AuthState } from '../auth/store/auth.state';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.selectOnce(AuthState.getUser).pipe(
      map(user => {
        if (user) {
          return true;
        }

        this.store.dispatch(new LoginRedirect());
        return false;
      })
    );
  }
}
