import { Injectable } from '@nestjs/common';
import { TagsRepository } from './tags.repository';

@Injectable()
export class TagsService {
  constructor(private tagsRepo: TagsRepository) {}

  async getAllTags(page: number) {
    return await this.tagsRepo.getAllTags(page);
  }
}
