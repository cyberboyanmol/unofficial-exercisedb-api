import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailProcessor } from './email-processor.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        username: process.env.REDIS_USERNAME,
        keepAlive: +process.env.DEFAULT_KEEP_ALIVE,
      },
    }),

    // BullModule.registerQueue({
    //   name: 'email:notification',
    // }),
  ],
  providers: [EmailProcessor],
})
export class QueueModule {}
