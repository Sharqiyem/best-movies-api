import { Controller, Get, Param } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get(':page')
  async getAllTags(@Param('page') page: number) {
    const page1 = page || 1;
    return await this.tagsService.getAllTags(page1);
  }

  @Get('scrape')
  async scrapeTags() {
    return await this.tagsService.scrapeTags();
  }
}
