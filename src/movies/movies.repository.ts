import type { BrowserContext } from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { InjectContext } from 'nest-puppeteer';
import { Movie, MovieDocument } from './movies.schema';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { scrollPage } from '@app/utils/scroll';
import { scrapeMovieItem } from '@app/utils/scrapeMovieItem';
import { ConfigService } from '@nestjs/config';
import { TagsRepository } from '@app/tags/tags.repository';
import { FilterDto, MOVIE_TYPE } from './filter.dto';
import { json2csv } from 'json-2-csv';
import * as fs from 'fs';

const HOME_LIST_MAX = 10;

@Injectable()
export class MoviesRepository {
  starterPage = 2000;
  countPerIteration = 60;

  missedDic = {
    Act: 'Action',
    Advent: 'Adventure',
    Animat: 'Animation',
    Biogra: 'Biography',
    Com: 'Comedy',
    Cr: 'Crime',
    Document: 'Documentary',
    Dr: 'Drama',
    Fam: 'Family',
    Fant: 'Fantasy',
    Hist: 'History',
    Hor: 'Horror',
    Mu: 'Musical',
    Musi: 'Musical',
    Music: 'Musical',
    Myst: 'Mystery',
    Roma: 'Romance',
    Sci: 'Sci-Fi',
    Sh: 'Short',
    Sp: 'Sport',
    Thril: 'Thriller',
  };

  paginationOptions = {
    lean: true,
    leanWithId: false,
    customLabels: {
      docs: 'data',
      totalDocs: 'total',
    },

    projection: {
      title: 1,
      link: 1,
      img: 1,
      rating: 1,
      genre: 1,
      country: 1,
      votes: 1,
      isTVShow: 1,
    },
  };

  // HOME CONSTS

  constructor(
    private configService: ConfigService,
    @InjectContext() private readonly browserContext: BrowserContext,
    @InjectModel(Movie.name) private movieModel: PaginateModel<MovieDocument>,
    private tagsRepo: TagsRepository,
  ) {}

  async generateMLData() {
    // [ 'title', 'rating',  'country', 'genre', 'plot', ]
    const data = await this.movieModel
      .find(
        {},
        {
          title: 1,
          rating: 1,
          country: 1,
          genre: 1,
          plot: 1,
          story: 1,
          // year: 1,
          // movieId: 1,
          // audience: 1,
          // place: 1,
          // style: 1,
          // time: 1,
        },
      )
      .sort({ rating: -1, title: -1, year: -1 })
      // .limit(40000);
      .skip(40000);
    console.log('LENGTH', data.length);

    const formatedData = [];
    data.forEach((doc) => {
      const fDoc: any = {};
      fDoc.id = doc.id;
      fDoc.title = doc.title?.replace(',', ' ').toLowerCase();
      fDoc.rating = doc.rating;
      fDoc.country = doc.country.slice(0, 3).join(' ').toLowerCase();
      fDoc.genre = doc.genre.slice(0, 3).join(' ').toLowerCase();
      fDoc.plot = doc.plot.slice(0, 2).join(' ').toLowerCase();
      // fDoc.year = doc.year;
      // fDoc.movieId = doc.movieId;
      fDoc.story = doc.story?.replace(',', ' ').toLowerCase();
      // fDoc.audience = doc.audience.join(' ').toLowerCase();
      // fDoc.place = doc.place.join(' ').toLowerCase();
      // fDoc.style = doc.style.join(' ').toLowerCase();
      // fDoc.time = doc.time.join(' ').toLowerCase();
      formatedData.push(fDoc);
    });

    console.log('formatedData', formatedData.length);

    try {
      const csv = await json2csv(formatedData, { delimiter: { field: ',' } });

      // print CSV string
      // console.log(csv);

      // write CSV to a file
      fs.writeFileSync('movies_dataset_last40k.csv', csv);
    } catch (err) {
      console.log(err);
    }

    return formatedData;
  }

  async fixGenres() {
    // FIX_GENRES
    // const missedKeys = Object.keys(this.missedDic);
    // const dbGenres = await this.movieModel.find().select({ genre: 1 });
    // dbGenres.forEach(async (g) => {
    //   const res = [];
    //   g.genre.forEach((e) => {
    //     if (missedKeys.includes(e)) {
    //       res.push(this.missedDic[e]);
    //     } else {
    //       res.push(e);
    //     }
    //   });
    //   const changedDoc = await this.movieModel.updateOne(
    //     { _id: g._id },
    //     { $set: { genre: res } },
    //   );
    //   console.log(`${g.genre} => ${res}`);
    //   console.log(`changedDoc: ${JSON.stringify(changedDoc, null, 2)}`);
    // });
    // return res;
  }

  async getPopularMovies(page = 1, limit: number = HOME_LIST_MAX) {
    const options = {
      ...this.paginationOptions,

      page: Number(page),
      limit: Number(limit),
      sort: { rating: -1 },
    };
    const res = await this.movieModel.paginate({ isTVShow: false }, options);

    return res;
  }

