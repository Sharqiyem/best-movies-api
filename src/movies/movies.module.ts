import { Module } from '@nestjs/common';
import { Movie, MovieSchema } from './movies.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesController } from './movies.controller';
import { MoviesRepository } from './movies.repository';
import { MoviesService } from './movies.service';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    TagsModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService, MoviesRepository],
  exports: [MoviesRepository],
})
export class MoviesModule {}
