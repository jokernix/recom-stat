import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { endOfMonth, startOfMonth } from 'date-fns';
import { concatMap, switchMap } from 'rxjs/operators';

import { Widget, WidgetPeriod } from '../../../core/models/widget.model';
import { DatesService } from '../../../core/services/dates.service';
import {
  GetCachedDataOfMonth,
  LoadDataOfMonth,
  SaveDataOfMonthToStore
} from './widget-month.actions';

export interface WidgetMonthStateModel {
  months: Map<string, WidgetPeriod> /* key = [YEAR.MONTH] */;
  selectedMonth: string;
}

@State<WidgetMonthStateModel>({
  name: 'month',
  defaults: { months: new Map(), selectedMonth: null }
})
@Injectable()
export class WidgetMonthState {
  @Selector()
  static getMonth({ months, selectedMonth }: WidgetMonthStateModel): WidgetPeriod {
    return months.get(selectedMonth);
  }

  static generateKey(date: Date): string {
    return `[${date.getFullYear()}.${date.getMonth()}]`;
  }

  constructor(private datesService: DatesService) {}

  @Action(GetCachedDataOfMonth)
  getCachedDataOfMonth(ctx: StateContext<WidgetMonthStateModel>, { date }: GetCachedDataOfMonth) {
    const state = ctx.getState();
    const key = WidgetMonthState.generateKey(date);

    if (state.months.has(key)) {
      return ctx.patchState({ selectedMonth: key });
    }

    return ctx.dispatch(new LoadDataOfMonth(date));
  }

  @Action(LoadDataOfMonth)
  loadDataOfMonth(ctx: StateContext<WidgetMonthStateModel>, { date }: LoadDataOfMonth) {
    const widgetMonth: Widget = new Widget(
      WidgetMonthState.generateKey(date),
      startOfMonth(date),
      endOfMonth(date)
    );

    return ctx.dispatch(new SaveDataOfMonthToStore(widgetMonth)).pipe(
      concatMap(() => this.datesService.getPeriod(widgetMonth.start, widgetMonth.end)),
      switchMap(res => {
        widgetMonth.update(res);

        return ctx.dispatch(new SaveDataOfMonthToStore(widgetMonth));
      })
    );
  }

  @Action(SaveDataOfMonthToStore)
  saveDataOfMonthToStore(
    ctx: StateContext<WidgetMonthStateModel>,
    { value }: SaveDataOfMonthToStore
  ) {
    const state = ctx.getState();
    const months = new Map(state.months);

    months.set(value.id, value);

    ctx.setState({ months, selectedMonth: value.id });
  }
}
