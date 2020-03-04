import { isWithinInterval } from 'date-fns';
import { calculateNormOfWorkingDays, calculateNormOfWorkingTime } from '../utils/date';
import { DateModel } from './date.model';

export interface WidgetModel {
  activityPercent?: number;
  dates?: DateModel[];
  duration?: number;
  loading: boolean;
}

export interface WidgetPeriod extends WidgetModel {
  id: string;
  start: Date;
  end: Date;
  normOfWorkingTime?: number;
  dynamicNormOfWorkingTime?: number;
  avgHoursPerDay?: number;
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
}
