import { DatesStateItemModel } from './dates.state';

export enum TypePeriod {
  Day = 'day',
  Week = 'week',
  Half = 'half',
  Month = 'month'
}
export class LoadPeriod {
  public static readonly type = '[Dates] Load Period';
  constructor(public typePeriod: TypePeriod, public start: Date, public end: Date) {}
}

export class LoadPeriodSuccess {
  public static readonly type = '[Dates] Load Period Success';
  constructor(public typePeriod: TypePeriod, public value: DatesStateItemModel) {}
}

export class LoadPeriodFail {
  public static readonly type = '[Dates] Load Period Fail';
  constructor(public typePeriod: TypePeriod) {}
}
