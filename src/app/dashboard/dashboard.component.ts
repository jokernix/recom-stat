import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Logout } from '../auth/store/auth.actions';
import { AuthState } from '../auth/store/auth.state';
import { UserWithToken } from '../models/user-with-token.model';

@Component({
  selector: 'rec-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @Select(AuthState.getUser) user$: Observable<UserWithToken>;

  constructor(private store: Store) {}

  logout() {
    this.store.dispatch(new Logout());
  }
}
