import type { BrowserContext } from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';
import { Injectable } from '@nestjs/common';
import { InjectContext } from 'nest-puppeteer';
import { Tag, TagDocument } from './tags. schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { scrollPage } from '@app/utils/scroll';
import { scrapeMovieItem } from '@app/utils/scrapeMovieItem';
import { ConfigService } from '@nestjs/config';
// import { Movie, MovieDocument } from '@app/movies/movies.schema';
import { MoviesRepository } from '@app/movies/movies.repository';

@Injectable()
export class TagsRepository {
  constructor(
    @InjectContext() private readonly browserContext: BrowserContext,
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
    // @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    private configService: ConfigService,
  ) {}

  async getAll() {
    return this.tagModel.find().sort({ title: 1 }).exec();
  }

  async getAllTags(page: number) {
    console.log('page', page);
    const limit = 10;
    const skip = (page - 1) * limit;
    const total = await this.tagModel.countDocuments({}).exec();
    const page_total = Math.floor((total - 1) / limit) + 1;
    const data = await this.tagModel.find().limit(limit).skip(skip).exec();
    return {
      data: data,
      total,
      page_total: page_total,
      page,
    };
  }

  async getTagsByNames(tags: string[]) {
    // console.log('tags', tags);
    return await this.tagModel.find({ title: { $in: tags } });
  }

  /*
  async scrapeTags() {
    console.log('scrape tags');

    const tagsPageCount = 258; // 258;
    const API_URL = this.configService.get<string>('API_URL');
    console.log('API_URL', API_URL);

    // await this.tagModel.deleteMany();

    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 10,
      puppeteerOptions: {
        headless: true,

        args: [
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-first-run',
          '--no-sandbox',
          '--no-zygote',
          '--deterministic-fetch',
          '--disable-features=IsolateOrigins',
          '--disable-site-isolation-trials',
          // '--single-process',
        ],
      },
    });

    cluster.on('taskerror', (err, data, willRetry) => {
      if (willRetry) {
        console.warn(
          `Encountered an error while crawling ${data}. ${err.message}\nThis job will be retried`,
        );
      } else {
        console.error(`Failed to crawl ${data}: ${err.message}`);
      }
    });

    await cluster.task(async ({ page, data: url }) => {
      // await page.goto(url);
      // const screen = await page.screenshot();

      const resTags = [];

      await page.goto(url, {
        waitUntil: 'networkidle0',
      });

      // Get the height of the rendered page
      scrollPage(page);

      const tags = await page.$$('.col-md-3.col-sm-3.col-ms-3.col-xs-6');

      for (const tag of tags) {
        const { title, link } = await tag.$eval(`a`, (el) => ({
          title: el.innerText,
          link: el.href,
        }));

        // const img = await tag.$eval(`img`, (el) => el.src);

        let img = await tag.$eval(`img`, (el) =>
          (el as HTMLElement).getAttribute('data-src'),
        );
        if (!img) {
          img = await tag.$eval(`img`, (el) =>
            (el as HTMLElement).getAttribute('data-hidden-src'),
          );
        }

        resTags.push({ title, link, img });
      }

      //Save tags to db
      // try {
      //   await this.tagModel.create(resTags);
      // } catch (error) {
      //   console.log('Error saving tags to db', error);
      // }

      // console.log('resTags', resTags);
      console.log('Finished tags from page', url);
      this.waitBeforeNextIteration(1000);
      await page.waitForNavigation();
    });

    for (let pageIndex = 19; pageIndex < tagsPageCount; pageIndex++) {
      cluster.queue(`${API_URL}/tag?page=${pageIndex}`);
    }

    // cluster.queue('http://www.google.com/');
    // cluster.queue('http://www.wikipedia.org/');
    // many more pages

    await cluster.idle();
    await cluster.close();
  }
*/

