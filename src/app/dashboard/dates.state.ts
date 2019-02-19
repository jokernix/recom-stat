import { Action, Selector, State, StateContext } from '@ngxs/store';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DateModel } from '../models/date.model';
import { DatesService } from '../services/dates.service';
import { LoadPeriod, LoadPeriodFail, LoadPeriodSuccess } from './dates.actions';

export interface DatesStateItemModel {
  activityPercent?: number;
  dates?: DateModel[];
  duration?: number;
  loading: boolean;
}
export interface DatesStateModel {
  day: DatesStateItemModel;
  week: DatesStateItemModel;
  half: DatesStateItemModel;
  month: DatesStateItemModel;
}

@State<DatesStateModel>({
  name: 'datesState',
  defaults: {
    day: null,
    week: null,
    half: null,
    month: null
  }
})
export class DatesState {
  @Selector()
  public static getDay(state: DatesStateModel): DatesStateItemModel {
    return state.day;
  }

  @Selector()
  public static getWeek(state: DatesStateModel): DatesStateItemModel {
    return state.week;
  }

  @Selector()
  public static getHalf(state: DatesStateModel): DatesStateItemModel {
    return state.half;
  }

  @Selector()
  public static getMonth(state: DatesStateModel): DatesStateItemModel {
    return state.month;
  }

  constructor(private datesService: DatesService) {}

  @Action(LoadPeriod)
  loadPeriod(
    { patchState, dispatch }: StateContext<DatesStateModel>,
    { typePeriod, start, end }: LoadPeriod
  ) {
    patchState({ [typePeriod]: { loading: true } });
    return this.datesService.getPeriod(start, end).pipe(
      map(value =>
        dispatch(
          new LoadPeriodSuccess(typePeriod, {
            activityPercent: value.activity_percent,
            dates: value.dates,
            duration: value.duration,
            loading: false
          })
        )
      ),
      catchError(() => of(dispatch(new LoadPeriodFail(typePeriod))))
    );
  }

  @Action(LoadPeriodSuccess)
  loadPeriodSuccess(
    { patchState }: StateContext<DatesStateModel>,
    { typePeriod, value }: LoadPeriodSuccess
  ) {
    patchState({ [typePeriod]: value });
  }

  @Action(LoadPeriodFail)
  loadPeriodFailed({ patchState }: StateContext<DatesStateModel>, { typePeriod }: LoadPeriodFail) {
    patchState({ [typePeriod]: { loading: false } });
  }
}
