import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'modules/user/user.service';
import { UserModule } from 'modules/user/user.module';
import { MailService } from 'modules/mail/mail.service';
import { TokenService } from 'modules/token/token.service';
import { TokenModule } from 'modules/token/token.module';
import { RefreshTokenStrategy } from 'common/strategies/refreshToken.strategy';
import { AccessTokenStrategy } from 'common/strategies/accessToken.strategy';

@Module({
    imports: [UserModule, TokenModule],
    controllers: [AuthController],
    providers: [AuthService, MailService, RefreshTokenStrategy, AccessTokenStrategy]
})
export class AuthModule { }
