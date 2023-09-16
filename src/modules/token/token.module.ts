import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema } from 'core/schemas';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Token',
                schema: TokenSchema
            }
        ]),
        JwtModule.register({
            global: true,
            secret: 'sdsd',
            signOptions: { expiresIn: '2d' },
        }),
    ],
    providers: [TokenService],
    exports: [TokenService]
})
export class TokenModule { }
