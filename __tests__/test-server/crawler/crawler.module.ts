import { Module } from '@nestjs/common';
import { PuppeteerModule } from '../../../src';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';

@Module({
  imports: [PuppeteerModule.forFeature()],
  controllers: [CrawlerController],
  providers: [CrawlerService],
})
export class CrawlerModule {}
