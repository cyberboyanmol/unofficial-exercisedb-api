import { Module } from '@nestjs/common';
import { ConfigModule } from './libs/config/config.module';
import { AuthModule } from './app/auth/auth.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [ConfigModule, AuthModule, SharedModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
