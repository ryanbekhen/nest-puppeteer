# NestJS Puppeteer

[![npm version](https://badge.fury.io/js/nestjs-pptr.svg)](https://badge.fury.io/js/nestjs-pptr)

A [NestJS](https://nestjs.com/) module for [Puppeteer](https://pptr.dev/). This module provides a service that can be
injected into your controllers and services to perform various tasks related to web scraping and automation.

## Installation

To install the module, run the following command in your project's root directory:

```bash
$ npm install nestjs-pptr puppeteer
$ npm install --save-dev @types/puppeteer

# or

$ yarn add nestjs-pptr puppeteer
$ yarn add -D @types/puppeteer
```

## Usage

### Registering the Module

The `PuppeteerModule` can be registered in your application by calling the `forRoot` method in the `imports` array of
your `AppModule`. The `forRoot` method accepts an optional `PuppeteerModuleOptions` object that can be used to configure
the module.

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nestjs-pptr';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [PuppeteerModule.forRoot({ launchOptions: { headless: true } })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
```

### Using the Service

The `PuppeteerCore` service can be injected into your controllers and services by using the `@InjectCore` decorator. The
`PuppeteerCore` service provides a wrapper around the `puppeteer` package and exposes the same methods and properties.

```typescript
// app.service.ts
import { Injectable } from '@nestjs/common';
import { InjectCore, PuppeteerCore } from 'nestjs-pptr';
import { Page } from 'puppeteer';

@Injectable()
export class AppService {
  constructor(@InjectCore() private readonly puppeteer: PuppeteerCore) {
  }

  async getScreenshot(url: string): Promise<Buffer> {
    const browser = await this.puppeteer.launch();
    const page: Page = await browser.newPage();
    await page.goto(url);
    const screenshot = await page.screenshot();
    await browser.close();
    return screenshot;
  }
}
```

### Using the Service with Custom Options

The `PuppeteerCore` service can be injected into your controllers and services by using the `@InjectCore` decorator. The
`PuppeteerCore` service provides a wrapper around the `puppeteer` package and exposes the same methods and properties.

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

More examples can be found in the [\__test\__](./__tests__) directory.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.