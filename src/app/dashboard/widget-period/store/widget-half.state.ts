import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  addDays,
  endOfDay,
  endOfMonth,
  isBefore,
  isSameDay,
  startOfDay,
  startOfMonth,
  subDays,
} from 'date-fns';
import { concatMap, switchMap } from 'rxjs/operators';
import { Widget, WidgetPeriod } from '../../../core/models/widget.model';
import { DatesService } from '../../../core/services/dates.service';
import {
  GetCachedDataOfHalf,
  GetNextHalf,
  GetPrevHalf,
  LoadDataOfHalf,
  SaveDataOfHalfToStore,
} from './widget-half.actions';

export interface WidgetHalfStateModel {
  items: Map<string, WidgetPeriod> /* key = [YEAR.MONTH/HALF] */;
  selectedHalf: string;
}

@State<WidgetHalfStateModel>({
  name: 'half',
  defaults: { items: new Map<string, WidgetPeriod>(), selectedHalf: null },
})
@Injectable()
export class WidgetHalfState {
  @Selector()
  static getHalf({ items, selectedHalf }: WidgetHalfStateModel): WidgetPeriod {
    return items.get(selectedHalf);
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

  @Action(GetCachedDataOfHalf)
  getCachedDataOfHalf(ctx: StateContext<WidgetHalfStateModel>, { date }: GetCachedDataOfHalf) {
    const state = ctx.getState();
    const key = WidgetHalfState.generateKey(date);

    if (state.items.has(key)) {
      return ctx.patchState({ selectedHalf: key });
    }

    return ctx.dispatch(new LoadDataOfHalf(date));
  }

  @Action(GetPrevHalf) getPrevHalf(ctx: StateContext<WidgetHalfStateModel>) {
    const store = ctx.getState();
    const current = store.items.get(store.selectedHalf);

    return ctx.dispatch(new GetCachedDataOfHalf(subDays(current.start, 3)));
  }

  @Action(GetNextHalf) getNextHalf(ctx: StateContext<WidgetHalfStateModel>) {
    const store = ctx.getState();
    const current = store.items.get(store.selectedHalf);

    return ctx.dispatch(new GetCachedDataOfHalf(addDays(current.end, 3)));
  }

  @Action(LoadDataOfHalf)
  loadDataOfHalf(ctx: StateContext<WidgetHalfStateModel>, { date }: LoadDataOfHalf) {
    const [start, end] = WidgetHalfState.getPeriod(date);

    const widgetHalf: Widget = new Widget(WidgetHalfState.generateKey(date), start, end);

    return ctx.dispatch(new SaveDataOfHalfToStore(widgetHalf)).pipe(
      concatMap(() => this.datesService.getDailyActivities(widgetHalf.start, widgetHalf.end)),
      switchMap((res) => {
        widgetHalf.update(res);

        return ctx.dispatch(new SaveDataOfHalfToStore(widgetHalf));
      })
    );
  }

  @Action(SaveDataOfHalfToStore)
  saveDataOfHalfToStore(ctx: StateContext<WidgetHalfStateModel>, { value }: SaveDataOfHalfToStore) {
    const state = ctx.getState();
    const items = new Map(state.items);

    items.set(value.id, value);

    ctx.setState({ items, selectedHalf: value.id });
  }
}
