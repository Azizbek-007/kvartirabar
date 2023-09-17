import * as Mongoose from 'mongoose';
import * as bcryptjs from 'bcryptjs';

import * as Enums from 'common/enums'
import * as Schemas from "core/schemas";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = Mongoose.HydratedDocument<User>;

@Schema({
    toJSON: {
        transform: (_doc, ret) => {
            delete ret.password;
            return ret;
        },
    },
})
export class User {
    @Prop({
        type: Mongoose.SchemaTypes.String,
        maxlength: 30,
        required: true,
    })
    first_name: string;

    @Prop({
        type: Mongoose.SchemaTypes.String,
        maxlength: 30,
        required: false,
    })
    last_name?: string;

    @Prop({
        type: Mongoose.SchemaTypes.String,
        required: false,
    })
    image?: string;

    @Prop({
        type: Mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    })
    email: string;

    @Prop({
        type: Mongoose.SchemaTypes.String,
        required: true,
    })
    password: string;

    @Prop({
        type: Mongoose.Types.ObjectId,
        ref: Schemas.Role.name,
        required: false,
    })
    role: Schemas.Role;

    @Prop({
        type: Mongoose.SchemaTypes.Boolean,
        default: false
    })
    isActive: boolean;

    @Prop({
        type: Mongoose.SchemaTypes.Boolean,
        default: true
    })
    isOnline: boolean;

    @Prop({
        type: Mongoose.SchemaTypes.Date,
        required: false,
        default: Date.now,
    })
    lastLogin?: Date;

    @Prop({
        type: Mongoose.SchemaTypes.Date,
        required: true,
        default: Date.now,
    })
    createdAt: Date;

    @Prop({
        type: Mongoose.SchemaTypes.Date,
        required: false,
    })
    updatedAt?: Date;

    async saveWithHashedPassword(this: UserDocument) {
        if (this.isModified('password')) {
            const saltRounds = 10;
            const hashedPassword = await bcryptjs.hash(this.password, saltRounds);
            this.password = hashedPassword;
        }
        return this.save();
    }
}


const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcryptjs.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
            }
            bcryptjs.hash(this.password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }
                this.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

export { UserSchema };
