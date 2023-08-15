import { Injectable } from '@nestjs/common';
import { Home, HomeDocument } from './home. schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { MoviesRepository } from '../movies/movies.repository';

@Injectable()
export class HomeRepository {
  homeData = null;

  constructor(
    private configService: ConfigService,
    @InjectModel(Home.name) private homeModel: Model<HomeDocument>,
    private moviesRepo: MoviesRepository,
  ) {}

  async generateMLData() {
    const data = await this.moviesRepo.generateMLData();
    return data;
  }
  async getHome() {
    if (this.homeData) return this.homeData;

    const sections = [];
    // get populate movies
    let list: any;

    list = await this.moviesRepo.getPopularMovies(1);
    sections.push({
      title: 'Popular Movies',
      data: [{ list }],
    });

    // get populate tv-shows
    list = await this.moviesRepo.getPopularTVShows(1);
    sections.push({
      title: 'Popular TV-Shows',
      data: [{ list }],
    });

    // get populate style
    list = await this.moviesRepo.getPopularStyles();
    sections.push({
      title: 'Popular Styles',
      data: [{ list }],
    });

    // get populate plot
    list = await this.moviesRepo.getPopularPlots();
    sections.push({
      title: 'Popular Plots',
      data: [{ list }],
    });

    // get populate time
    list = await this.moviesRepo.getPopularTimes();
    sections.push({
      title: 'Popular Times',
      data: [{ list }],
    });

    // get populate place
    list = await this.moviesRepo.getPopularPlaces();
    sections.push({
      title: 'Popular Places',
      data: [{ list }],
    });

    // console.log('sections', JSON.stringify(sections, null, 2));
    return sections;
  }

  async getPopularMovies(page: number) {
    return this.moviesRepo.getPopularMovies(page);
  }

  async getPopularTvShows(page: number) {
    return this.moviesRepo.getPopularTVShows(page);
  }

  async getPopularTags(tag: string, page: number) {
    switch (tag) {
      case 'style':
        return this.moviesRepo.getPopularStyles(page);
      case 'plot':
        return this.moviesRepo.getPopularPlots(page);

      case 'time':
        return this.moviesRepo.getPopularTimes(page);

      case 'place':
        return this.moviesRepo.getPopularPlaces(page);

      default:
        break;
    }
  }
}
