import { WidgetDayModel } from './widget-day.state';

export class GetCachedDataOfDay {
  public static readonly type = '[WidgetDay] GetCachedDataOfDay';
  constructor(public date: Date) {}
}

export class LoadDataOfDay {
  public static readonly type = '[WidgetDay] LoadDataOfDay';
  constructor(public date: Date) {}
}

export class SaveDataOfDayToStore {
  public static readonly type = '[WidgetDay] SaveDataOfDayToStore';
  constructor(public value: WidgetDayModel) {}
}