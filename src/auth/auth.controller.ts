import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('phoneNumber') phoneNumber: number,
    @Body('password') password: string,
  ) {
    return await this.authService.signIn(phoneNumber, password);
  }

  @Get()
  async users() {
    return 'all users';
  }
}
