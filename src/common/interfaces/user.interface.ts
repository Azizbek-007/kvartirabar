import { Role } from 'core/schemas';
import { Document } from 'mongoose';

export interface IUser extends Document  {
    readonly first_name: string;
    readonly last_name?: string;
    readonly image: string;
    readonly email: string;
    readonly password: string;
    readonly role: Role;
    readonly createdAt: Date;
    readonly updatedAt?: Date;
}

