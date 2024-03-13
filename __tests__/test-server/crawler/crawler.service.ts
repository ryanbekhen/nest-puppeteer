import { Injectable } from '@nestjs/common';
import { InjectCore, PuppeteerCore } from '../../../src';

@Injectable()
export class CrawlerService {
  constructor(@InjectCore() private readonly core: PuppeteerCore) {}

  async getTitleOfPage(url: string) {
    const instance = await this.core.launch('Crawler');
    const page = await instance.browser.newPage();
    await page.goto(url);
    const title = await page.title();

    return { title };
  }
}
