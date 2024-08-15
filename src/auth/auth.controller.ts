import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

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
  async resetPassword(@Body('phoneNumber') phoneNumber: number) {
    return await this.authService.forgotPassword(phoneNumber);
  }
}
