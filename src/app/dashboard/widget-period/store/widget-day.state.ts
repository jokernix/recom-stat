import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { concatMap, switchMap } from 'rxjs/operators';

import { Widget, WidgetPeriod } from '../../../core/models/widget.model';
import { DatesService } from '../../../core/services/dates.service';
import { GetCachedDataOfDay, LoadDataOfDay, SaveDataOfDayToStore } from './widget-day.actions';

export interface WidgetDayStateModel {
  days: Map<string, WidgetPeriod>;
  selectedDay: string;
}

@State<WidgetDayStateModel>({
  name: 'day',
  defaults: { days: new Map<string, WidgetPeriod>(), selectedDay: null },
})
@Injectable()
export class WidgetDayState {
  @Selector()
  static getDay({ days, selectedDay }: WidgetDayStateModel): WidgetPeriod {
    return days.get(selectedDay);
  }

  constructor(private datesService: DatesService) {}

  @Action(GetCachedDataOfDay)
  getDataOfDay(ctx: StateContext<WidgetDayStateModel>, { date }: GetCachedDataOfDay) {
    const state = ctx.getState();
    const key = date.toISOString();
    if (state.days.has(key)) {
      return ctx.patchState({ selectedDay: key });
    }

    return ctx.dispatch(new LoadDataOfDay(date));
  }

  @Action(LoadDataOfDay)
  loadDataOfDay(ctx: StateContext<WidgetDayStateModel>, { date }: LoadDataOfDay) {
    const widgetDay: Widget = new Widget(null, date, null);

    return ctx.dispatch(new SaveDataOfDayToStore(widgetDay)).pipe(
      concatMap(() => this.datesService.getDailyActivities(date, date)),
      switchMap((res) => {
        widgetDay.update(res);

        return ctx.dispatch(new SaveDataOfDayToStore(widgetDay));
      })
    );
  }

  @Action(SaveDataOfDayToStore)
  saveDataOfDayToStore(ctx: StateContext<WidgetDayStateModel>, { value }: SaveDataOfDayToStore) {
    const state = ctx.getState();
    const days = new Map(state.days);

    const selectedDay = value.start.toISOString();
    days.set(selectedDay, value);

    ctx.setState({ days, selectedDay });
  }
}
