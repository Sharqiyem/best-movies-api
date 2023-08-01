import { Injectable } from '@nestjs/common';
import { TagsRepository } from './tags.repository';

@Injectable()
export class TagsService {
  constructor(private tagsRepo: TagsRepository) {}

  async getAllTags(page: number) {
    return await this.tagsRepo.getAllTags(page);
  }

  async scrapeTags() {
    // return await this.tagsRepo.scrapeTagsOld();
  }

  // async scrapeAllTagsPages() {
  //   return await this.tagsRepo.scrapeAllTagsPages();
  // }

  // async getTagPages(tagId) {
  //   return await this.tagsRepo.scrapeTagAllPages(tagId);
  // }
}
