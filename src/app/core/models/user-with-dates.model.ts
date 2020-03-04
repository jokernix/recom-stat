import { DateModel } from './date.model';
import { User } from './user.model';

export interface UserWithDates extends User {
  duration: number;
  dates: DateModel[];
  activity_percent: number;
}
