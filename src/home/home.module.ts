import { Module } from '@nestjs/common';
import { HomesController } from './home.controller';
import { HomeService } from './home.service';
import { MoviesModule } from '../movies/movies.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [MoviesModule, TagsModule],
  controllers: [HomesController],
  providers: [HomeService],
})
export class HomeModule {}
