import { Module } from '@nestjs/common';
import { ConfigModule } from './libs/config/config.module';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
