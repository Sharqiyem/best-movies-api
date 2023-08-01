import { Controller, Get, Param } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ApiTags } from '@nestjs/swagger';
import { TagsRepository } from './tags.repository';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(
    private tagsService: TagsService,
    private tagsRepo: TagsRepository,
  ) {}

  // @Get('scrape')
  // async scrapeTags() {
  //   return await this.tagsService.scrapeTags();
  // }

  //API: get tags by page
  @Get(':page')
  async getAllTags(@Param('page') page: number) {
    const page1 = page || 1;
    console.log('getAllTags page', page1);
    return await this.tagsService.getAllTags(page1);
  }

  // Scarpe all tag's pages
  @Get()
  async scrapeMissingTagsImag() {
    // return await this.tagsRepo.scrapeTagsImage();
  }

  // @Get('/:tagId/all')
  // async getTagPages(@Param('tagId') tagId: string) {
  //   return await this.tagsService.getTagPages(tagId);
  // }
}
