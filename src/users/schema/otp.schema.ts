import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<Otp>;

@Schema()
export class Otp extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  phone: number;

  @Prop()
  otp: number;

  @Prop({ default: Date.now(), required: true, type: Date })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now() + 60 * 60 * 1000 })
  expiredAt: Date;
}

export const OTPSchema = SchemaFactory.createForClass(Otp);
