import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
}
