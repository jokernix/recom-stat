import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { eachDay, endOfMonth, isWeekend, startOfMonth } from 'date-fns';
import { Observable } from 'rxjs';
import { LoadPeriod, TypePeriod } from '../dates.actions';
import { DatesState, DatesStateItemModel } from '../dates.state';

@Component({
  selector: 'rec-stat-month',
  templateUrl: './stat-month.component.html',
  styleUrls: ['./stat-month.component.scss']
})
export class StatMonthComponent implements OnInit {
  @Select(DatesState.getMonth) month$: Observable<DatesStateItemModel>;

  today = new Date();
  normalTime: number;

  constructor(private store: Store) {}

  ngOnInit(): void {
    const startDate = startOfMonth(this.today);
    const endDate = endOfMonth(this.today);

    const days = eachDay(startDate, endDate);
    const secondsInDay = 8 * 60 * 60;
    this.normalTime = days.reduce((prev: number, day: Date) => {
      if (isWeekend(day)) {
        return prev;
      }
      return prev + secondsInDay;
    }, 0);

    this.getMonth(startDate, endDate);
  }

  getMonth(start: Date, end: Date) {
    this.store.dispatch(new LoadPeriod(TypePeriod.Month, start, end));
  }
}
