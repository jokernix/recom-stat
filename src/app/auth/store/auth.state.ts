import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { UserWithToken } from '../../core/models/user-with-token.model';
import { AuthService } from '../../core/services/auth.service';
import {
  Login,
  LoginFailed,
  LoginRedirect,
  LoginSuccess,
  Logout,
  LogoutSuccess
} from './auth.actions';

export interface AuthStateModel {
  user: UserWithToken;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null
  }
})
@Injectable()
export class AuthState {
  @Selector()
  static getToken(state: AuthStateModel): string {
    return state.user.auth_token;
  }

  @Selector()
  static getUser(state: AuthStateModel): UserWithToken {
    return state.user;
  }

  constructor(private store: Store, private authService: AuthService, private router: Router) {}

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, { email, password }: Login) {
    return this.authService.login(email, password).pipe(
      switchMap(user => ctx.dispatch(new LoginSuccess(user))),
      catchError(error => {
        ctx.dispatch(new LoginFailed(error));
        return of(null);
      })
    );
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.dispatch(new LogoutSuccess());
  }

  @Action(LoginSuccess)
  onLoginSuccess() {
    this.router.navigate(['/dashboard']);
  }

  @Action(LoginSuccess)
  setUserStateOnSuccess(ctx: StateContext<AuthStateModel>, event: LoginSuccess) {
    ctx.patchState({ user: event.user });
  }

  @Action([LoginFailed, LogoutSuccess])
  setUserStateOnFailure(ctx: StateContext<AuthStateModel>) {
    ctx.setState({ user: null });
    ctx.dispatch(new LoginRedirect());
  }

  @Action(LoginRedirect)
  onLoginRedirect() {
    this.router.navigate(['/login']);
  }
}
