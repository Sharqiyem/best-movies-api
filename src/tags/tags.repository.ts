import { ConfigService } from '@nestjs/config';

import { Injectable } from '@nestjs/common';
import { Tag, TagDocument } from './tags. schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TagsRepository {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
    private configService: ConfigService,
  ) {}

  async getAll() {
    return this.tagModel.find().sort({ title: 1 }).exec();
  }

  async getAllTags(page: number) {
    console.log('page', page);
    const limit = 100;
    const skip = (page - 1) * limit;
    const total = await this.tagModel.countDocuments({}).exec();
    const page_total = Math.floor((total - 1) / limit) + 1;
    const data = await this.tagModel.find().limit(limit).skip(skip).exec();
    return {
      data: data,
      total,
      page_total: page_total,
      page,
    };
  }

  async getTagsByNames(tags: string[]) {
    // console.log('tags', tags);
    return await this.tagModel.find({ title: { $in: tags } });
  }
}
