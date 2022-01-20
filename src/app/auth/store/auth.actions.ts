import { Tokens } from '../../core/models/tokens.model';

export class FetchProfile {
  static type = '[Auth] FetchProfile';
}
export class Logout {
  static type = '[Auth] Logout';
}
export class SaveTokens {
  static type = '[Auth] SaveTokens';
  constructor(public tokens: Tokens) {}
}
export class LoginFailed {
  static type = '[Auth] LoginFailed';
  constructor(public error: any) {}
}
export class LogoutSuccess {
  static type = '[Auth] LogoutSuccess';
}
