import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserWithToken } from '../models/user-with-token.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<UserWithToken> {
    return this.http
      .post<{ user: UserWithToken }>('/auth', { email, password })
      .pipe(map((res: { user: UserWithToken }) => res.user));
  }

  getUser(): Observable<User> {
    return this.http
      .get<{ users: User[] }>('/users')
      .pipe(map(res => (res.users && res.users.length ? res.users[0] : null)));
  }
}
