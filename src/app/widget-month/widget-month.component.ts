import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatDatepicker } from '@angular/material';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetCachedDataOfMonth } from './store/widget-month.actions';
import { WidgetMonthModel, WidgetMonthState } from './store/widget-month.state';

@Component({
  selector: 'rec-widget-month',
  templateUrl: './widget-month.component.html',
  styleUrls: ['./widget-month.component.scss']
})
export class WidgetMonthComponent {
  @Select(WidgetMonthState.getMonth) month$: Observable<WidgetMonthModel>;

  today: Date = new Date();

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(private breakpointObserver: BreakpointObserver, private store: Store) {}

  chosenMonthHandler(date: Date, datepicker: MatDatepicker<any>) {
    this.store.dispatch(new GetCachedDataOfMonth(date));
    datepicker.close();
  }
}
