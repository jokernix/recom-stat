import { Tokens } from '../../core/models/tokens.model';
import { User } from '../../core/models/user.model';

export class Login {
  static type = '[Auth] Login';
  constructor(public token: string) {}
}
export class Logout {
  static type = '[Auth] Logout';
}

// Events
export class SaveTokens {
  static type = '[Auth] SaveTokens';
  constructor(public tokens: Tokens) {}
}
export class LoginSuccess {
  static type = '[Auth] LoginSuccess';
  constructor(public user: User) {}
}
export class LoginFailed {
  static type = '[Auth] LoginFailed';
  constructor(public error: any) {}
}
export class LogoutSuccess {
  static type = '[Auth] LogoutSuccess';
}
