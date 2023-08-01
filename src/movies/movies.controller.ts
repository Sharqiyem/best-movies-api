import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiTags } from '@nestjs/swagger';
import { MoviesRepository } from './movies.repository';
import { FilterDto } from './filter.dto';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(
    private moviesService: MoviesService,
    private moviesRepo: MoviesRepository,
  ) {}

  @Get()
  async getAllMovies() {
    return await this.moviesService.getAllMovies();
  }

  @Get('/fixg')
  async fixGenres() {
    return await this.moviesRepo.fixGenres();
  }

  @Get('/scrapeall/:starterPage')
  async scrapeAllMovies(@Param('starterPage') starterPage: number) {
    return await this.moviesRepo.scrapeAllMovies(starterPage);
  }

  @Post('/search/:page')
  async search(@Param('page') page: number, @Body() query: FilterDto) {
    const page1 = page || 1;
    return await this.moviesRepo.search(page1, query);
  }

  @Get('/similars/:id')
  async getSimilarMovies(@Param('id') id: string) {
    console.log('getSimilarMovies', id);
    return await this.moviesService.getSimilarMovies(id);
  }

  @Get('/tag/:id/:page')
  async getTagMovies(@Param('id') id: string, @Param('page') page: number) {
    console.log('getTagMovies', id, page);
    return await this.moviesService.getTagMovies(id, page ?? 1);
  }

  @Get(':id')
  async getMovie(@Param('id') id: string) {
    console.log('getMovie', id);
    return await this.moviesService.getMovie(id);
  }

  @Get('/genre/:genre')
  async getByGener(@Param('genre') genre: string) {
    console.log('getByGener', genre);
    return await this.moviesService.getByGener(genre);
  }
}
