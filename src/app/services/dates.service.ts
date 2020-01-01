import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { differenceInSeconds, eachDay, isBefore, isSameDay, isToday, isWeekend } from 'date-fns';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Organization } from '../models/organization.model';
import { UserWithDates } from '../models/user-with-dates.model';
import { holidays, workingDays } from '../models/working-days';

const secondsInHour = 60 * 60;
const secondsInDay = 8 * secondsInHour;

@Injectable({
  providedIn: 'root'
})
export class DatesService {
  holidays: Date[] = [];
  workingDays: Date[] = [];

  constructor(private http: HttpClient) {
    this.holidays = holidays.map(day => new Date(day));
    this.workingDays = workingDays.map(day => new Date(day));
  }

  getPeriod(startDate: Date, endDate: Date): Observable<UserWithDates> {
    let params = new HttpParams();
    const startDateUTC = new Date(
      Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
    );
    const endDateUTC = new Date(
      Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
    );
    params = params.append('start_date', startDateUTC.toISOString());
    params = params.append('end_date', endDateUTC.toISOString());
    params = params.append('show_activity', 'true');

    return this.http
      .get<{ organizations: Organization[] }>('/custom/by_member/my', { params })
      .pipe(
        map(res => (res.organizations.length ? res.organizations[0] : { users: [] })),
        map(org => org.users[0])
      );
  }

  calculateNormOfWorkingTime(date: Date): number {
    const startOfWorkingDay = this.setTime(date, 9);
    const endOfWorkingDay = this.setTime(date, 18);

    if (isToday(date) && isBefore(new Date(), endOfWorkingDay)) {
      const lunchTime = this.setTime(date, 13);

      const norm = differenceInSeconds(new Date(), startOfWorkingDay);
      return isBefore(new Date(), lunchTime) ? norm : norm - secondsInHour;
    }

    return secondsInDay;
  }

  calculateNormOfWorkingDays(start: Date, end: Date): number {
    return eachDay(start, end).reduce(this.calculateSeconds.bind(this), 0);
  }

  private setTime(date: Date, hour: number, minutes: number = 0, seconds: number = 0): Date {
    const d = new Date(date);
    d.setHours(hour, minutes, seconds);
    return d;
  }

  private calculateSeconds(prev: number, day: Date): number {
    return this.dayIsWeekend(day) ? prev : prev + secondsInDay;
  }

  private dayIsWeekend(day): boolean {
    if (isWeekend(day)) {
      return !this.workingDays.some(date => isSameDay(date, day));
    }

    return this.holidays.some(date => isSameDay(date, day));
  }
}