  async scrapeTagsImage() {
    console.log('scrape tags images');
    const API_URL = this.configService.get<string>('API_URL');
    // get tags with missing images
    const tagsWithMissingImages = await this.tagModel
      .find({
        img: { $regex: 'noimg256h' },
      })
      .sort({ title: 1 })
      .exec();

    for (
      let tagIndex = 0;
      tagIndex < tagsWithMissingImages.length;
      tagIndex++
    ) {
      const curTag = tagsWithMissingImages[tagIndex];
      const tagId = curTag.link.split('/')?.pop();
      console.log('scraping page ', tagIndex, curTag.link);

      const page = await this.browserContext.newPage();

      await page.goto(`${API_URL}/tag/${tagId}`, {
        waitUntil: 'networkidle0',
      });

      const img = await page.evaluate((element) => {
        return (element as HTMLElement)?.getAttribute('src');
      }, (await page.$x('//*[@id="content"]/div[1]/div[2]/div/div[2]/div[1]/div/div/img'))[0]);

      this.waitBeforeNextIteration(400);
      if (img) {
        console.log({ img: img });
        //update db tag image
        await this.tagModel.findOneAndUpdate({ _id: curTag._id }, { img });
      }

      // console.log(doc);
    }

    return [];
  }

  waitBeforeNextIteration(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // async scrapeTagPage(tagId: string, pageIndex = 1) {
  //   const API_URL = this.configService.get<string>('API_URL');
  //   console.log('scrape tag page ', tagId);
  //   console.log('API_URL', API_URL);
  //   const page = await this.browserContext.newPage();
  //   await page.goto(`${API_URL}/tag/${tagId}?page=${pageIndex}`);
  //   const results = [];
  //   const items = await page.$$('.item.item-small');
  //   console.log('items', items.length);
  //   for (const selectedItem of items) {
  //     const result = await scrapeMovieItem(selectedItem);
  //     const movieModel = this.convert(result);
  //     results.push(movieModel);
  //   }

  //   await this.moviesRepo.insertMany(results);
  //   return results;
  // }

  // async scrapeAllTagsPages() {
  //   // fetch all tags from DB
  //   // for each tag do this
  //   const tagsList = await this.tagModel.find().sort({ title: 1 }).exec();
  //   // return tagsList;

  //   for (let tagIndex = 0; tagIndex < tagsList.length; tagIndex++) {
  //     const tagId = tagsList[tagIndex].link?.split('/')?.pop();
  //     // '10301-10-year-old'; //
  //     console.log('start scrape tag all pages ', tagId);

  //     let pageIndex = 1;
  //     let hasNextPage = true;
  //     const results = [];
  //     //Loop over pages
  //     while (hasNextPage) {
  //       console.log('Page ', pageIndex);
  //       const API_URL = this.configService.get<string>('API_URL');

  //       const page = await this.browserContext.newPage();
  //       await page.goto(`${API_URL}/tag/${tagId}?page=${pageIndex}`);

  //       const items = await page.$$('.item.item-small');
  //       console.log('items', items.length);
  //       for (const selectedItem of items) {
  //         const result = await scrapeMovieItem(selectedItem);
  //         const movieModel = this.convert(result);
  //         results.push(movieModel);
  //       }

  //       //check if next true
  //       const pagination = await page.$('.pagination.pagination-lg');
  //       if (!pagination) {
  //         break;
  //       }

  //       const disabledEl = await page.$('.disabled');
  //       const isDisabled = disabledEl !== null;

  //       const isLast =
  //         (await disabledEl?.$eval(`a`, (el) => el.innerText)) === '→';

  //       hasNextPage = !isLast;
  //       console.log('Is next', { isDisabled, isNext: hasNextPage, isLast });
  //       if (hasNextPage) {
  //         pageIndex++;
  //       }
  //     }
  //     console.log('results', JSON.stringify(results, null, 2));
  //     await this.moviesRepo.insertMany(results);
  //   }
  //   return [];
  // }

  // private convert(movie) {
  //   const movieItem = { ...movie };
  //   movieItem.year = parseInt(
  //     movie.title
  //       .substring(movie.title.length - 6)
  //       ?.replace(')', '')
  //       ?.replace('(', ''),
  //   );
  //   movieItem.movieId = movie.link?.split('/')?.pop();
  //   movieItem.country = movie.country?.split(',')?.map((e) => e.trim());

  //   movieItem.style = this.split(movie.style);

  //   movieItem.audience = this.split(movie.audience);

  //   movieItem.plot = this.split(movie.plot);

  //   movieItem.time = this.split(movie.time);

  //   movieItem.place = this.split(movie.place);

  //   movieItem.genre = this.split(movie.genre);

  //   movieItem.rating = movie.rating ? parseFloat(movie.rating) : 0;
  //   // console.log(movieItem);
  //   return movieItem;
  // }

  // private split(str: string) {
  //   return str
  //     ?.replace(/...$/, '')
  //     ?.split(',')
  //     ?.map((e) => e.trim());
  // }
}
