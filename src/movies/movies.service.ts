import { BadRequestException, Injectable } from '@nestjs/common';
import { Movie, MovieDocument } from './movies.schema';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { FilterDto, MOVIE_TYPE } from './dtos/filter.dto';
import { json2csv } from 'json-2-csv';
import * as fs from 'fs';

const HOME_LIST_MAX = 10;

@Injectable()
export class MoviesService {
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
    @InjectModel(Movie.name) private movieModel: PaginateModel<MovieDocument>,
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
      fDoc.story = doc.story?.replace(',', ' ').toLowerCase();

      formatedData.push(fDoc);
    });

    console.log('formatedData', formatedData.length);

    try {
      const csv = await json2csv(formatedData, { delimiter: { field: ',' } });

      // write CSV to a file
      fs.writeFileSync('movies_dataset_last40k.csv', csv);
    } catch (err) {
      console.log(err);
    }

    return formatedData;
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

  async getMovie(id: string): Promise<Movie> {
    const data = await this.movieModel.findOne({ movieId: id });
    if (data) return data;

    throw new BadRequestException(`Invalid movie id ${id}`);
  }

  async getSimilarMovies(movieId: string): Promise<Movie[]> {
    const data = await this.movieModel.findOne({ movieId }).select({ sim: 1 });

    if (!data) throw new BadRequestException(`Invalid movie id ${movieId}`);

    console.log('sim ids', data?.sim);
    const res = await this.movieModel.find({ _id: { $in: data?.sim } });

    //reorder
    const orderedRes: Movie[] = [];
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

  async getByGener(page, genre: string) {
    return this.search(page, { genres: [genre] });
  }

  async search(page: number, query: FilterDto) {
    console.log('page', page);
    console.log('query', { query, page });

    let searchQuery = {};
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

    if (query.type !== MOVIE_TYPE.ALL) {
      searchQuery = {
        ...searchQuery,
        isTVShow: query.type === MOVIE_TYPE.TV_SHOWS,
      };
    }

    console.log('searchQuery', searchQuery);

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

    // console.log('res', res);
    console.log('res totalPages', res.totalPages);
    return res;
  }

  async getAggregateBy(aggregateBy: string, limit = 4, page = 1) {
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

  private waitBeforeNextIteration(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private split(str: string) {
    return str
      ?.replace(/...$/, '')
      ?.split(',')
      ?.map((e) => e.trim());
  }
}
