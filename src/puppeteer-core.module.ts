import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnApplicationShutdown,
  OnModuleDestroy,
  Provider,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import type { Browser } from 'puppeteer';
import { launch } from 'puppeteer';
import {
  DEFAULT_CHROME_LAUNCH_OPTIONS,
  DEFAULT_PUPPETEER_INSTANCE_NAME,
  PUPPETEER_INSTANCE_NAME,
  PUPPETEER_MODULE_OPTIONS,
} from './puppeteer.constants';
import type {
  PuppeteerModuleAsyncOptions,
  PuppeteerModuleOptions,
  PuppeteerOptionsFactory,
} from './interfaces';
import { getBrowserToken, getPageToken } from './common';
import { Type } from '@nestjs/common/interfaces';

@Global()
@Module({})
export class PuppeteerCoreModule
  implements OnApplicationShutdown, OnModuleDestroy
{
  constructor(
    @Inject(PUPPETEER_INSTANCE_NAME) private readonly instanceName: string,
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRoot(options?: PuppeteerModuleOptions): DynamicModule {
    if (!options) options = {};

    if (!options.instanceName)
      options.instanceName = DEFAULT_PUPPETEER_INSTANCE_NAME;

    if (!options.launchOptions)
      options.launchOptions = DEFAULT_CHROME_LAUNCH_OPTIONS;

    const instanceNameProvider = {
      provide: PUPPETEER_INSTANCE_NAME,
      useValue: options.instanceName,
    };

    const browserProvider = {
      provide: getBrowserToken(options.instanceName),
      async useFactory() {
        return await launch(options.launchOptions);
      },
    };

    const pagesProvider = {
      provide: getPageToken(options.instanceName),
      useFactory: async (browser: Browser) => {
        return await browser.newPage();
      },
      inject: [getBrowserToken(options.instanceName)],
    };

    return {
      module: PuppeteerCoreModule,
      providers: [instanceNameProvider, browserProvider, pagesProvider],
      exports: [browserProvider, pagesProvider],
    };
  }

  static forRootAsync(options: PuppeteerModuleAsyncOptions): DynamicModule {
    if (!options) options = {};

    if (!options.instanceName)
      options.instanceName = DEFAULT_PUPPETEER_INSTANCE_NAME;

    const instanceNameProvider = {
      provide: PUPPETEER_INSTANCE_NAME,
      useValue: options.instanceName,
    };

    const browserProvider = {
      provide: getBrowserToken(options.instanceName),
      async useFactory(puppeteerModuleOptions: PuppeteerModuleOptions) {
        return await launch(
          puppeteerModuleOptions.launchOptions || DEFAULT_CHROME_LAUNCH_OPTIONS,
        );
      },
      inject: [PUPPETEER_MODULE_OPTIONS],
    };

    const pagesProvider = {
      provide: getPageToken(options.instanceName),
      useFactory: async (browser: Browser) => {
        return await browser.newPage();
      },
      inject: [getBrowserToken(options.instanceName)],
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: PuppeteerCoreModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        instanceNameProvider,
        browserProvider,
        pagesProvider,
      ],
      exports: [browserProvider, pagesProvider],
    };
  }

  onApplicationShutdown() {
    return this.onModuleDestroy();
  }

  async onModuleDestroy() {
    const browser: Browser = this.moduleRef.get(
      getBrowserToken(this.instanceName),
    );

    if (browser?.connected) await browser.close();
  }

  private static createAsyncProviders(
    options: PuppeteerModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<PuppeteerOptionsFactory>;

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: PuppeteerModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: PUPPETEER_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<PuppeteerOptionsFactory>,
    ];

    return {
      provide: PUPPETEER_MODULE_OPTIONS,
      useFactory: async (optionsFactory: PuppeteerOptionsFactory) =>
        await optionsFactory.createPuppeteerOptions(),
      inject,
    };
  }
}
