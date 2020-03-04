import { User } from './user.model';

export interface UserWithToken extends User {
  auth_token: string;
}
