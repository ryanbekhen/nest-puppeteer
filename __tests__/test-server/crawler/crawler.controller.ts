import { Controller, Get, Query } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { InjectContext } from '../../../src';
import { Browser, BrowserContext } from 'puppeteer';

@Controller('crawler')
export class CrawlerController {
  constructor(
    @InjectContext() private readonly context: BrowserContext,
    private readonly crawlerService: CrawlerService,
  ) {}

  @Get()
  async getTitleOfPage(@Query('url') url: string) {
    return this.crawlerService.getTitleOfPage(url);
  }

  @Get('context')
  async getContext() {
    return {
      incognito: this.isIncognito(this.context, this.context.browser()),
    };
  }

  isIncognito(context: BrowserContext, browser: Browser) {
    const defaultContext = browser.defaultBrowserContext();
    return context !== defaultContext;
  }
}
