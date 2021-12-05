import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { startOfDay } from 'date-fns';
import { Observable, takeUntil } from 'rxjs';

import { Logout } from '../auth/store/auth.actions';
import { AuthState } from '../auth/store/auth.state';
import { User } from '../core/models/user.model';
import { WidgetTypes } from '../core/models/wydget-type.enum';
import { DestroyService } from '../core/services/destroy.service';
import { LoadDataOfDay } from './widget-period/store/widget-day.actions';
import { LoadDataOfHalf } from './widget-period/store/widget-half.actions';
import { LoadDataOfMonth } from './widget-period/store/widget-month.actions';
import { LoadDataOfWeek } from './widget-period/store/widget-week.actions';

@Component({
  selector: 'rec-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DestroyService],
})
export class DashboardComponent implements OnInit {
  @Select(AuthState.getUser) user$: Observable<User>;
  widgetTypes = WidgetTypes;

  constructor(private store: Store, private router: Router, private destroy$: DestroyService) {}

  ngOnInit(): void {
    this.store.dispatch([
      new LoadDataOfDay(startOfDay(new Date())),
      new LoadDataOfWeek(new Date()),
      new LoadDataOfHalf(new Date()),
      new LoadDataOfMonth(new Date()),
    ]);
  }

  logout() {
    this.store
      .dispatch(new Logout())
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.router.navigate(['/login']));
  }
}
