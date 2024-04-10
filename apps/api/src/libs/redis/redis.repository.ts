import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisRepositoryInterface } from './redis.interface';
import { RedisProvider } from './redis.service';

@Injectable()
export class RedisRepository
  implements OnModuleDestroy, RedisRepositoryInterface
{
  redisClient: Redis;
  constructor(private readonly redisProvider: RedisProvider) {
    this.redisClient = this.redisProvider.getClient();
  }
  async onModuleDestroy() {
    await this.redisClient.disconnect();
  }

  async get(prefix: string, key: string): Promise<string | null> {
    return this.redisClient.get(`${prefix}:${key}`);
  }

  async set(prefix: string, key: string, value: string): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value);
  }

  async delete(prefix: string, key: string): Promise<void> {
    await this.redisClient.del(`${prefix}:${key}`);
  }
  async deleteAll(prefix: string, pattern: string): Promise<void> {
    const client = this.redisClient;
    const keys = await client.keys(`${prefix}:${pattern}`);
    for (const key of keys) {
      await client.del(key);
    }
  }
  // async deleteAll(prefix: string, pattern: string): Promise<void> {
  //   const client = this.redisClient;

  //   let cursor = '0';

  //   while (cursor !== '0') {
  //     const [nextCursor, results] = await client.scan(
  //       cursor,
  //       'MATCH',
  //       `${prefix}:${pattern}`,
  //     );
  //     cursor = nextCursor;

  //     for (const key of results) {
  //       await client.del(key);
  //       console.log(`deleted ${key}`);
  //     }
  //   }
  // }

  async setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
  }
}
