import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';
import { InjectPage } from '../../src';

@Injectable()
export class AppService {
  constructor(@InjectPage() private readonly page: Page) {}

  async getTitleOfPage(url: string) {
    await this.page.goto(url);
    const title = await this.page.title();
    return { title };
  }
}
