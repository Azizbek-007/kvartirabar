import * as NestCommon from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';
import { RoleModule } from './role/role.module';
import { UploadModule } from './upload/upload.module';
import { MailModule } from './mail/mail.module';

@NestCommon.Module({
    imports: [
        UserModule,
        AuthModule,
        RoleModule,
        TokenModule,
        UploadModule,
        MailModule
    ],
    controllers: [],
    providers: [],
})
export class IndexModule { }
