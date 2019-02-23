import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material';
import { Select, Store } from '@ngxs/store';
import { startOfDay } from 'date-fns';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadDataOfDay } from './store/widget-day.actions';
import { WidgetDayModel, WidgetDayState } from './store/widget-day.state';

@Component({
  selector: 'rec-widget-day',
  templateUrl: './widget-day.component.html',
  styleUrls: ['./widget-day.component.scss']
})
export class WidgetDayComponent {
  @Select(WidgetDayState.getDay) day$: Observable<WidgetDayModel>;

  today: Date = new Date();

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(private breakpointObserver: BreakpointObserver, private store: Store) {}

  changeDay({ value }: MatDatepickerInputEvent<Date>) {
    this.store.dispatch(new LoadDataOfDay(startOfDay(value)));
  }
}
