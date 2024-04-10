import { USER_ROLE_ENUM } from './user.enums';

export interface IUserEntity {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  profilePicture?: string | null;
  role?: USER_ROLE_ENUM;
  createdAt: string;
}
