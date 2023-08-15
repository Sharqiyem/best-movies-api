import { Module } from '@nestjs/common';
// import { PuppeteerModule } from 'nest-puppeteer';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsModule } from './tags/tags.module';
import { HomeModule } from './home/home.module';
import { MoviesModule } from './movies/movies.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('DB_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'bestsimilar',
      }),
      inject: [ConfigService],
    }),

    HomeModule,
    MoviesModule,
    TagsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
