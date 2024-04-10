import { DalService, UserRepository } from '@/libs/dal';
import { RedisRepository } from '@/libs/redis/redis.repository';
import { RedisProvider } from '@/libs/redis/redis.service';
import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { QueueModule } from './queue/queue.module';

const DAL_MODELS = [UserRepository];

const dalService = {
  provide: DalService,
  useFactory: async () => {
    const service = new DalService();
    await service.connect(process.env.DATABASE_URL);
    return service;
  },
};

const redisProvider = {
  provide: RedisProvider,
  useFactory: async () => {
    const service = new RedisProvider();
    await service.connect();
    return service;
  },
};

const PROVIDERS = [dalService, redisProvider, ...DAL_MODELS, RedisRepository];

@Module({
  imports: [MailModule],
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class SharedModule {}
