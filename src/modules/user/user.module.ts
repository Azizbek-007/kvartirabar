import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema, UserSchema } from 'core/schemas';
import { UserRepository } from './user.repository';
import { MailModule } from 'modules/mail/mail.module';

@Module({
    imports: [MongooseModule.forFeature([
        {
            name: 'User',
            schema: UserSchema
        },
        {
            name: 'Role',
            schema: RoleSchema
        }
    ])],
    controllers: [UserController],
    providers: [UserRepository, UserService],
    exports: [UserService]
})
export class UserModule { }
