import * as NestConfig from '@nestjs/config';

export const RedisConfig = NestConfig.registerAs('redis', () => ({
  readyLog: true,
  config: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null,
    ttl: process.env.REDIS_TTL || 120
  }
}));
