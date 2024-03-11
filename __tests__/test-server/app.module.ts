import { Module } from '@nestjs/common';
import { CrawlerModule } from './crawler/crawler.module';
import { PuppeteerModule } from '../../src';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    PuppeteerModule.forRootAsync({
      useFactory: () => ({
        launchOptions: {
          headless: true,
        },
      }),
    }),
    PuppeteerModule.forFeature(),
    CrawlerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
