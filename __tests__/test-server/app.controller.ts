import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Browser, BrowserContext } from 'puppeteer';
import { InjectContext } from '../../src';

@Controller()
export class AppController {
  constructor(
    @InjectContext() private readonly context: BrowserContext,
    private readonly appService: AppService,
  ) {}

  @Get()
  async getTitleOfPage(@Query('url') url: string) {
    return this.appService.getTitleOfPage(url);
  }

  @Get('context')
  async getContext() {
    return {
      incognito: this.isNotIncognito(this.context, this.context.browser()),
    };
  }

  isNotIncognito(context: BrowserContext, browser: Browser) {
    const defaultContext = browser.defaultBrowserContext();
    return context === defaultContext;
  }
}
