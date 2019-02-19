import { UserWithDates } from './user-with-dates.model';

export interface Organization {
  id: number;
  name: string;
  last_activity: string;
  duration: number;
  activity_percent: number;
  tasks_duration: number;
  users: UserWithDates[];
}
