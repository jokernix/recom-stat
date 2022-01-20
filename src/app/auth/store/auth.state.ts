import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { forkJoin, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Organization } from '../../core/models/organization.model';
import { Tokens } from '../../core/models/tokens.model';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { FetchProfile, LoginFailed, Logout, LogoutSuccess, SaveTokens } from './auth.actions';

export interface AuthStateModel extends Tokens {
  user: User;
  organization?: Organization;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
    accessToken: null,
    refreshToken: null,
  },
})
@Injectable()
export class AuthState {
  @Selector()
  static getToken(state: AuthStateModel): string {
    return state.accessToken;
  }

  @Selector()
  static getRefreshToken(state: AuthStateModel): string {
    return state.refreshToken;
  }

  @Selector()
  static getUser(state: AuthStateModel): User {
    return state.user;
  }

  @Selector()
  static getOrganization(state: AuthStateModel): Organization {
    return state.organization;
  }

  constructor(private store: Store, private authService: AuthService) {}

  @Action(FetchProfile)
  fetchProfile(ctx: StateContext<AuthStateModel>) {
    return forkJoin([this.authService.getCurrentUser(), this.authService.getOrganization()]).pipe(
      tap(([user, organization]) => ctx.patchState({ user, organization })),
      catchError((error) => {
        ctx.dispatch(new LoginFailed(error));
        return of(null);
      })
    );
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.dispatch(new LogoutSuccess());
  }

  @Action(SaveTokens)
  setTokensStateOnSuccess(ctx: StateContext<AuthStateModel>, event: SaveTokens) {
    ctx.patchState({
      accessToken: event.tokens.accessToken,
      refreshToken: event.tokens.refreshToken,
    });
  }

  @Action([LoginFailed, LogoutSuccess])
  setUserStateOnFailure(ctx: StateContext<AuthStateModel>) {
    ctx.setState({ user: null, refreshToken: null, accessToken: null });
  }
}
