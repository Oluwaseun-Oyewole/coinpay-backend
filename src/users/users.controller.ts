import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from './decorator/roles.decorators';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './role/enum';
import { User } from './schema/user.schema';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Roles(Role.admin)
  async users() {
    return await this.userService.findAllUsers();
  }

  @Post('register')
  async registration(
    @Body('phoneNumber') phoneNumber: number,
    @Body('password') password: string,
  ) {
    const hashed_password = await this.userService.hashedPassword(password);
    const user: ReturnType<any> = await this.userService.userRegistration({
      phoneNumber,
      password: hashed_password,
      role: Role.user,
    });
    const result = {
      phoneNumber: user.phoneNumber,
      password: undefined,
      id: user._id,
      role: user.role,
      otp: user.otp,
      message: 'Account successfully crated',
    };
    await this.userService.sendOTP(phoneNumber, user?.otp);
    return result;
  }

  @Post('resendOtp')
  async resendOTP(@Body('phone') phone: number) {
    await this.userService.resendOtp(phone);
  }

  @Post('verifyOtp')
  async verifyOTP(
    @Body('phoneNumber') phoneNumber: number,
    @Body('otpCode') otpCode: number,
  ) {
    return await this.userService.verifyOTP(phoneNumber, otpCode);
  }
  @Get(':phoneNumber')
  async userDetails(@Param('phoneNumber') phoneNumber: number) {
    const user: ReturnType<any> =
      await this.userService.findOneByPhoneNumber(phoneNumber);
    const result = {
      phoneNumber: user.phoneNumber,
      id: user._id,
      otp: '',
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
      role: user.role,
      otp: user.otp,
      accountVerified: user.accountVerified,
    };
    return result;
  }

  @Delete(':phoneNumber')
  async deleteUser(@Param('phoneNumber') phoneNumber: number) {
    return await this.userService.deleteUser(phoneNumber);
  }
}
