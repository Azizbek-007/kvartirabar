import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { MailConfig } from 'common/config';

@Module({
    imports: [ 
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => {
                const mailConfig = config.get<ConfigType<typeof MailConfig>>('mail');
                return {
                    transport: mailConfig.transport,
                    defaults: mailConfig.defaults,
                };
            },
            inject: [ConfigService],
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
