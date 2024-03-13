import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';
import { PuppeteerModule } from '../../../src';

@Module({
  imports: [
    PuppeteerModule.forRoot({
      launchOptions: {
        headless: true,
      },
    }),
  ],
  controllers: [CrawlerController],
  providers: [CrawlerService],
})
export class CrawlerModule {}
