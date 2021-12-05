import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { isSameWeek, isWithinInterval } from 'date-fns';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { WidgetPeriod } from '../../core/models/widget.model';
import { WidgetTypes } from '../../core/models/wydget-type.enum';
import { copyText } from '../../core/utils/copy-text';
import { GetCachedDataOfDay } from './store/widget-day.actions';
import { WidgetDayState } from './store/widget-day.state';
import { GetNextHalf, GetPrevHalf } from './store/widget-half.actions';
import { WidgetHalfState } from './store/widget-half.state';
import { GetCachedDataOfMonth } from './store/widget-month.actions';
import { WidgetMonthState } from './store/widget-month.state';
import { GetCachedDataOfWeek } from './store/widget-week.actions';
import { WidgetWeekState } from './store/widget-week.state';

@Component({
  selector: 'rec-widget-period',
  templateUrl: './widget-period.component.html',
  styleUrls: ['./widget-period.component.scss'],
})
export class WidgetPeriodComponent implements OnInit {
  @Input() type: WidgetTypes = WidgetTypes.Day;

  types = WidgetTypes;

  period$: Observable<WidgetPeriod>;
  today: Date = new Date();

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  isLastHalf: boolean;
  startDateOfWeek: Date;

  filter: (d: Date) => boolean;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store,
    private snackBar: MatSnackBar
  ) {
    this.filter = this.filterCurrentWeek.bind(this);
  }

  ngOnInit() {
    this.period$ = this.store.select(this.getSelector()).pipe(
      tap((data) => {
        if (this.type === WidgetTypes.Half) {
          this.isLastHalf = isWithinInterval(new Date(), { start: data.start, end: data.end });
        }

        if (this.type === WidgetTypes.Week) this.startDateOfWeek = data.start;
      })
    );
  }

  filterCurrentWeek(d: Date): boolean {
    const currentWeek =
      this.type === 'week' && isSameWeek(this.startDateOfWeek, d, { weekStartsOn: 1 });
    return !currentWeek;
  }

  changeDay({ value }: MatDatepickerInputEvent<Date>) {
    switch (this.type) {
      case 'day':
        this.store.dispatch(new GetCachedDataOfDay(value));
        break;
      case 'week':
        this.store.dispatch(new GetCachedDataOfWeek(value));
        break;
      default:
        break;
    }
  }

  chosenMonthHandler(date: Date, datepicker: MatDatepicker<any>) {
    if (this.type === WidgetTypes.Month) {
      this.store.dispatch(new GetCachedDataOfMonth(date));
      datepicker.close();
    }
  }

  prevHalf() {
    this.store.dispatch(new GetPrevHalf());
  }

  nextHalf() {
    this.store.dispatch(new GetNextHalf());
  }

  copyText(duration: number) {
    const hours = (duration / (60 * 60)).toFixed(2);
    copyText(hours)
      .then(() => {
        this.snackBar.open(`Скопировано ${hours}`, 'Close', { duration: 5000 });
      })
      .catch(() => {
        this.snackBar.open('Нечего копировать', 'Close', { duration: 5000 });
      });
  }

  private getSelector() {
    switch (this.type) {
      case WidgetTypes.Month:
        return WidgetMonthState.getMonth;

      case WidgetTypes.Half:
        return WidgetHalfState.getHalf;

      case WidgetTypes.Week:
        return WidgetWeekState.getWeek;

      case WidgetTypes.Day:
      default:
        return WidgetDayState.getDay;
    }
  }
}
