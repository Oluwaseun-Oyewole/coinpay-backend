import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from '../role/enum';

export class CreateUserDto {
  @IsNumber()
  phoneNumber: number;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password must contain uppercase, lowercase, number and special character',
  })
  password: string;

  @IsEnum(Role, { message: 'Role must be selected' })
  @IsOptional()
  role: Role;
}
