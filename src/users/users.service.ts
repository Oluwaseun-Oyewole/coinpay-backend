import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private userModel: Model<UserDocument>) {}

  async userRegistration(userDto: CreateUserDto): Promise<User> {
    const user = new this.userModel({
      phoneNumber: userDto.phoneNumber,
      password: userDto.password,
    });
    return user.save();
  }

  async findOneByPhoneNumber(phoneNumber: number): Promise<User | undefined> {
    return this.userModel.findOne({ phoneNumber }).exec();
  }

  async hashedPassword(password: string): Promise<string> {
    const saltRound = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, saltRound);
    return hashed;
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }
}
