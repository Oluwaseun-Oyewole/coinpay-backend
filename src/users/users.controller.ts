import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  async registration(
    @Body('phoneNumber') phoneNumber: number,
    @Body('password') password: string,
  ) {
    const hashed_password = await this.userService.hashedPassword(password);
    const test: ReturnType<any> = await this.userService.userRegistration({
      phoneNumber,
      password: hashed_password,
    });
    const result = {
      phoneNumber: test.phoneNumber,
      password: undefined,
      id: test._id,
    };
    return result;
  }
}
