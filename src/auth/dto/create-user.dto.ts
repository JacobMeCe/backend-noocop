import { IsArray, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ValidRoles } from "src/auth/interfaces";

export class CreateUserDto {

    @IsString()
    @MinLength(5)
    nombre: string;

    @IsString()
    @MinLength(4)
    username: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsArray()
    @IsOptional()
    @IsEnum(ValidRoles, { each: true })
    roles?: string[];
}