import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
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

  constructor(private store: Store) {}

  // TODO добавить проверку если нет данных
  ngOnInit(): void {
    const today = new Date();
    this.getDay(today);
  }

  getDay(day: Date) {
    this.store.dispatch(new LoadPeriod(TypePeriod.Day, day, day));
  }
}
