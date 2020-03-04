import { WidgetPeriod } from '../../../core/models/widget.model';

export class GetCachedDataOfMonth {
  public static readonly type = '[WidgetMonth] GetCachedDataOfMonth';
  constructor(public date: Date) {}
}

export class LoadDataOfMonth {
  public static readonly type = '[WidgetMonth] LoadDataOfMonth';
  constructor(public date: Date) {}
}

export class SaveDataOfMonthToStore {
  public static readonly type = '[WidgetMonth] SaveDataOfMonthToStore';
  constructor(public value: WidgetPeriod) {}
}
