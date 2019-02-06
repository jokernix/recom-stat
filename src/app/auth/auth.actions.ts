import { UserWithToken } from '../models/user-with-token.model';

// Actions
export class CheckSession {
  static type = '[Auth] CheckSession';
}
export class Login {
  static type = '[Auth] Login';
  constructor(public email: string, public password: string) {}
}
export class Logout {
  static type = '[Auth] Logout';
}

// Events
export class LoginRedirect {
  static type = '[Auth] LoginRedirect';
}
export class LoginSuccess {
  static type = '[Auth] LoginSuccess';
  constructor(public user: UserWithToken) {}
}
export class LoginFailed {
  static type = '[Auth] LoginFailed';
  constructor(public error: any) {}
}
export class LogoutSuccess {
  static type = '[Auth] LogoutSuccess';
}
