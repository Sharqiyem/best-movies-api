import { Module } from '@nestjs/common';
// import { PuppeteerModule } from 'nest-puppeteer';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsModule } from '@app/tags/tags.module';
import { HomeModule } from './home/home.module';
import { MoviesModule } from './movies/movies.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // PuppeteerModule.forRoot(),
    // MongooseModule.forRoot('mongodb://root:rootpassword@localhost:27018', {
    //   dbName: 'bestsimilar',
    // }),
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
