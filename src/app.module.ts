import * as NestCommon from '@nestjs/common';
import * as NestCore from '@nestjs/core';
import * as NestConfig from '@nestjs/config';
import * as NestCache from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import * as NestThrottler from '@nestjs/throttler';
import * as NestMulter from '@nestjs/platform-express/multer';
import * as Multer from 'multer';

import * as Modules from 'src/modules';
import * as Logger from 'common/logger';
import * as Configs from "common/config";
import * as Databases from 'core/shared/database/mongodb/mongodb.module';

@NestCommon.Module({
    imports: [
        NestMulter.MulterModule.register({
            storage: Multer.memoryStorage(),
        }),
        NestConfig.ConfigModule.forRoot({
            load: [
                Configs.MongodbConfig,
                Configs.ServerConfig,
                Configs.AxiosConfig,
                Configs.JwtConfig,
                Configs.SwaggerConfig,
                Configs.MailConfig,
                Configs.RedisConfig
            ],
            cache: true,
        }),
        NestCache.CacheModule.registerAsync({
            isGlobal: true,
            imports: [NestConfig.ConfigModule],
            inject: [NestConfig.ConfigService],
            useFactory: async (configService: NestConfig.ConfigService): Promise<unknown> => ({
                store: redisStore,
                host: 'localhost',
                port: '6379',
            }),
        }),
        Logger.LoggerModule,
        NestThrottler.ThrottlerModule.forRoot({
            ttl: 60,
            limit: 120,
        }),
        Databases.MongodbModule,
        Modules.IndexModule],
    providers: [
        {
            provide: NestCore.APP_GUARD,
            useClass: NestThrottler.ThrottlerGuard,
        },
    ],
})
export class AppModule { }
