import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { ROLE } from 'src/types';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(ROLE)
  role: ROLE;
}
