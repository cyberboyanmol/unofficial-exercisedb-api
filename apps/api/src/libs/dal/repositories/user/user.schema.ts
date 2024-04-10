import mongoose, { Schema } from 'mongoose';
import { OAUTH_PROVIDER, USER_ROLE_ENUM } from '../../shared';
import { UserDBModel } from './user.entity';
import { schemaOptions } from '../schema-default.options';

const userSchema = new Schema<UserDBModel>(
  {
    firstName: {
      type: Schema.Types.String,
      required: [true, 'Please Enter First Name'],
      maxLength: [50, 'Name cannot exceed 50 characters'],
      minLength: [4, 'Name should have more than 4 characters'],
    },
    lastName: {
      type: Schema.Types.String,
      required: [true, 'Please Enter Last Name'],
      maxLength: [50, 'Name cannot exceed 50 characters'],
      minLength: [4, 'Name should have more than 4 characters'],
    },
    email: {
      type: Schema.Types.String,
      unique: true,
      required: [true, 'Please enter your email'],
    },
    profilePicture: {
      type: Schema.Types.String,
    },
    role: {
      required: true,
      type: Schema.Types.String,
      enum: USER_ROLE_ENUM,
      default: USER_ROLE_ENUM.USER,
    },
    failedLogin: {
      times: Schema.Types.Number,
      lastFailedAttempt: Schema.Types.Date,
    },
    accounts: [
      {
        providerAccountId: {
          required: true,
          type: Schema.Types.String,
        },
        provider: {
          type: Schema.Types.String,
          required: true,
          enum: OAUTH_PROVIDER,
        },
        refreshToken: {
          required: true,
          type: Schema.Types.String,
        },
        accessToken: {
          required: true,
          type: Schema.Types.String,
        },
        valid: {
          required: true,
          type: Schema.Types.Boolean,
        },
        lastUsed: {
          required: true,
          type: Schema.Types.Date,
        },
        username: {
          required: true,
          type: Schema.Types.String,
        },
      },
    ],
  },
  schemaOptions,
);

export const User =
  (mongoose.models.User as mongoose.Model<UserDBModel>) ||
  mongoose.model<UserDBModel>('User', userSchema);
