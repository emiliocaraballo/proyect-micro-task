import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class AuthEvent extends Document {
  @Prop()
  type: string;

  @Prop({ type: Object })
  payload: Record<string, any>;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const AuthEventSchema = SchemaFactory.createForClass(AuthEvent);
