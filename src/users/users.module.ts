import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Twilio } from 'twilio';
import { OTPSchema } from './schema/otp.schema';
import { UserSchema } from './schema/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'otp', schema: OTPSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, Twilio],
  exports: [UsersService],
})
export class UsersModule {}
