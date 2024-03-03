import { Module } from '@nestjs/common';
import { ConfigModule } from './libs/config/config.module';
import { AuthModule } from './app/auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
