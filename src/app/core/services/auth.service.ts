import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Organization } from '../models/organization.model';
import { Tokens } from '../models/tokens.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getAccessToken(refreshToken: string): Observable<Tokens> {
    return this.http
      .post<{ access_token: string; refresh_token: string }>(
        'https://account.hubstaff.com/access_tokens',
        {},
        {
          params: {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          },
        }
      )
      .pipe(
        tap((res) => console.log('A new token has received', res)),
        map((data) => {
          return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          };
        })
      );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<{ user: User }>('/users/me').pipe(map((res) => res?.user));
  }

  getOrganization(): Observable<Organization> {
    return this.http
      .get<{
        pagination?: { next_page_start_id: number };
        organizations: Organization[];
      }>('/organizations')
      .pipe(
        map((res) => (res?.organizations && res.organizations.length ? res.organizations[0] : null))
      );
  }
}
