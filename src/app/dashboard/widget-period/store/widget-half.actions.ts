import { WidgetPeriod } from '../../../models/widget.model';

export class GetCachedDataOfHalf {
  public static readonly type = '[WidgetHalf] GetCachedDataOfHalf';
  constructor(public date: Date) {}
}

export class LoadDataOfHalf {
  public static readonly type = '[WidgetHalf] LoadDataOfHalf';
  constructor(public date: Date) {}
}

export class SaveDataOfHalfToStore {
  public static readonly type = '[WidgetHalf] SaveDataOfHalfToStore';
  constructor(public value: WidgetPeriod) {}
}

export class GetPrevHalf {
  public static readonly type = '[WidgetHalf] GetPrevHalf';
}

export class GetNextHalf {
  public static readonly type = '[WidgetHalf] GetNextHalf';
}
