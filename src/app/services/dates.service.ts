import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Organization } from '../models/organization.model';
import { UserWithDates } from '../models/user-with-dates.model';

@Injectable({
  providedIn: 'root'
})
export class DatesService {
  constructor(private http: HttpClient) {}

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
        map(res => res.organizations[0]),
        map(organization => organization.users[0])
      );
  }
}
