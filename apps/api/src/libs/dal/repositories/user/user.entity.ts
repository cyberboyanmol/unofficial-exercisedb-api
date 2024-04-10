import { Exclude } from 'class-transformer';
import { IUserEntity, USER_ROLE_ENUM } from '../../shared';

export interface IUserAccount {
  providerAccountId: string;
  provider: string;
  refreshToken: string;
  accessToken: string;
  username?: string;
  valid: boolean;
}

export class UserEntity implements IUserEntity {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: USER_ROLE_ENUM;
  profilePicture?: string | null;
  email?: string | null;
  createdAt: string;
  failedLogin?: {
    times: number;
    lastFailedAttempt: string;
  };
  @Exclude({ toPlainOnly: true })
  accounts: IUserAccount[];
}

export type UserDBModel = UserEntity;
