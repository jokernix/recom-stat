import { Navigate } from '@ngxs/router-plugin';
import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { catchError, finalize, take, tap } from 'rxjs/operators';
import { UserWithToken } from '../models/user-with-token.model';

import { AuthService } from '../services/auth.service';
import {
  CheckSession,
  Login,
  LoginFailed,
  LoginRedirect,
  LoginSuccess,
  Logout,
  LogoutSuccess
} from './auth.actions';

export interface AuthStateModel {
  initialized: boolean;
  user: UserWithToken;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    initialized: false,
    user: null
  }
})
export class AuthState implements NgxsOnInit {
  /**
   * Selectors
   */
  @Selector()
  static getInitialized(state: AuthStateModel): boolean {
    return state.initialized;
  }

  @Selector()
  static getUser(state: AuthStateModel): UserWithToken {
    return state.user;
  }

  constructor(private store: Store, private authService: AuthService) {}

  /**
   * Dispatch CheckSession on start
   */
  ngxsOnInit(ctx: StateContext<AuthStateModel>) {
    ctx.dispatch(new CheckSession());
  }

  /**
   * Commands
   */
  @Action(CheckSession)
  checkSession(ctx: StateContext<AuthStateModel>) {
    return this.authService.authState().pipe(
      take(1),
      finalize(() => ctx.patchState({ initialized: true })),
      tap(user => {
        if (user) {
          return ctx.dispatch(new LoginSuccess(user));
        }
      }),
      catchError(error => ctx.dispatch(new LoginFailed(error)))
    );
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, { email, password }: Login) {
    return this.authService.login(email, password).pipe(
      tap(user => ctx.dispatch(new LoginSuccess(user))),
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

  /**
   * Events
   */
  @Action(LoginSuccess)
  onLoginSuccess(ctx: StateContext<AuthStateModel>) {
    console.log('onLoginSuccess, navigating to /');
    ctx.dispatch(new Navigate(['/']));
  }

  @Action(LoginSuccess)
  setUserStateOnSuccess(ctx: StateContext<AuthStateModel>, event: LoginSuccess) {
    localStorage['tkn'] = event.user.auth_token;
    ctx.patchState({
      user: event.user
    });
  }

  @Action([LoginFailed, LogoutSuccess])
  setUserStateOnFailure(ctx: StateContext<AuthStateModel>) {
    localStorage.removeItem('tkn');
    ctx.patchState({
      user: undefined
    });
    ctx.dispatch(new LoginRedirect());
  }

  @Action(LoginRedirect)
  onLoginRedirect(ctx: StateContext<AuthStateModel>) {
    console.log('onLoginRedirect, navigating to /login');
    ctx.dispatch(new Navigate(['/login']));
  }
}
