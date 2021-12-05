import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { endOfWeek, getISOWeek, startOfWeek } from 'date-fns';
import { concatMap, switchMap } from 'rxjs/operators';

import { Widget, WidgetPeriod } from '../../../core/models/widget.model';
import { DatesService } from '../../../core/services/dates.service';
import { GetCachedDataOfWeek, LoadDataOfWeek, SaveDataOfWeekToStore } from './widget-week.actions';

export interface WidgetWeekStateModel {
  weeks: Map<string, WidgetPeriod> /* key = [YEAR.NUMBER_OF_WEEK] */;
  selectedWeek: string;
}

@State<WidgetWeekStateModel>({
  name: 'week',
  defaults: { weeks: new Map(), selectedWeek: null },
})
@Injectable()
export class WidgetWeekState {
  @Selector()
  static getWeek({ weeks, selectedWeek }: WidgetWeekStateModel): WidgetPeriod {
    return weeks.get(selectedWeek);
  }

  static generateKey(date: Date): string {
    return `[${date.getFullYear()}.${getISOWeek(date)}]`;
  }

  constructor(private datesService: DatesService) {}

  @Action(GetCachedDataOfWeek)
  getCachedDataOfWeek(ctx: StateContext<WidgetWeekStateModel>, { date }: GetCachedDataOfWeek) {
    const state = ctx.getState();
    const key = WidgetWeekState.generateKey(date);

    if (state.weeks.has(key)) {
      return ctx.patchState({ selectedWeek: key });
    }

    return ctx.dispatch(new LoadDataOfWeek(date));
  }

  @Action(LoadDataOfWeek)
  loadDataOfWeek(ctx: StateContext<WidgetWeekStateModel>, { date }: LoadDataOfWeek) {
    const widgetWeek: Widget = new Widget(
      WidgetWeekState.generateKey(date),
      startOfWeek(date, { weekStartsOn: 1 }),
      endOfWeek(date, { weekStartsOn: 1 })
    );

    return ctx.dispatch(new SaveDataOfWeekToStore(widgetWeek)).pipe(
      concatMap(() => this.datesService.getDailyActivities(widgetWeek.start, widgetWeek.end)),
      switchMap((res) => {
        widgetWeek.update(res);

        return ctx.dispatch(new SaveDataOfWeekToStore(widgetWeek));
      })
    );
  }

  @Action(SaveDataOfWeekToStore)
  saveDataOfWeekToStore(ctx: StateContext<WidgetWeekStateModel>, { value }: SaveDataOfWeekToStore) {
    const state = ctx.getState();
    const weeks = new Map(state.weeks);

    weeks.set(value.id, value);

    ctx.setState({ weeks, selectedWeek: value.id });
  }
}
