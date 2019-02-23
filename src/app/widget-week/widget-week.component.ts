import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetCachedDataOfWeek } from './store/widget-week.actions';
import { WidgetWeekModel, WidgetWeekState } from './store/widget-week.state';

@Component({
  selector: 'rec-widget-week',
  templateUrl: './widget-week.component.html',
  styleUrls: ['./widget-week.component.scss']
})
export class WidgetWeekComponent {
  @Select(WidgetWeekState.getWeek) week$: Observable<WidgetWeekModel>;

  today: Date = new Date();

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(private breakpointObserver: BreakpointObserver, private store: Store) {}

  changeDay({ value }: MatDatepickerInputEvent<Date>) {
    this.store.dispatch(new GetCachedDataOfWeek(value));
  }
}
