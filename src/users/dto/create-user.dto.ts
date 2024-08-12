import { IsNumber, IsString, Matches, MinLength } from 'class-validator';

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
}
