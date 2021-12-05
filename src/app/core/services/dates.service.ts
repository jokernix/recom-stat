import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from '../../auth/store/auth.state';
import { DailyActivity } from '../models/daily-activity.model';
import { getUTC } from '../utils/date';

@Injectable({
  providedIn: 'root',
})
export class DatesService {
  constructor(private http: HttpClient, private store: Store) {}

  getDailyActivities(start: Date, end: Date): Observable<DailyActivity[]> {
    const organizationId = this.store.selectSnapshot(AuthState.getOrganization)?.id;

    return this.http
      .get<{
        pagination?: { next_page_start_id: number };
        daily_activities: DailyActivity[];
      }>(`/organizations/${organizationId}/activities/daily`, {
        params: {
          page_limit: 500,
          'date[start]': getUTC(start).toISOString(),
          'date[stop]': getUTC(end).toISOString(),
        },
      })
      .pipe(map((res) => res.daily_activities));
  }
}
