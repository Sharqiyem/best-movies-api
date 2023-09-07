import { Controller, Get, Param } from '@nestjs/common';
import { HomeService } from './home.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Home')
@Controller('home')
export class HomesController {
  constructor(private readonly homeService: HomeService) {}

  @Get('/check')
  async check() {
    console.log('check api health');
    return 'OK';
  }

  @Get()
  async getAllHomes() {
    console.log('getAllHomes');
    return await this.homeService.getHome();
  }

  // @Get('/popularity')
  // async popularity() {
  //   console.log('popularity');
  //   return await this.homeService.popularity();
  // }

  @Get('/list/:type/:page')
  async getPopularByType(
    @Param('page') page: number,
    @Param('type') type: string,
  ) {
    console.log('get list', type, page);
    switch (type) {
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
