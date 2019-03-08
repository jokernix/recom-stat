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
