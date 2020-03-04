import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { endOfMonth, isWithinInterval, startOfMonth } from 'date-fns';
import { concatMap, switchMap } from 'rxjs/operators';

import { WidgetPeriod } from '../../../core/models/widget.model';
import { DatesService } from '../../../core/services/dates.service';
import { isNotEmpty } from '../../../core/utils/is-not-empty';
import {
  GetCachedDataOfMonth,
  LoadDataOfMonth,
  SaveDataOfMonthToStore
} from './widget-month.actions';

export interface WidgetMonthStateModel {
  months: { [key: string /* [YEAR.MONTH] */]: WidgetPeriod };
  selectedMonth: string;
}

@State<WidgetMonthStateModel>({
  name: 'month',
  defaults: { months: {}, selectedMonth: null }
})
@Injectable()
export class WidgetMonthState implements NgxsOnInit {
  @Selector()
  static getMonth({ months, selectedMonth }: WidgetMonthStateModel): WidgetPeriod {
    return months[selectedMonth];
  }

  static generateKey(date: Date): string {
    return `[${date.getFullYear()}.${date.getMonth()}]`;
  }

  constructor(private datesService: DatesService) {}

  ngxsOnInit(ctx: StateContext<WidgetMonthStateModel>) {
    // ctx.dispatch(new LoadDataOfMonth(new Date()));
  }

  @Action(GetCachedDataOfMonth)
  getCachedDataOfMonth(ctx: StateContext<WidgetMonthStateModel>, { date }: GetCachedDataOfMonth) {
    const state = ctx.getState();
    const key = WidgetMonthState.generateKey(date);
    const month = state.months[key];

    if (month) {
      return ctx.patchState({ selectedMonth: key });
    }

    return ctx.dispatch(new LoadDataOfMonth(date));
  }

  @Action(LoadDataOfMonth)
  loadDataOfMonth(ctx: StateContext<WidgetMonthStateModel>, { date }: LoadDataOfMonth) {
    const widgetMonth: WidgetPeriod = {
      id: WidgetMonthState.generateKey(date),
      start: startOfMonth(date),
      end: endOfMonth(date),
      loading: true
    };

    return ctx.dispatch(new SaveDataOfMonthToStore(widgetMonth)).pipe(
      concatMap(() => this.datesService.getPeriod(widgetMonth.start, widgetMonth.end)),
      switchMap(res => {
        const normOfWorkingTime = this.datesService.calculateNormOfWorkingDays(
          widgetMonth.start,
          widgetMonth.end
        );

        const month = { ...widgetMonth, normOfWorkingTime, loading: false };

        if (isWithinInterval(new Date(), { start: widgetMonth.start, end: widgetMonth.end })) {
          month.dynamicNormOfWorkingTime = this.datesService.calculateNormOfWorkingDays(
            widgetMonth.start,
            new Date()
          );
        }

        if (isNotEmpty(res)) {
          month.activityPercent = res.activity_percent;
          month.dates = res.dates;
          month.duration = res.duration;
          month.avgHoursPerDay = Math.round(res.duration / res.dates.length);
        }

        return ctx.dispatch(new SaveDataOfMonthToStore(month));
      })
    );
  }

  @Action(SaveDataOfMonthToStore)
  saveDataOfMonthToStore(
    ctx: StateContext<WidgetMonthStateModel>,
    { value }: SaveDataOfMonthToStore
  ) {
    const state = ctx.getState();
    ctx.setState({
      months: { ...state.months, [value.id]: value },
      selectedMonth: value.id
    });
  }
}
