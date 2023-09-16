import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "core/schemas";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserRepository {
    constructor(@InjectModel('User') private userModel: Model<UserDocument>) { }

    public async findAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    }

    public async getById(_id: string) {
        return await this.userModel.findById(_id).exec();
    }

    public async getByEmail(email: string) {
        return await this.userModel.findOne({ email: email }).exec();
    }

    public async create(createUserDto: CreateUserDto) {
        const createdUser = new this.userModel(createUserDto);
        return await createdUser.save();
    }

    public async update(id: string, user: User) {
        return await this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
    }

    public async setUserVerifiedByEmail(email: string) {
        try {
            const updatedUser = await this.userModel.findOneAndUpdate(
                { email: email },
                { $set: { isActive: true } },
                { new: true }
            ).exec();
            return updatedUser;
        } catch (error) {
            console.error(error);
        }
    }
}
