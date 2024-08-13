import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from '../role/enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  phoneNumber: number;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Role.user })
  role: Role;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Otp' }] })
  otp: Types.ObjectId[];

  @Prop({ default: null })
  accountVerified: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// a pre-hook. when the user is deleted, it deletes the otp of the users (if not expired)
UserSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    const phone = this.phoneNumber;
    await this.model('Otp').deleteMany({ phone });
    next();
  },
);
