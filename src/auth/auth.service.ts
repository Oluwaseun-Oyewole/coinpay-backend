import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(phone: number, password: string): Promise<any> {
    const currentUser: ReturnType<any> =
      await this.userService.findOneByPhoneNumber(phone);
    if (
      currentUser.password !== bcrypt.compare(password, currentUser.password)
    ) {
      throw new UnauthorizedException();
    }
    const { phoneNumber, ...result } = currentUser;
    console.log(phoneNumber);
    return result;
  }

  async signIn(
    phoneNumber: number,
    pass: string,
  ): Promise<{ access_token: string }> {
    const currentUser: ReturnType<any> =
      await this.userService.findOneByPhoneNumber(phoneNumber);
    if (currentUser && (await bcrypt.compare(pass, currentUser.password))) {
      const payload = {
        sub: currentUser._id,
        phoneNumber: currentUser.password,
      };
      return { access_token: await this.jwtService.signAsync(payload) };
    }
    throw new UnauthorizedException();
  }
}
