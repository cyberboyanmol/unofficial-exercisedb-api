import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as googlePassport from 'passport-google-oauth20';
import {
  Metadata,
  StateStoreStoreCallback,
  StateStoreVerifyCallback,
} from 'passport-oauth2';
@Injectable()
export class GoogleStrategy extends PassportStrategy(
  googlePassport.Strategy,
  'google',
) {
  constructor() {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.API_ROOT_URL + '/api/v1/auth/google/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true,
      prompt: 'consent',
      access_type: 'offline',
      store: {
        verify(
          req,
          state: string,
          meta: Metadata,
          callback: StateStoreVerifyCallback,
        ) {
          callback(null, true, JSON.stringify(req.query));
        },
        store(req, meta: Metadata, callback: StateStoreStoreCallback) {
          callback(null, JSON.stringify(req.query));
        },
      },
    });
  }

  async validate(
    req,
    accessToken: string,

    refreshToken: string,
    googleProfile: googlePassport.Profile,
    done: googlePassport.VerifyCallback,
  ) {
    try {
      console.log(googleProfile);
      const profile = {
        ...googleProfile._json,
        email: googleProfile.emails[0].value,
      };
      const parsedState = this.parseState(req);

      console.log(req);

      console.log({ accessToken });
      console.log({ refreshToken });

      done(null, {
        profile,
        accessToken,
        refreshToken,
        parsedState,
        message: 'login successfully',
      });
    } catch (err) {
      done(err, false);
    }
  }

  private parseState(req) {
    try {
      return JSON.parse(req.query.state);
    } catch (e) {
      return {};
    }
  }
}
