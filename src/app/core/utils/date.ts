import {
  differenceInSeconds,
  eachDayOfInterval,
  isBefore,
  isSameDay,
  isToday,
  isWeekend,
  startOfDay
} from 'date-fns';
import { holidays, workingDays } from '../models/working-days';

const SECONDS_IN_HOUR = 60 * 60;
const SECONDS_IN_DAY = 8 * SECONDS_IN_HOUR;
const OFFICE_HOURS = [9, 18];

function calculateNormOfWorkingTime(date: Date): number {
  const startOfWorkingDay = setTime(date, OFFICE_HOURS[0]);
  const endOfWorkingDay = setTime(date, OFFICE_HOURS[1]);

  if (isToday(date) && isBefore(new Date(), endOfWorkingDay)) {
    const lunchTime = setTime(date, 13);

    const norm = differenceInSeconds(new Date(), startOfWorkingDay);
    return isBefore(new Date(), lunchTime) ? norm : norm - SECONDS_IN_HOUR;
  }

  return null;
}

function calculateNormOfWorkingDays(start: Date, end: Date): number {
  if (isSameDay(start, end) || end == null) return dayIsWeekend(start) ? 0 : SECONDS_IN_DAY;

  return eachDayOfInterval({ start, end }).reduce(
    (prev: number, day: Date) => (dayIsWeekend(startOfDay(day)) ? prev : prev + SECONDS_IN_DAY),
    0
  );
}

function dayIsWeekend(day: Date): boolean {
  return isWeekend(day) ? !workingDays.has(day) : holidays.has(day);
}

function setTime(date: Date, hour: number, minutes: number = 0, seconds: number = 0): Date {
  const d = new Date(date);
  d.setHours(hour, minutes, seconds);
  return d;
}

export { calculateNormOfWorkingTime, calculateNormOfWorkingDays };
