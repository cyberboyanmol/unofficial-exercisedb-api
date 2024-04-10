import Redis from 'ioredis';
import { convertStringValues } from './variable-mappers';
import { ConnectionOptions } from 'tls';
import { IRedisConfig, IRedisProviderConfig } from './redis.interface';
import { Logger } from '@nestjs/common';

export const CLIENT_READY = 'ready';
const DEFAULT_TTL_SECONDS = 0;
const DEFAULT_CONNECT_TIMEOUT = 50000;
const DEFAULT_HOST = 'localhost';
const DEFAULT_KEEP_ALIVE = 30000;
const DEFAULT_KEY_PREFIX = '';
const DEFAULT_FAMILY = 4;
const DEFAULT_PORT = 6379;

export class RedisProvider {
  private client: Redis | undefined;
  private readonly logger = new Logger(RedisProvider.name);

  async connect() {
    const { port, host, ...configOptions } = this.getRedisProviderConfig();
    const options = {
      ...configOptions,
      maxRetriesPerRequest: null,

      tls: {
        rejectUnauthorized: true,
      } /*
      //  *  Disabled in Prod as affects performance
      //  */,
      showFriendlyErrorStack: process.env.NODE_ENV !== 'production',
    };

    if (port && host) {
      this.client = new Redis(port, host, options);
      this.client.on('connect', () => {
        this.logger.debug(
          `Connecting to redis "${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}"...`,
        );
      });

      this.client.on('ready', () => {
        this.logger.debug('Connected to redis!');
      });

      this.client.on('error', (err: Error) => {
        this.logger.error({
          message: 'Error with redis client',
          errorMessage: err.message,
          errorStack: err.stack,
          errorName: err.name,
        });
      });

      this.client.on('close', () => {
        this.logger.debug('[Redis]:closed');
      });

      this.client.on('reconnecting', (time: number) => {
        this.logger.debug(`[Redis]:reconnecting - ${time}ms`);
      });

      this.client.on('end', () => {
        this.logger.debug('[Redis]:end');
      });

      this.client.on('wait', () => {
        this.logger.debug('[Redis]:wait');
      });
    }
  }

  getClient(): Redis {
    if (!this.client) {
      throw new Error('Redis client not connected');
    }
    return this.client;
  }

  getRedisProviderConfig(): IRedisProviderConfig {
    const redisConfig: IRedisConfig = {
      db: convertStringValues(process.env.REDIS_DB_INDEX),
      host: convertStringValues(process.env.REDIS_HOST),
      port: convertStringValues(process.env.REDIS_PORT),
      ttl: convertStringValues(process.env.REDIS_TTL),
      password: convertStringValues(process.env.REDIS_PASSWORD),
      connectTimeout: convertStringValues(process.env.REDIS_CONNECT_TIMEOUT),
      keepAlive: convertStringValues(process.env.REDIS_KEEP_ALIVE),
      family: convertStringValues(process.env.REDIS_FAMILY),
      keyPrefix: convertStringValues(process.env.REDIS_PREFIX),
      tls: process.env.REDIS_TLS as ConnectionOptions,
    };

    const db = redisConfig.db ? Number(redisConfig.db) : 0;
    const port = redisConfig.port ? Number(redisConfig.port) : DEFAULT_PORT;
    const host = redisConfig.host || DEFAULT_HOST;
    const password = redisConfig.password;
    const connectTimeout = redisConfig.connectTimeout
      ? Number(redisConfig.connectTimeout)
      : DEFAULT_CONNECT_TIMEOUT;
    const family = redisConfig.family
      ? Number(redisConfig.family)
      : DEFAULT_FAMILY;
    const keepAlive = redisConfig.keepAlive
      ? Number(redisConfig.keepAlive)
      : DEFAULT_KEEP_ALIVE;
    const keyPrefix = redisConfig.keyPrefix ?? DEFAULT_KEY_PREFIX;
    const ttl = redisConfig.ttl ? Number(redisConfig.ttl) : DEFAULT_TTL_SECONDS;
    const tls = redisConfig.tls;

    return {
      db,
      host,
      port,
      password,
      connectTimeout,
      family,
      keepAlive,
      keyPrefix,
      ttl,
      tls,
    };
  }
  public async shutdown(): Promise<void> {
    if (this.client) {
      try {
        this.client.removeAllListeners();
        await this.client.quit();
        this.logger.verbose(`Redis provider service shutdown`);
      } catch (error) {
        this.logger.warn(
          `In-memory provider service shutdown has failed`,
          error,
        );
      }
    }
  }

  public async onApplicationShutdown() {
    await this.shutdown();
  }
}
