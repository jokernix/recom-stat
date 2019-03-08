import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import {
  addDays,
  endOfDay,
  endOfMonth,
  isBefore,
  isSameDay,
  isWithinRange,
  startOfDay,
  startOfMonth,
  subDays
} from 'date-fns';
import { concatMap, switchMap } from 'rxjs/operators';
import { WidgetPeriod } from '../../../models/widget.model';
import { DatesService } from '../../../services/dates.service';
import { isNotEmpty } from '../../../utils/is-not-empty';
import {
  GetCachedDataOfHalf,
  GetNextHalf,
  GetPrevHalf,
  LoadDataOfHalf,
  SaveDataOfHalfToStore
} from './widget-half.actions';

export interface WidgetHalfStateModel {
  items: { [key: string /* [YEAR.MONTH/HALF] */]: WidgetPeriod };
  selectedHalf: string;
}

@State<WidgetHalfStateModel>({
  name: 'half',
  defaults: { items: {}, selectedHalf: null }
})
export class WidgetHalfState implements NgxsOnInit {
  @Selector()
  static getHalf({ items, selectedHalf }: WidgetHalfStateModel): WidgetPeriod {
    return items[selectedHalf];
  }

  static generateKey(date: Date): string {
    const isFirstHalf = WidgetHalfState.getPeriod(date)[1].getDate() < 16;
    return `[${date.getFullYear()}.${date.getMonth()}/${isFirstHalf ? 1 : 2}]`;
  }

  static getPeriod(date: Date): Date[] {
    let start: Date;
    let end: Date;

    const midMonth = startOfDay(date).setDate(15);

    if (isBefore(date, midMonth) || isSameDay(date, midMonth)) {
      start = startOfMonth(date);
      end = endOfDay(midMonth);
    } else {
      start = startOfDay(addDays(midMonth, 1));
      end = endOfMonth(date);
    }

    return [start, end];
  }

  constructor(private datesService: DatesService) {}

  ngxsOnInit(ctx: StateContext<WidgetHalfStateModel>) {
    ctx.dispatch(new LoadDataOfHalf(new Date()));
  }

  @Action(GetCachedDataOfHalf)
  getCachedDataOfHalf(ctx: StateContext<WidgetHalfStateModel>, { date }: GetCachedDataOfHalf) {
    const state = ctx.getState();
    const key = WidgetHalfState.generateKey(date);
    const half = state.items[key];

    if (half) {
      return ctx.patchState({ selectedHalf: key });
    }

    return ctx.dispatch(new LoadDataOfHalf(date));
  }

  @Action(GetPrevHalf) getPrevHalf(ctx: StateContext<WidgetHalfStateModel>) {
    const store = ctx.getState();
    const current = store.items[store.selectedHalf];

    return ctx.dispatch(new GetCachedDataOfHalf(subDays(current.start, 3)));
  }

  @Action(GetNextHalf) getNextHalf(ctx: StateContext<WidgetHalfStateModel>) {
    const store = ctx.getState();
    const current = store.items[store.selectedHalf];

    return ctx.dispatch(new GetCachedDataOfHalf(addDays(current.end, 3)));
  }

  @Action(LoadDataOfHalf)
  loadDataOfHalf(ctx: StateContext<WidgetHalfStateModel>, { date }: LoadDataOfHalf) {
    const [start, end] = WidgetHalfState.getPeriod(date);

    const widgetHalf: WidgetPeriod = {
      id: WidgetHalfState.generateKey(date),
      start,
      end,
      loading: true
    };

    return ctx.dispatch(new SaveDataOfHalfToStore(widgetHalf)).pipe(
      concatMap(() => this.datesService.getPeriod(widgetHalf.start, widgetHalf.end)),
      switchMap(res => {
        const normOfWorkingTime = this.datesService.calculateNormOfWorkingDays(
          widgetHalf.start,
          widgetHalf.end
        );

        const half = { ...widgetHalf, normOfWorkingTime, loading: false };

        if (isWithinRange(new Date(), widgetHalf.start, widgetHalf.end)) {
          half.dynamicNormOfWorkingTime = this.datesService.calculateNormOfWorkingDays(
            widgetHalf.start,
            new Date()
          );
        }

        if (isNotEmpty(res)) {
          half.activityPercent = res.activity_percent;
          half.dates = res.dates;
          half.duration = res.duration;
          half.avgHoursPerDay = Math.round(res.duration / res.dates.length);
        }

        return ctx.dispatch(new SaveDataOfHalfToStore(half));
      })
    );
  }

  @Action(SaveDataOfHalfToStore)
  saveDataOfHalfToStore(ctx: StateContext<WidgetHalfStateModel>, { value }: SaveDataOfHalfToStore) {
    const state = ctx.getState();
    ctx.setState({
      items: { ...state.items, [value.id]: value },
      selectedHalf: value.id
    });
  }
}
