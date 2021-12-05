import { isToday, isWithinInterval, startOfDay, startOfYesterday } from 'date-fns';
import {
  calculateNormOfWorkingDays,
  calculateNormOfWorkingTime,
  dayIsWeekend,
} from '../utils/date';
import { isNotEmpty } from '../utils/is-not-empty';
import { DailyActivity } from './daily-activity.model';

export interface WidgetPeriod {
  id: string;
  start: Date;
  end: Date;
  loading: boolean;

  dynamicNormOfWorkingTime?: number;
  normOfWorkingTime?: number;

  activityPercent?: number;
  avgHoursPerDay?: number;
  dates?: DailyActivity[];
  duration?: number;
  difference?: number;
}

export class Widget implements WidgetPeriod {
  id: string;
  start: Date;
  end: Date;
  loading: boolean = true;
  normOfWorkingTime: number;

  dynamicNormOfWorkingTime?: number;

  avgHoursPerDay?: number;
  activityPercent?: number;
  dates?: DailyActivity[];
  duration?: number;
  difference?: number;

  constructor(id, start, end) {
    this.id = id;
    this.start = start;
    this.end = end;

    this.normOfWorkingTime = calculateNormOfWorkingDays(start, end);

    if (isToday(start) || end == null) {
      this.dynamicNormOfWorkingTime = calculateNormOfWorkingTime(start);
    } else {
      if (isWithinInterval(new Date(), { start, end })) {
        this.dynamicNormOfWorkingTime =
          calculateNormOfWorkingDays(start, startOfYesterday()) +
          calculateNormOfWorkingTime(new Date());
      }
    }
  }

  update(values?: DailyActivity[]) {
    this.loading = false;

    if (isNotEmpty(values)) {
      this.dates = values;

      const { tracked, overall } = values.reduce(
        (acc, value) => {
          acc.tracked += value.tracked;
          acc.overall += value.overall;
          return acc;
        },
        { tracked: 0, overall: 0 }
      );

      this.activityPercent = overall / tracked;
      this.duration = tracked;

      if (this.end) {
        this.avgHoursPerDay = Math.round(this.duration / this.dates.length);
      }

      const norm =
        this.dynamicNormOfWorkingTime && this.dynamicNormOfWorkingTime < this.normOfWorkingTime
          ? this.dynamicNormOfWorkingTime
          : this.normOfWorkingTime;

      this.difference = norm - this.duration;

      if (
        this.dates.length === 1 &&
        isToday(new Date(this.dates[0].date)) &&
        dayIsWeekend(startOfDay(new Date(this.dates[0].date)))
      ) {
        this.difference = this.duration * -1;
      }
    }
  }
}
