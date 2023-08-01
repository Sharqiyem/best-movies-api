import type { BrowserContext } from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { InjectContext } from 'nest-puppeteer';
import { Home, HomeDocument } from './home. schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { scrollPage } from '@app/utils/scroll';
import { ConfigService } from '@nestjs/config';
import { MoviesRepository } from '@app/movies/movies.repository';

@Injectable()
export class HomeRepository {
  homeData = null;

  constructor(
    private configService: ConfigService,
    @InjectContext() private readonly browserContext: BrowserContext,
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

  private async scrapeHome() {
    console.log('Start scraping home');
    const page = await this.browserContext.newPage();

    const API_URL = this.configService.get<string>('API_URL');

    await page.goto(API_URL, {
      waitUntil: 'networkidle0',
    });

    await scrollPage(page);

    const items = await page.$$('.section2');

    const sections = [];
    for (const section of items) {
      const { sectionTitle } = await section.$eval(`h3`, (el) => ({
        sectionTitle: el.innerText,
      }));

      console.log('Section title', sectionTitle);

      const movies = await section.$$(`.block-ins-item`);
      console.log(movies.length);

      const sectionItems = [];
      for (const movie of movies) {
        const { link } = await movie.$eval(`a`, (el) => ({
          link: el.href,
        }));

        const { title } = await movie.$eval(`.block-ins-caption a`, (el) => ({
          title: el.innerText,
        }));

        const img = await movie.$eval(`img`, (el) => el.src);

        console.log({ title, link, img });

        sectionItems.push({ title, link, img });
      }

      sections.push({
        title: sectionTitle,
        data: [{ list: sectionItems }],
      });
    }
    this.homeData = sections;
    return sections;
  }
}