  async getPopularTVShows(page = 1, limit: number = HOME_LIST_MAX) {
    const options = {
      ...this.paginationOptions,

      page: Number(page),
      limit: Number(limit),
      sort: { rating: -1 },
    };
    const res = await this.movieModel.paginate({ isTVShow: true }, options);

    return res;
  }

  async getPopularStyles(page = 1, limit: number = HOME_LIST_MAX) {
    return await this.getTagsWithPages('style', page, limit);
  }

  async getTagsWithPages(
    tagName: string,
    page = 1,
    limit: number = HOME_LIST_MAX,
  ) {
    const tagsAggregateByStyle = await this.getAggregateBy(
      tagName,
      limit,
      page,
    );

    console.log('page: ', page, tagName);
    const tagsNames: string[] = tagsAggregateByStyle.data.map((s) => s._id);
    const res = await this.tagsRepo.getTagsByNames(tagsNames);

    return {
      ...tagsAggregateByStyle,
      data: res,
    };
  }

  async getPopularPlots(page = 1, limit: number = HOME_LIST_MAX) {
    return this.getTagsWithPages('plot', page, limit);
  }

  async getPopularTimes(page = 1, limit: number = HOME_LIST_MAX) {
    return this.getTagsWithPages('time', page, limit);
  }

  async getPopularPlaces(page = 1, limit: number = HOME_LIST_MAX) {
    return this.getTagsWithPages('place', page, limit);
  }

  async getAllMovies() {
    return await this.movieModel.find();
  }

  async getMovie(id: string) {
    // check movie in db
    // if doesn't exist scrape it and save it DB
    // if exist return it
    const data = await this.movieModel.findOne({ movieId: id });
    if (data) return data;

    return await this.scrapeMovie(id);
  }

  async getSimilarMovies(movieId: string) {
    const data = await this.movieModel.findOne({ movieId }).select({ sim: 1 });

    console.log('sim ids', data.sim);
    const res = await this.movieModel.find({ _id: { $in: data.sim } });

    // .select({ title: 1 });
    //reorder
    const orderedRes = [];
    data.sim.map((doc: any) => {
      orderedRes.push(res.find((s) => s.id === doc));
    });

    return orderedRes;
  }

