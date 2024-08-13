import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('jwt'))
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
}
