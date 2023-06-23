import type { Page } from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { InjectPage } from 'nest-puppeteer';
import { Tag, TagDocument } from './tags. schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TagsRepository {
  constructor(
    @InjectPage() private readonly page: Page,
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
  ) {}

  async getAllTags(page: number) {
    const limit = 60;
    const skip = (page - 1) * limit;

    const total = await this.tagModel.countDocuments({}).exec();
    const page_total = Math.floor((total - 1) / limit) + 1;
    const data = await this.tagModel.find().limit(limit).skip(skip).exec();

    return {
      data: data,
      total,
      page_total: page_total,
    };
  }

  async timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async scrapeTags() {
    console.log('scrape tags');
    const tagsPageCount = 258; // 258;

    //delete all tags
    // await this.tagModel.deleteMany();

    for (let pageIndex = 101; pageIndex < tagsPageCount; pageIndex++) {
      const resTags = [];
      await this.page.goto(`https://bestsimilar.com/tag?page=${pageIndex}`, {
        waitUntil: 'networkidle0',
      });

      // Get the height of the rendered page
      await this.scroll();

      const tags = await this.page.$$('.col-md-3.col-sm-3.col-ms-3.col-xs-6');

      for (const tag of tags) {
        const { title, link } = await tag.$eval(`a`, (el) => ({
          title: el.innerText,
          link: el.href,
        }));
        const img = await tag.$eval(`img`, (el) => el.src);

        resTags.push({ title, link, img });
      }

      //Save tags to db
      try {
        await this.tagModel.create(resTags);
      } catch (error) {
        console.log('Error saving tags to db', error);
      }
      console.log('Finished tags from page', pageIndex);
    }

    return [];
  }

  private async scroll() {
    const bodyHandle = await this.page.$('body');
    const { height } = await bodyHandle.boundingBox();
    await bodyHandle.dispose();

    // Scroll one viewport at a time, pausing to let content load
    const viewportHeight = this.page.viewport().height;
    let viewportIncr = 0;
    while (viewportIncr + viewportHeight < height) {
      await this.page.evaluate((_viewportHeight) => {
        window.scrollBy(0, _viewportHeight);
      }, viewportHeight);
      await this.timeout(2000);
      viewportIncr = viewportIncr + viewportHeight;
    }

    // Scroll back to top
    await this.page.evaluate(() => {
      window.scrollTo(0, 0);
    });
  }
}