  async getTagMovies(id: string, page = 1) {
    console.log('getTagMovies', id, page);

    const limit = 10;
    const skip = (page - 1) * limit;
    const total = await this.movieModel.countDocuments({}).exec();
    const page_total = Math.floor((total - 1) / limit) + 1;

    const data = await this.movieModel
      .find({
        $or: [
          { plot: { $in: [id] } },
          { style: { $in: [id] } },
          { time: { $in: [id] } },
          { place: { $in: [id] } },
        ],
      })
      .sort({ rating: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    const res = {
      data,
      total,
      page_total: page_total,
      page,
      resultLength: data.length,
    };

    return res;
  }

  async insertMany(arr) {
    return await this.movieModel.insertMany(arr);
  }

  async getByGener(genre) {
    console.log('getByGener', genre);
    return await this.movieModel.find({ genre });
  }

  async search(page: number, query: FilterDto) {
    console.log('page', page);
    console.log('query', { query, page });

    let searchQuery: any = {};
    if (query.title) {
      const regex = new RegExp(`${query.title ?? ''}`, 'ig'); //   /${term}/i
      searchQuery = { title: { $regex: regex } };
    }

    if (query?.countries?.length > 0) {
      searchQuery = { ...searchQuery, country: { $in: query.countries } };
    }

    if (query.genres?.length > 0) {
      searchQuery = { ...searchQuery, genre: { $all: query.genres } };
    }

    if (query.years) {
      searchQuery = {
        ...searchQuery,
        year: {
          $gte: Math.min(query.years[0], query.years[1]),
          $lte: Math.max(query.years[0], query.years[1]),
        },
      };
    }

    if (query.rating) {
      searchQuery = {
        ...searchQuery,
        rating: {
          $gte: Math.min(query.rating[0], query.rating[1]),
          $lte: Math.max(query.rating[0], query.rating[1]),
        },
      };
    }

    if (query.hasOwnProperty('isTVShow')) {
      searchQuery = {
        ...searchQuery,
        isTVShow: query.isTVShow,
      };
    }
    if (query.type !== MOVIE_TYPE.ALL) {
      searchQuery = {
        ...searchQuery,
        isTVShow: query.type === MOVIE_TYPE.TV_SHOWS,
      };
    }

    console.log('searchQuery', searchQuery);
    console.log('searchQuery year', searchQuery.year);

    const limit = 10;

    const options = {
      ...this.paginationOptions,

      page: Number(page),
      limit: Number(limit),

      projection: {
        title: 1,
        link: 1,
        img: 1,
        rating: 1,
        genre: 1,
        country: 1,
        votes: 1,
        isTVShow: 1,
      },
    };

    const res = await this.movieModel.paginate(
      searchQuery,

      options,
    );

    console.log('res totalPages, res.length', res.totalPages);
    return res;
  }

  private async getAggregateBy(aggregateBy: string, limit = 4, page = 1) {
    console.log('getAggregateBy', { aggregateBy, limit, page });
    const skip = (page - 1) * limit;
    const total = await this.movieModel.countDocuments({}).exec();
    const page_total = Math.floor((total - 1) / limit) + 1;

    const data = await this.movieModel
      .aggregate([
        //Unwind the deck to get every card
        {
          $unwind: `$${aggregateBy}`,
        },
        //Get count of each card
        {
          $group: {
            _id: `$${aggregateBy}`,
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        { $skip: skip },
        { $limit: limit },
      ])
      .exec();

    const res = {
      data,
      total,
      page_total: page_total,
      page,
      resultLength: data.length,
    };
    console.log('res', res);
    return res;
  }

  async scrapeAllMovies(starterPage: number) {
    // await this.movieModel.deleteMany();
    // fetch all tags from DB
    // for each tag do this
    console.log('start scrape from starterPage', starterPage);
    // return;

    const tagsList = await this.tagsRepo.getAll();
    // return tagsList;

    const page = await this.browserContext.newPage();

    const dbMovies = await this.movieModel.find();
    const moviesDic = dbMovies.map((s) => s.link);

    for (let tagIndex = starterPage; tagIndex > 0; tagIndex--) {
      const tagId = tagsList[tagIndex].link?.split('/')?.pop();
      // '10301-10-year-old'; //
      console.log('start scrape tag all pages ', tagId, tagIndex);

      let pageIndex = 1;
      let hasNextPage = true;
      const results = [];

      //Loop over pages
      while (hasNextPage) {
        //get all movies from db

        console.log('Page ', pageIndex);
        const API_URL = this.configService.get<string>('API_URL');

        // const page = await this.browserContext.newPage();
        await page.goto(`${API_URL}/tag/${tagId}?page=${pageIndex}`, {
          waitUntil: 'networkidle0',
        });

        const items = await page.$$('.item.item-small');
        console.log('items', items.length);
        for (const selectedItem of items) {
          const result = await scrapeMovieItem(selectedItem);
          const movieModel = this.convert(result);
          if (!moviesDic.find((s) => s === result.link)) {
            results.push(movieModel);
          } else {
            moviesDic.push(result.link);
          }
        }

        //check if next true
        const pagination = await page.$('.pagination.pagination-lg');
        if (!pagination) {
          break;
        }

        const disabledEl = await page.$('.disabled');
        // const isDisabled = disabledEl !== null;

        const isLast =
          (await disabledEl?.$eval(`a`, (el) => el.innerText)) === '→';

        hasNextPage = !isLast;
        // console.log('Is next', { isDisabled, isNext: hasNextPage, isLast });
        if (hasNextPage) {
          pageIndex++;
        }
        this.waitBeforeNextIteration(500);
      }

      //check if movie already in db

      console.log('movies dic', moviesDic.length);
      console.log('results', results.length);
      await this.movieModel.insertMany(results);
    }
    // this.starterPage += this.countPerIteration;
    return [];
  }

  private async scrapeMovie(movieId: string) {
    console.log('scrape movie page ', movieId);

    const page = await this.browserContext.newPage();
    const API_URL = this.configService.get<string>('API_URL');

    await page.goto(`${API_URL}/movies/${movieId}`);

    scrollPage(page);

    const results = [];

    const curMovie = await page.$('.item.item-big');
    const result = await scrapeMovieItem(curMovie);
    results.push(result);

    const items = await page.$$('.item.item-small');
    console.log('items', items.length);

    for (const selectedItem of items) {
      const result = await scrapeMovieItem(selectedItem);

      results.push(result);
    }
    return results;
  }

  private convert(movie) {
    const movieItem = { ...movie };
    movieItem.year = parseInt(
      movie.title
        .substring(movie.title.length - 6)
        ?.replace(')', '')
        ?.replace('(', ''),
    );
    movieItem.movieId = movie.link?.split('/')?.pop();
    movieItem.country = movie.country?.split(',')?.map((e) => e.trim());

    movieItem.style = this.split(movie.style);

    movieItem.audience = this.split(movie.audience);

    movieItem.plot = this.split(movie.plot);

    movieItem.time = this.split(movie.time);

    movieItem.place = this.split(movie.place);

    movieItem.genre = this.split(movie.genre);

    movieItem.rating = movie.rating ? parseFloat(movie.rating) : 0;
    // console.log(movieItem);
    return movieItem;
  }

  waitBeforeNextIteration(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private split(str: string) {
    return str
      ?.replace(/...$/, '')
      ?.split(',')
      ?.map((e) => e.trim());
  }
}
