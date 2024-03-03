import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import * as passport from 'passport';
import { GoogleStrategy } from './passportStrategies/google.strategy';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [GoogleStrategy],
  exports: [],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    if (process.env.GOOGLE_OAUTH_CLIENT_ID) {
      consumer
        .apply(
          passport.authenticate('google', {
            session: false,
            scope: ['email', 'profile'],
            accessType: 'offline',
            prompt: 'consent',
            failureRedirect: 'http://localhost:3000/',
          }),
        )
        .forRoutes({
          path: '/auth/google',
          method: RequestMethod.GET,
        });
    }
  }
}
