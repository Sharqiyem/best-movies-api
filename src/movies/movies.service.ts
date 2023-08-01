import { Injectable } from '@nestjs/common';
import { MoviesRepository } from './movies.repository';

@Injectable()
export class MoviesService {
  constructor(private moviesRepo: MoviesRepository) {}

  async getMovie(id: string) {
    return await this.moviesRepo.getMovie(id);
  }

  async getSimilarMovies(id: string) {
    return await this.moviesRepo.getSimilarMovies(id);
  }

  async getTagMovies(id: string, page: number) {
    return await this.moviesRepo.getTagMovies(id, page);
  }

  async getAllMovies() {
    return await this.moviesRepo.getAllMovies();
  }

  async getByGener(genre) {
    console.log('getByGener', genre);
    return await this.moviesRepo.getByGener(genre);
  }
}
