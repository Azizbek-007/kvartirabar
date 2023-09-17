import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    public readonly name: string;

    @IsOptional()
    @IsString()
    public readonly icons?: string;
}
