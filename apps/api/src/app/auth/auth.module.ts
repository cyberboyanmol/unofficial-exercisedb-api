import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import * as passport from 'passport';
import { GoogleStrategy } from './passportStrategies/google.strategy';
import { AuthService } from './services/auth.service';
import { USE_CASES } from './usecases';
import { SharedModule } from '@/shared/shared.module';
import { QueueModule } from '@/shared/queue/queue.module';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from '@/shared/queue/email-processor.service';

@Module({
  imports: [
    SharedModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        username: process.env.REDIS_USERNAME,
        tls: {
          rejectUnauthorized: true,
        },
      },
    }),
    BullModule.registerQueue({
      name: 'email:notification',
    }),
  ],
  controllers: [AuthController],
  providers: [GoogleStrategy, ...USE_CASES, AuthService, EmailProcessor],
  exports: [AuthService, ...USE_CASES],
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
