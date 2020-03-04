import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { startOfDay } from 'date-fns';
import { Observable } from 'rxjs';

import { Logout } from '../auth/store/auth.actions';
import { AuthState } from '../auth/store/auth.state';
import { UserWithToken } from '../core/models/user-with-token.model';
import { WidgetTypes } from '../core/models/wydget-type.enum';
import { LoadDataOfDay } from './widget-period/store/widget-day.actions';
import { LoadDataOfHalf } from './widget-period/store/widget-half.actions';
import { LoadDataOfMonth } from './widget-period/store/widget-month.actions';
import { LoadDataOfWeek } from './widget-period/store/widget-week.actions';

@Component({
  selector: 'rec-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Select(AuthState.getUser) user$: Observable<UserWithToken>;
  widgetTypes = WidgetTypes;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch([
      new LoadDataOfDay(startOfDay(new Date())),
      new LoadDataOfHalf(new Date()),
      new LoadDataOfMonth(new Date()),
      new LoadDataOfWeek(new Date())
    ]);
  }

  logout() {
    this.store.dispatch(new Logout());
  }
}
