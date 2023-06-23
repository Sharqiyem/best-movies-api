import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagsModule } from '@app/tags/tags.module';

@Module({
  imports: [
    PuppeteerModule.forRoot(),
    MongooseModule.forRoot('mongodb://root:rootpassword@localhost:27018', {
      dbName: 'bestsimilar',
    }),
    TagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
