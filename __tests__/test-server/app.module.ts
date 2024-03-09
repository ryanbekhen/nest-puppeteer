import { Module } from '@nestjs/common';
import { PuppeteerModule } from '../../src';
import { CrawlerModule } from './crawler/crawler.module';

@Module({
  imports: [
    PuppeteerModule.forRoot({ isGlobal: true, headless: true }),
    CrawlerModule,
  ],
})
export class AppModule {}
