import { Module } from '@nestjs/common';
import { PuppeteerModule } from '../../src';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrawlerModule } from './crawler/crawler.module';

@Module({
  imports: [
    PuppeteerModule.forRootAsync({
      useFactory: () => ({
        launchOptions: {
          headless: true,
        },
      }),
    }),
    CrawlerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
