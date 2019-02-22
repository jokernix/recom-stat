import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { endOfWeek, isWeekend, startOfWeek } from 'date-fns';
import { Observable } from 'rxjs';
import { LoadPeriod, TypePeriod } from '../dates.actions';
import { DatesState, DatesStateItemModel } from '../dates.state';

@Component({
  selector: 'rec-stat-week',
  templateUrl: './stat-week.component.html',
  styleUrls: ['./stat-week.component.scss']
})
export class StatWeekComponent implements OnInit {
  @Select(DatesState.getWeek) week$: Observable<DatesStateItemModel>;

  startDate: Date;
  endDate: Date;
  normOfWorkingTime: number;
  dynamicNormOfWorkingTime: number;

  constructor(private store: Store) {}

  // TODO add startDate and endDate to Store
  // TODO add holidays and working days
  // TODO add prev and next button
  // TODO add avg. hours per day
  ngOnInit(): void {
    const secondsInDay = 8 * 60 * 60;

    // TODO add calculate norm of working time
    this.normOfWorkingTime = 5 * secondsInDay;

    // TODO add calculate dynamic norm of working time
    this.dynamicNormOfWorkingTime = 5 * secondsInDay;

    this.startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    this.endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
    this.getWeek(this.startDate, this.endDate);
  }

  getWeek(start: Date, end: Date) {
    this.store.dispatch(new LoadPeriod(TypePeriod.Week, start, end));
  }

  private calculateSeconds(prev: number, day: Date): number {
    const secondsInDay = 8 * 60 * 60;
    return isWeekend(day) ? prev : prev + secondsInDay;
  }
}
