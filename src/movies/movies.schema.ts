import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @Prop()
  title: string;

  @Prop()
  link: string;

  @Prop()
  year: number;

  @Prop()
  movieId: string;

  @Prop()
  img: string;

  @Prop()
  video: string;

  @Prop()
  rating?: number;

  @Prop()
  votes: string;

  @Prop()
  isTVShow: boolean;

  @Prop()
  genre: string[];

  @Prop()
  duration: string;

  @Prop()
  audience: string[];

  @Prop()
  time: string[];

  @Prop()
  story: string;

  @Prop()
  country: string[];

  @Prop()
  keyword: string;

  @Prop()
  place: string[];

  @Prop()
  plot: string[];

  @Prop()
  style: string[];

  @Prop()
  sim: string[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

MovieSchema.plugin(mongoosePaginate);
