import { Controller, Get, Query } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Get()
  async getTitleOfPage(@Query('url') url: string) {
    return this.crawlerService.getTitleOfPage(url);
  }
}
