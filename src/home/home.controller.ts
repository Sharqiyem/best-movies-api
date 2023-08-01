import { Controller, Get, Param } from '@nestjs/common';
import { HomService } from './home.service';

@Controller('home')
export class HomesController {
  constructor(private homeService: HomService) {}

  @Get()
  async getAllHomes() {
    console.log('getAllHomes');
    return await this.homeService.getHome();
  }

  @Get('/list/:listId/:page')
  async getPopularMovies(
    @Param('page') page: number,
    @Param('listId') listId: string,
  ) {
    console.log('get list', listId, page);
    switch (listId) {
      case 'movies':
        return await this.homeService.getPopularMovies(page);
      case 'tvshows':
        return await this.homeService.getPopularTvShows(page);
    }
  }

  @Get('/popularstags/:tag/:page')
  async getPopularTags(@Param('tag') tag: string, @Param('page') page: number) {
    console.log('getPopularTags', tag);
    return await this.homeService.getPopularTags(tag, page);
  }

  @Get('/generatemldata')
  async generateMLData() {
    console.log('generatemldata');
    return this.homeService.generateMLData();
  }
}
