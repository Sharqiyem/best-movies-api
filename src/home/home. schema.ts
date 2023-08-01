import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HomeDocument = Home & Document;

@Schema()
export class Home {}

export const HomeSchema = SchemaFactory.createForClass(Home);
