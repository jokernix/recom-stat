import { isToday, isWithinInterval, startOfDay, startOfYesterday } from 'date-fns';
import {
  calculateNormOfWorkingDays,
  calculateNormOfWorkingTime,
  dayIsWeekend
} from '../utils/date';
import { isNotEmpty } from '../utils/is-not-empty';
import { DateModel } from './date.model';
import { UserWithDates } from './user-with-dates.model';

export interface WidgetPeriod {
  id: string;
  start: Date;
  end: Date;
  loading: boolean;

  dynamicNormOfWorkingTime?: number;
  normOfWorkingTime?: number;

  activityPercent?: number;
  avgHoursPerDay?: number;
  dates?: DateModel[];
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
  dates?: DateModel[];
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

  update(value?: UserWithDates) {
    this.loading = false;

    if (isNotEmpty(value)) {
      this.activityPercent = value.activity_percent;
      this.dates = value.dates;
      this.duration = value.duration;

      if (this.end) {
        this.avgHoursPerDay = Math.round(value.duration / value.dates.length);
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
