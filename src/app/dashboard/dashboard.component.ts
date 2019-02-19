import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Logout } from '../auth/auth.actions';
import { AuthState } from '../auth/auth.state';
import { User } from '../models/user.model';

@Component({
  selector: 'rec-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @Select(AuthState.getUser) user$: Observable<User>;

  constructor(private store: Store) {}

  logout() {
    this.store.dispatch(new Logout());
  }
}
