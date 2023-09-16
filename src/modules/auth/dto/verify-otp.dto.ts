import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyOtpDto {
    @IsEmail()
    public readonly email: string;

    @IsNotEmpty()
    @IsString()
    @Length(4, 4)
    public readonly otp: string;
}
