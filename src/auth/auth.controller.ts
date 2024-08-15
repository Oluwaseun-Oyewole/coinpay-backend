import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResetPasswordUserDto } from './dto/reset-password';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Post('login')
  async login(
    @Body('phoneNumber') phoneNumber: number,
    @Body('password') password: string,
  ) {
    return await this.authService.signIn(phoneNumber, password);
  }

  // @UseGuards(AuthGuard)
  @Get('user')
  async users() {
    return 'all users';
  }

  @Post('forgot-password')
  async forgotPassword(@Body('phoneNumber') phoneNumber: number) {
    return await this.authService.forgotPassword(phoneNumber);
  }
  @Post('reset-password')
  async resetPassword(
    @Body('phoneNumber') phoneNumber: number,
    @Body('password') password: ResetPasswordUserDto,
  ) {
    return await this.authService.passwordReset(phoneNumber, password);
  }
}
