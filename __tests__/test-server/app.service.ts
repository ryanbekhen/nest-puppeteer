import { Injectable } from '@nestjs/common';
import { InjectBrowser } from '../../src';
import { Browser } from 'puppeteer';

@Injectable()
export class AppService {
  constructor(@InjectBrowser() private readonly browser: Browser) {}

  async getTitleOfPage(url: string) {
    const pages = await this.browser.pages();
    let page = pages[0];
    if (!page) {
      page = await this.browser.newPage();
    }
    await page.goto(url, { waitUntil: 'networkidle2' });
    const title = await page.title();
    return { title };
  }
}
