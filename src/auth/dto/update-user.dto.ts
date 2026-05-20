import { IsEmail, IsString, Matches, MaxLength, MinLength,IsBoolean, IsIn, IsOptional } from "class-validator";


export class UpdateUserDto {
    @IsString()
    @IsEmail()
    @IsOptional()
    email?: string;


    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @IsOptional()
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password?: string;

    @IsString()
    @MinLength(3)
    @IsOptional()
    @Matches(
        /\w+\W+\w+/, {
        message: 'The full name must have at least 2 words separated by a space'
    })
    fullName?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsIn(['user','admin','super-user'])
    @IsOptional()
    roles?: string[];
}
