import { Controller, Get, Param } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  //API: get tags by page
  @Get(':page')
  async getAllTags(@Param('page') page: number) {
    const page1 = page || 1;
    console.log('getAllTags page', page1);
    return await this.tagsService.getAllTags(page1);
  }
}
