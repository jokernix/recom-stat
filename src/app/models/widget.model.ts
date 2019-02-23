import { DateModel } from './date.model';

export interface WidgetModel {
  activityPercent?: number;
  dates?: DateModel[];
  duration?: number;
  loading: boolean;
}
