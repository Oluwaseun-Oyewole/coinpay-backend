import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Twilio } from 'twilio';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Otp } from './schema/otp.schema';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('user') public userModel: Model<UserDocument>,
    @InjectModel('otp') private otpModel: Model<Otp>,
    private configService: ConfigService,
    private readonly twilioClient: Twilio,
  ) {
    const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async generateOtp(phone: number): Promise<Otp> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const newOtp = await new this.otpModel({ otp, phone });
    return newOtp.save();
  }

  async userRegistration(userDto: CreateUserDto): Promise<User> {
    const { otp } = await this.generateOtp(userDto.phoneNumber);
    const user = new this.userModel({
      phoneNumber: userDto.phoneNumber,
      password: userDto.password,
      role: userDto.role,
      otp,
    });
    return user.save();
  }

  async findOneByPhoneNumber(phoneNumber: number): Promise<User | undefined> {
    const user = await this.userModel.findOne({ phoneNumber }).exec();
    if (!user) {
      throw new NotFoundException(`User with ${phoneNumber} does not exist`);
    }
    return user;
  }

  async hashedPassword(password: string): Promise<string> {
    const saltRound = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, saltRound);
    return hashed;
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async deleteUser(phoneNumber: number): Promise<User> {
    const user = await this.userModel.findOneAndDelete({ phoneNumber }).exec();
    if (!user) {
      throw new NotFoundException(`User with ${phoneNumber} does not exist`);
    }
    return user;
  }

  async updateUser(
    phoneNumber: number,
    updateDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.userModel
      .findOneAndUpdate({ phoneNumber }, updateDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ${phoneNumber} does not exist`);
    }
    return updatedUser;
  }

  async sendOTP(phoneNumber: number, otp: number) {
    return await this.twilioClient.messages.create({
      body: `Your verification code is ${otp}`,
      to: `+234${phoneNumber}`,
      from: this.configService.get<string>('TWILIO_SENDER_PHONE_NUMBER'),
    });
  }

  async sendResetLink(phoneNumber: number, code: string) {
    return await this.twilioClient.messages.create({
      body: `Your password reset link is  ${code}`,
      to: `+234${phoneNumber}`,
      from: this.configService.get<string>('TWILIO_SENDER_PHONE_NUMBER'),
    });
  }

  async verifyOTP(phoneNumber: number, otpCode: any) {
    const user = await this.findOneByPhoneNumber(phoneNumber);
    const otp = user.otp.find((otp) => otp === otpCode);
    if (otp) {
      const getOtpFromModel = await this.otpModel.findOne({
        phone: phoneNumber,
        otp: otpCode,
      });
      const { createdAt, expiredAt } = getOtpFromModel;
      if (createdAt < expiredAt) {
        await this.userModel
          .findOneAndUpdate(
            { phoneNumber, otp: otpCode },
            { accountVerified: Date.now(), otp: [] },
            {
              new: true,
            },
          )
          .exec();
        await this.otpModel.deleteOne({ otp: otpCode });
      }
      return;
    }
    return;
  }

  async resendOtp(phone: number) {
    const user = await this.findOneByPhoneNumber(phone);
    const { otp } = await this.generateOtp(phone);
    await this.userModel.findOneAndUpdate(
      { phoneNumber: phone },
      { otp: [...user.otp, otp] },
      { new: true },
    );
    return await this.sendOTP(phone, otp);
  }
}
