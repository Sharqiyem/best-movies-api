import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { TagsRepository } from './tags.repository';
import { Tag, TagSchema } from './tags. schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])],
  controllers: [TagsController],
  providers: [TagsService, TagsRepository],
  exports: [TagsRepository],
})
export class TagsModule {}
