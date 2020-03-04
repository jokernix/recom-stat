import { isWithinInterval } from 'date-fns';
import { calculateNormOfWorkingDays, calculateNormOfWorkingTime } from '../utils/date';
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

    if (end == null) {
      this.dynamicNormOfWorkingTime = calculateNormOfWorkingTime(start);
    } else {
      if (isWithinInterval(new Date(), { start, end })) {
        this.dynamicNormOfWorkingTime = calculateNormOfWorkingDays(start, new Date());
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

      this.difference = (this.dynamicNormOfWorkingTime || this.normOfWorkingTime) - this.duration;
    }
  }
}
