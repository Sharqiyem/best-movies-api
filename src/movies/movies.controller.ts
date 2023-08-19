import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiTags } from '@nestjs/swagger';
import { FilterDto } from './dtos/filter.dto';
import { Movie } from './movies.schema';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get(':id')
  async getMovie(@Param('id') id: string): Promise<Movie> {
    console.log('getMovie', id);

    return this.moviesService.getMovie(id);
  }

  @Get('/similars/:id')
  async getSimilarMovies(@Param('id') id: string): Promise<Movie[]> {
    console.log('getSimilarMovies', id);
    return this.moviesService.getSimilarMovies(id);
  }

  @HttpCode(200)
  @Post('/search/:page')
  async search(@Param('page') page: number, @Body() query: FilterDto) {
    const page1 = page || 1;
    return await this.moviesService.search(page1, query);
  }

  @Get('/tag/:id/:page')
  async getTagMovies(@Param('id') id: string, @Param('page') page: number) {
    console.log('getTagMovies', id, page);
    return await this.moviesService.getTagMovies(id, page ?? 1);
  }

  @Get('/genre/:genre/:page')
  async getByGener(@Param('genre') genre: string, @Param('page') page: number) {
    console.log('getByGener', genre, page);
    return await this.moviesService.getByGener(page, genre);
  }
}
