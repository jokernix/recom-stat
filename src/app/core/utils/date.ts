import {
  differenceInSeconds,
  eachDayOfInterval,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  isWeekend,
  isWithinInterval,
  startOfDay
} from 'date-fns';
import { holidays, workingDays } from '../models/working-days';

const SECONDS_IN_HOUR = 60 * 60;
const SECONDS_IN_DAY = 8 * SECONDS_IN_HOUR;
const OFFICE_HOURS = [9, 18];

function calculateNormOfWorkingTime(date: Date): number {
  const now = new Date();
  const startOfWorkingDay = setTime(date, OFFICE_HOURS[0]);
  const endOfWorkingDay = setTime(date, OFFICE_HOURS[1]);

  if (isToday(date) && isBefore(now, startOfWorkingDay)) {
    return 0;
  }

  if (isToday(date) && isWithinInterval(now, { start: startOfWorkingDay, end: endOfWorkingDay })) {
    const lunchTime = setTime(date, 13);

    const norm = differenceInSeconds(now, startOfWorkingDay);
    return isBefore(now, lunchTime) ? norm : norm - SECONDS_IN_HOUR;
  }

  if (isToday(date) && isAfter(now, endOfWorkingDay)) {
    return SECONDS_IN_DAY;
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
  return isWeekend(day) ? !workingDays.has(day.getTime()) : holidays.has(day.getTime());
}

function setTime(date: Date, hour: number, minutes: number = 0, seconds: number = 0): Date {
  const d = new Date(date);
  d.setHours(hour, minutes, seconds);
  return d;
}

export { calculateNormOfWorkingTime, calculateNormOfWorkingDays };
