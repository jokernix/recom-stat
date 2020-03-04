import { WidgetPeriod } from '../../../core/models/widget.model';

export class GetCachedDataOfWeek {
  public static readonly type = '[WidgetWeek] GetCachedDataOfWeek';
  constructor(public date: Date) {}
}

export class LoadDataOfWeek {
  public static readonly type = '[WidgetWeek] LoadDataOfWeek';
  constructor(public date: Date) {}
}

export class SaveDataOfWeekToStore {
  public static readonly type = '[WidgetWeek] SaveDataOfWeekToStore';
  constructor(public value: WidgetPeriod) {}
}
