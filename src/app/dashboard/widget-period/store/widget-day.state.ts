import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { startOfDay } from 'date-fns';
import { concatMap, switchMap } from 'rxjs/operators';

import { WidgetPeriod } from '../../../models/widget.model';
import { DatesService } from '../../../services/dates.service';
import { isNotEmpty } from '../../../utils/is-not-empty';
import { GetCachedDataOfDay, LoadDataOfDay, SaveDataOfDayToStore } from './widget-day.actions';

export interface WidgetDayStateModel {
  days: { [key: string]: WidgetPeriod };
  selectedDay: string;
}

@State<WidgetDayStateModel>({
  name: 'day',
  defaults: { days: {}, selectedDay: null }
})
export class WidgetDayState implements NgxsOnInit {
  @Selector()
  static getDay({ days, selectedDay }: WidgetDayStateModel): WidgetPeriod {
    return days[selectedDay];
  }

  constructor(private datesService: DatesService) {}

  ngxsOnInit(ctx: StateContext<WidgetDayStateModel>) {
    ctx.dispatch(new LoadDataOfDay(startOfDay(new Date())));
  }

  @Action(GetCachedDataOfDay)
  getDataOfDay(ctx: StateContext<WidgetDayStateModel>, { date }: GetCachedDataOfDay) {
    const state = ctx.getState();
    const key = date.toISOString();
    const day = state.days[key];
    if (day) {
      return ctx.patchState({ selectedDay: key });
    }

    return ctx.dispatch(new LoadDataOfDay(date));
  }

  @Action(LoadDataOfDay)
  loadDataOfDay(ctx: StateContext<WidgetDayStateModel>, { date }: LoadDataOfDay) {
    const widgetDay: WidgetPeriod = { id: null, start: date, end: null, loading: true };

    return ctx.dispatch(new SaveDataOfDayToStore(widgetDay)).pipe(
      concatMap(() => this.datesService.getPeriod(date, date)),
      switchMap(res => {
        const normOfWorkingTime = this.datesService.calculateNormOfWorkingTime(date);
        const day = { ...widgetDay, normOfWorkingTime, loading: false };

        if (isNotEmpty(res)) {
          day.activityPercent = res.activity_percent;
          day.dates = res.dates;
          day.duration = res.duration;
        }

        return ctx.dispatch(new SaveDataOfDayToStore(day));
      })
    );
  }

  @Action(SaveDataOfDayToStore)
  saveDataOfDayToStore(ctx: StateContext<WidgetDayStateModel>, { value }: SaveDataOfDayToStore) {
    const key = value.start.toISOString();
    const state = ctx.getState();
    ctx.setState({
      days: { ...state.days, [key]: value },
      selectedDay: key
    });
  }
}
