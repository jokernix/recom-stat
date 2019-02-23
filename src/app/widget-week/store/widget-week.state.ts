import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { endOfWeek, getISOWeek, startOfWeek } from 'date-fns';
import { concatMap, switchMap } from 'rxjs/operators';
import { WidgetModel } from '../../models/widget.model';
import { DatesService } from '../../services/dates.service';
import { isNotEmpty } from '../../utils/is-not-empty';
import { GetCachedDataOfWeek, LoadDataOfWeek, SaveDataOfWeekToStore } from './widget-week.actions';

export interface WidgetWeekModel extends WidgetModel {
  id: string; // [YEAR.NUMBER_OF_WEEK]
  start: Date;
  end: Date;
  normOfWorkingTime?: number;
  dynamicNormOfWorkingTime?: number;
}

export interface WidgetWeekStateModel {
  weeks: { [key: string]: WidgetWeekModel };
  selectedWeek: string;
}

@State<WidgetWeekStateModel>({
  name: 'week',
  defaults: { weeks: {}, selectedWeek: null }
})
export class WidgetWeekState implements NgxsOnInit {
  @Selector()
  static getWeek({ weeks, selectedWeek }: WidgetWeekStateModel): WidgetWeekModel {
    return weeks[selectedWeek];
  }

  static generateKey(date: Date): string {
    return `[${date.getFullYear()}.${getISOWeek(date)}]`;
  }

  constructor(private datesService: DatesService) {}

  ngxsOnInit(ctx: StateContext<WidgetWeekStateModel>) {
    ctx.dispatch(new LoadDataOfWeek(new Date()));
  }

  @Action(GetCachedDataOfWeek)
  getCachedDataOfWeek(ctx: StateContext<WidgetWeekStateModel>, { date }: GetCachedDataOfWeek) {
    const state = ctx.getState();
    const key = WidgetWeekState.generateKey(date);
    const week = state.weeks[key];

    if (week) {
      ctx.patchState({ selectedWeek: key });
    }

    return ctx.dispatch(new LoadDataOfWeek(date));
  }

  @Action(LoadDataOfWeek)
  loadDataOfWeek(ctx: StateContext<WidgetWeekStateModel>, { date }: LoadDataOfWeek) {
    const widgetWeek: WidgetWeekModel = {
      id: WidgetWeekState.generateKey(date),
      start: startOfWeek(date),
      end: endOfWeek(date),
      loading: true
    };

    return ctx.dispatch(new SaveDataOfWeekToStore(widgetWeek)).pipe(
      concatMap(() => this.datesService.getPeriod(widgetWeek.start, widgetWeek.end)),
      switchMap(res => {
        // const normOfWorkingTime = this.datesService.calculateNormOfWorkingTime(date);
        const week = { ...widgetWeek, loading: false };

        if (isNotEmpty(res)) {
          week.activityPercent = res.activity_percent;
          week.dates = res.dates;
          week.duration = res.duration;
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
