import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { endOfMonth, isWithinRange, startOfMonth } from 'date-fns';
import { concatMap, switchMap } from 'rxjs/operators';
import { WidgetModel } from '../../models/widget.model';
import { DatesService } from '../../services/dates.service';
import { isNotEmpty } from '../../utils/is-not-empty';
import {
  GetCachedDataOfMonth,
  LoadDataOfMonth,
  SaveDataOfMonthToStore
} from './widget-month.actions';

export interface WidgetMonthModel extends WidgetModel {
  id: string; // [YEAR.MONTH]
  start: Date;
  end: Date;
  normOfWorkingTime?: number;
  dynamicNormOfWorkingTime?: number;
}

export interface WidgetMonthStateModel {
  months: { [key: string]: WidgetMonthModel };
  selectedMonth: string;
}

@State<WidgetMonthStateModel>({
  name: 'month',
  defaults: { months: {}, selectedMonth: null }
})
export class WidgetMonthState implements NgxsOnInit {
  @Selector()
  static getMonth({ months, selectedMonth }: WidgetMonthStateModel): WidgetMonthModel {
    return months[selectedMonth];
  }

  static generateKey(date: Date): string {
    return `[${date.getFullYear()}.${date.getMonth()}]`;
  }

  constructor(private datesService: DatesService) {}

  ngxsOnInit(ctx: StateContext<WidgetMonthStateModel>) {
    ctx.dispatch(new LoadDataOfMonth(new Date()));
  }

  @Action(GetCachedDataOfMonth)
  getCachedDataOfMonth(ctx: StateContext<WidgetMonthStateModel>, { date }: GetCachedDataOfMonth) {
    const state = ctx.getState();
    const key = WidgetMonthState.generateKey(date);
    const month = state.months[key];

    if (month) {
      ctx.patchState({ selectedMonth: key });
    }

    return ctx.dispatch(new LoadDataOfMonth(date));
  }

  @Action(LoadDataOfMonth)
  loadDataOfMonth(ctx: StateContext<WidgetMonthStateModel>, { date }: LoadDataOfMonth) {
    const widgetMonth: WidgetMonthModel = {
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

        if (isWithinRange(new Date(), widgetMonth.start, widgetMonth.end)) {
          month.dynamicNormOfWorkingTime = this.datesService.calculateNormOfWorkingDays(
            widgetMonth.start,
            new Date()
          );
        }

        if (isNotEmpty(res)) {
          month.activityPercent = res.activity_percent;
          month.dates = res.dates;
          month.duration = res.duration;
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
