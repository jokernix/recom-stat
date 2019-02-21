import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { differenceInSeconds, isBefore } from 'date-fns';
import { Observable } from 'rxjs';
import { LoadPeriod, TypePeriod } from '../dates.actions';
import { DatesState, DatesStateItemModel } from '../dates.state';

@Component({
  selector: 'rec-stat-day',
  templateUrl: './stat-day.component.html',
  styleUrls: ['./stat-day.component.scss']
})
export class StatDayComponent implements OnInit {
  @Select(DatesState.getDay) day$: Observable<DatesStateItemModel>;

  today = new Date();

  dynamicNormOfWorkingTime;
  normOfWorkingTime;

  constructor(private store: Store) {}

  // TODO добавить проверку если нет данных
  ngOnInit(): void {
    const secondsInDay = 8 * 60 * 60;
    this.normOfWorkingTime = secondsInDay;

    const startOfWorkingDay = this.setHour(this.today, 9);
    const endOfWorkingDay = this.setHour(this.today, 18);

    this.dynamicNormOfWorkingTime = isBefore(this.today, endOfWorkingDay)
      ? differenceInSeconds(new Date(), startOfWorkingDay)
      : secondsInDay;

    this.getDay(this.today);
  }

  getDay(day: Date) {
    this.store.dispatch(new LoadPeriod(TypePeriod.Day, day, day));
  }

  setHour(day: Date, hour: number): Date {
    return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, 0, 0);
  }
}
