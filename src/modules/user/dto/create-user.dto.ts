import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    public readonly first_name: string;

    @IsOptional()
    @IsString()
    public readonly last_name?: string;
    
    @IsNotEmpty()
    @IsEmail()
    public readonly email: string;

    @IsNotEmpty()
    @IsString()
    @Length(4, 16)
    public readonly password: string;
}
