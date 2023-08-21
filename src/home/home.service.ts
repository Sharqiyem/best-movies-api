import { Injectable } from '@nestjs/common';
import { MoviesService } from '../movies/movies.service';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class HomeService {
  homeData = null;

  constructor(
    private moviesService: MoviesService,
    private tagsService: TagsService,
  ) {}

  async generateMLData() {
    const data = await this.moviesService.generateMLData();
    return data;
  }
  async getHome() {
    if (this.homeData) return this.homeData;

    const sections = [];
    // get populate movies
    let list: any;

    list = await this.moviesService.getPopularMovies(1);
    sections.push({
      title: 'Popular Movies',
      data: [{ list }],
    });

    // get populate tv-shows
    list = await this.moviesService.getPopularTVShows(1);
    sections.push({
      title: 'Popular TV-Shows',
      data: [{ list }],
    });

    // get populate style
    list = await this.tagsService.getPopularStyles();
    sections.push({
      title: 'Popular Styles',
      data: [{ list }],
    });

    // get populate plot
    list = await this.tagsService.getPopularPlots();
    sections.push({
      title: 'Popular Plots',
      data: [{ list }],
    });

    // get populate time
    list = await this.tagsService.getPopularTimes();
    sections.push({
      title: 'Popular Times',
      data: [{ list }],
    });

    // get populate place
    list = await this.tagsService.getPopularPlaces();
    sections.push({
      title: 'Popular Places',
      data: [{ list }],
    });

    //cashing home data
    this.homeData = sections;
    // console.log('sections', JSON.stringify(sections, null, 2));
    return sections;
  }

  async getPopularMovies(page: number) {
    return this.moviesService.getPopularMovies(page);
  }

  async getPopularTvShows(page: number) {
    return this.moviesService.getPopularTVShows(page);
  }

  async getPopularTags(tag: string, page: number) {
    switch (tag) {
      case 'style':
        return this.tagsService.getPopularStyles(page);
      case 'plot':
        return this.tagsService.getPopularPlots(page);

      case 'time':
        return this.tagsService.getPopularTimes(page);

      case 'place':
        return this.tagsService.getPopularPlaces(page);

      default:
        break;
    }
  }
}
