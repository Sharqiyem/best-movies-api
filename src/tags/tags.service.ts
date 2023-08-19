import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagDocument } from './tags.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { MoviesService } from '../movies/movies.service';

const HOME_LIST_MAX = 10;

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
    private configService: ConfigService,
    private movieService: MoviesService,
  ) {}

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

  async getPopularStyles(page = 1, limit: number = HOME_LIST_MAX) {
    return await this.getTagsWithPages('style', page, limit);
  }

  //TODO: refactoring pagination by using mongoosePaginate
  async getTagsWithPages(
    tagName: string,
    page = 1,
    limit: number = HOME_LIST_MAX,
  ) {
    const tagsAggregateByStyle = await this.movieService.getAggregateBy(
      tagName,
      limit,
      page,
    );

    console.log('page: ', page, tagName);
    const tagsNames: string[] = tagsAggregateByStyle.data.map((s) => s._id);
    const res = await this.getTagsByNames(tagsNames);

    return {
      ...tagsAggregateByStyle,
      data: res,
    };
  }

  async getPopularPlots(page = 1, limit: number = HOME_LIST_MAX) {
    return this.getTagsWithPages('plot', page, limit);
  }

  async getPopularTimes(page = 1, limit: number = HOME_LIST_MAX) {
    return this.getTagsWithPages('time', page, limit);
  }

  async getPopularPlaces(page = 1, limit: number = HOME_LIST_MAX) {
    return this.getTagsWithPages('place', page, limit);
  }
}
