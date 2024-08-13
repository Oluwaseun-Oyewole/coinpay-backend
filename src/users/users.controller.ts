import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';
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

  @Get(':phoneNumber')
  async userDetails(@Param('phoneNumber') phoneNumber: number) {
    const user: ReturnType<any> =
      await this.userService.findOneByPhoneNumber(phoneNumber);
    const result = {
      phoneNumber: user.phoneNumber,
      id: user._id,
    };
    return result;
  }

  @Patch(':phoneNumber')
  async updateUser(
    @Param('phoneNumber') phoneNumber: number,
    @Body() updateDto: UpdateUserDto,
  ): Promise<User> {
    const user: ReturnType<any> = await this.userService.updateUser(
      phoneNumber,
      updateDto,
    );
    const result = {
      phoneNumber: user.phoneNumber,
      id: user._id,
      password: undefined,
    };
    return result;
  }

  @Delete(':phoneNumber')
  async deleteUser(@Param('phoneNumber') phoneNumber: number) {
    return await this.userService.deleteUser(phoneNumber);
  }
}
