import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import {
  addDays,
  eachDay,
  endOfDay,
  endOfMonth,
  isBefore,
  isSameDay,
  isWeekend,
  startOfDay,
  startOfMonth,
  startOfToday
} from 'date-fns';
import { Observable } from 'rxjs';
import { LoadPeriod, TypePeriod } from '../dates.actions';
import { DatesState, DatesStateItemModel } from '../dates.state';

// @Component({
//   selector: 'rec-stat-half',
//   templateUrl: './stat-half.component.html',
//   styleUrls: ['./stat-half.component.scss']
// })
export class StatHalfComponent implements OnInit {
  @Select(DatesState.getHalf) half$: Observable<DatesStateItemModel>;

  startDate: Date;
  endDate: Date;
  normalTime: number;
  normalTimeToCurrentTime: number;

  constructor(private store: Store) {}

  ngOnInit(): void {
    const today = startOfToday();
    const midMonth = startOfToday().setDate(15);

    if (isBefore(today, midMonth) || isSameDay(today, midMonth)) {
      this.startDate = startOfMonth(today);
      this.endDate = endOfDay(midMonth);
    } else {
      this.startDate = startOfDay(addDays(midMonth, 1));
      this.endDate = endOfMonth(today);
    }

    this.getHalf(this.startDate, this.endDate);

    this.normalTime = eachDay(this.startDate, this.endDate).reduce(this.calculateSeconds, 0);
    this.normalTimeToCurrentTime = eachDay(this.startDate, today).reduce(this.calculateSeconds, 0);
  }

  getHalf(start: Date, end: Date) {
    this.store.dispatch(new LoadPeriod(TypePeriod.Half, start, end));
  }

  private calculateSeconds(prev: number, day: Date): number {
    const secondsInDay = 8 * 60 * 60;
    return isWeekend(day) ? prev : prev + secondsInDay;
  }
}
