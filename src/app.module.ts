import { Module } from '@nestjs/common';
// import { PuppeteerModule } from 'nest-puppeteer';
import { TagsModule } from './tags/tags.module';
import { HomeModule } from './home/home.module';
import { MoviesModule } from './movies/movies.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,

    HomeModule,
    MoviesModule,
    TagsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
