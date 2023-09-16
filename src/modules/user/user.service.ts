import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from 'core/schemas';
import { CreateUserDto } from './dto/create-user.dto';
import { MailService } from 'modules/mail/mail.service';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository
    ) {}

    public getByEmail (email: string): Promise<import("mongoose").Document<unknown, any, User> & Omit<User & { _id: import("mongoose").Types.ObjectId; }, never> & Required<{ _id: import("mongoose").Types.ObjectId; }>>{
        return this.userRepository.getByEmail(email);
    }

    public async getById (_id: string) {
        return await this.userRepository.getById(_id);
    }

    public async findAll (): Promise<User[]> {
        return await this.userRepository.findAll();
    }

    public async create(createUserDto: CreateUserDto) {
        return await this.userRepository.create(createUserDto);
    }

    public async setUserVerifiedByEmail (email: string) {
        return await this.userRepository.setUserVerifiedByEmail(email)
    }
}
