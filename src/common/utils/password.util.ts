import { compare, hash } from "bcryptjs";
const BcryptSaltRounds = 10;

export async function hashPassword(password: string): Promise<string> {
    return await hash(password, BcryptSaltRounds);
}

export async function comparePasswords(userPassword: string, currentPassword: string): Promise<boolean> {
    return await compare(userPassword, currentPassword);
}
