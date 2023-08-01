import { Module } from '@nestjs/common';
import { Home, HomeSchema } from './home. schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HomesController } from './home.controller';
import { HomeRepository } from './home.repository';
import { HomService } from './home.service';
import { MoviesModule } from '@app/movies/movies.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Home.name, schema: HomeSchema }]),
    MoviesModule,
  ],
  controllers: [HomesController],
  providers: [HomService, HomeRepository],
})
export class HomeModule {}
