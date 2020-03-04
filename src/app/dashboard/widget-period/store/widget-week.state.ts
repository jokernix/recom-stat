import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { endOfWeek, getISOWeek, isWithinInterval, startOfWeek } from 'date-fns';
import { concatMap, switchMap } from 'rxjs/operators';

import { WidgetPeriod } from '../../../core/models/widget.model';
import { DatesService } from '../../../core/services/dates.service';
import { isNotEmpty } from '../../../core/utils/is-not-empty';
import { GetCachedDataOfWeek, LoadDataOfWeek, SaveDataOfWeekToStore } from './widget-week.actions';

export interface WidgetWeekStateModel {
  weeks: { [key: string /* [YEAR.NUMBER_OF_WEEK] */]: WidgetPeriod };
  selectedWeek: string;
}

@State<WidgetWeekStateModel>({
  name: 'week',
  defaults: { weeks: {}, selectedWeek: null }
})
@Injectable()
export class WidgetWeekState implements NgxsOnInit {
  @Selector()
  static getWeek({ weeks, selectedWeek }: WidgetWeekStateModel): WidgetPeriod {
    return weeks[selectedWeek];
  }

  static generateKey(date: Date): string {
    return `[${date.getFullYear()}.${getISOWeek(date)}]`;
  }

  constructor(private datesService: DatesService) {}

  ngxsOnInit(ctx: StateContext<WidgetWeekStateModel>) {
    // ctx.dispatch(new LoadDataOfWeek(new Date()));
  }

  @Action(GetCachedDataOfWeek)
  getCachedDataOfWeek(ctx: StateContext<WidgetWeekStateModel>, { date }: GetCachedDataOfWeek) {
    const state = ctx.getState();
    const key = WidgetWeekState.generateKey(date);
    const week = state.weeks[key];

    if (week) {
      return ctx.patchState({ selectedWeek: key });
    }

    return ctx.dispatch(new LoadDataOfWeek(date));
  }

  @Action(LoadDataOfWeek)
  loadDataOfWeek(ctx: StateContext<WidgetWeekStateModel>, { date }: LoadDataOfWeek) {
    const widgetWeek: WidgetPeriod = {
      id: WidgetWeekState.generateKey(date),
      start: startOfWeek(date, { weekStartsOn: 1 }),
      end: endOfWeek(date, { weekStartsOn: 1 }),
      loading: true
    };

    return ctx.dispatch(new SaveDataOfWeekToStore(widgetWeek)).pipe(
      concatMap(() => this.datesService.getPeriod(widgetWeek.start, widgetWeek.end)),
      switchMap(res => {
        const normOfWorkingTime = this.datesService.calculateNormOfWorkingDays(
          widgetWeek.start,
          widgetWeek.end
        );

        const week = { ...widgetWeek, normOfWorkingTime, loading: false };

        if (isWithinInterval(new Date(), { start: widgetWeek.start, end: widgetWeek.end })) {
          week.dynamicNormOfWorkingTime = this.datesService.calculateNormOfWorkingDays(
            widgetWeek.start,
            new Date()
          );
        }

        if (isNotEmpty(res)) {
          week.activityPercent = res.activity_percent;
          week.dates = res.dates;
          week.duration = res.duration;
          week.avgHoursPerDay = Math.round(res.duration / res.dates.length);
        }

        return ctx.dispatch(new SaveDataOfWeekToStore(week));
      })
    );
  }

  @Action(SaveDataOfWeekToStore)
  saveDataOfWeekToStore(ctx: StateContext<WidgetWeekStateModel>, { value }: SaveDataOfWeekToStore) {
    const state = ctx.getState();
    ctx.setState({
      weeks: { ...state.weeks, [value.id]: value },
      selectedWeek: value.id
    });
  }
}
