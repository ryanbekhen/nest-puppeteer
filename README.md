# Nest Puppeteer

The `Nest Puppeteer` library is built upon an existing repository, namely `github.com/tinovyatkin/nest-puppeteer`.
The development of the original repository has ceased, hence this library was created as a continuation of that
development. The aim is to maintain and update the functionalities provided by the original repository, as well as to a
dd new features that may be needed by the users.

## Installation

To install the module, run the following command in your project's root directory:

```bash
$ npm install nestjs-pptr puppeteer
$ npm install -D @types/puppeteer
```

## Usage

The library provides a `PuppeteerModule` that can be used to register the `PuppeteerService` as a provider in your
application. The `PuppeteerService` can then be injected into your controllers and services to perform various tasks
related to web scraping and automation.

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nestjs-pptr';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [PuppeteerModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
```

```typescript
// app.service.ts
import { Injectable } from '@nestjs/common';
import { PuppeteerService } from 'nestjs-pptr';
import { InjectPage } from './puppeteer.decorators';
import { Page } from 'puppeteer';

@Injectable()
export class AppService {
  constructor(@InjectPage() private readonly page: Page) {
  }

  async getScreenshot(url: string): Promise<Buffer> {
    await this.page.goto(url);
    return this.page.screenshot();
  }
}
```

```typescript
// app.controller.ts
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get(':url')
  async getScreenshot(@Param('url') url: string, @Res() res: Response) {
    const screenshot = await this.appService.getScreenshot(url);
    res.set('Content-Type', 'image/png');
    res.send(screenshot);
  }
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.