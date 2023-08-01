import { Injectable } from '@nestjs/common';
import { HomeRepository } from './home.repository';

@Injectable()
export class HomService {
  constructor(private homeRepo: HomeRepository) {}

  async getHome() {
    return await this.homeRepo.getHome();
  }

  async getPopularMovies(page: number) {
    return await this.homeRepo.getPopularMovies(page);
  }

  async getPopularTvShows(page: number) {
    return await this.homeRepo.getPopularTvShows(page);
  }

  async getPopularTags(tag: string, page: number) {
    return await this.homeRepo.getPopularTags(tag, page);
  }

  async generateMLData() {
    return this.homeRepo.generateMLData();
  }
}
