import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsEmail()
    public readonly email: string;

    @IsNotEmpty()
    public readonly password: string;
}
