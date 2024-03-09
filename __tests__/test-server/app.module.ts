import { Module } from '@nestjs/common';
import { PuppeteerModule } from '../../src';
import { CrawlerModule } from './crawler/crawler.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    PuppeteerModule.forRoot({ isGlobal: true, headless: true }),
    CrawlerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
