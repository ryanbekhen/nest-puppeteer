import {
  DynamicModule,
  Module,
  OnApplicationShutdown,
  OnModuleDestroy,
  Provider,
  Type,
} from '@nestjs/common';
import {
  PuppeteerModuleAsyncOptions,
  PuppeteerModuleOptions,
  PuppeteerOptionsFactory,
} from './puppeteer-options.interface';
import {
  DEFAULT_CHROME_LAUNCH_OPTIONS,
  PUPPETEER_CORE,
  PUPPETEER_MODULE_OPTIONS,
} from './puppeteer.constants';
import { PuppeteerCore } from './puppeteer-core.provider';
import { ModuleRef } from '@nestjs/core';

@Module({})
export class PuppeteerModule implements OnApplicationShutdown, OnModuleDestroy {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown() {
    await this.onModuleDestroy();
  }

  async onModuleDestroy() {
    const core = this.moduleRef.get<PuppeteerCore>(PUPPETEER_CORE);
    await core.closeAll();
  }

  /**
   * Register the module with options synchronously
   * @param options The options to use when registering the module synchronously
   */
  static forRoot(options?: PuppeteerModuleOptions): DynamicModule {
    const providers = [
      {
        provide: PUPPETEER_MODULE_OPTIONS,
        useValue: options || {},
      },
      {
        provide: PUPPETEER_CORE,
        useFactory: async (puppeteerModuleOptions: PuppeteerModuleOptions) => {
          if (!puppeteerModuleOptions.launchOptions) {
            puppeteerModuleOptions.launchOptions =
              DEFAULT_CHROME_LAUNCH_OPTIONS;
          }

          if (
            puppeteerModuleOptions.maxInstances === undefined ||
            puppeteerModuleOptions.maxInstances <= 0
          ) {
            puppeteerModuleOptions.maxInstances = 1;
          }

          return new PuppeteerCore(puppeteerModuleOptions);
        },
        inject: [PUPPETEER_MODULE_OPTIONS],
      },
    ];

    return {
      module: PuppeteerModule,
      providers,
      exports: [...providers],
    };
  }

  /**
   * Register the module asynchronously with options
   * @param options The options to use when registering the module asynchronously
   */
  static forRootAsync(options: PuppeteerModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);

    const providers = [
      ...asyncProviders,
      {
        provide: PUPPETEER_CORE,
        useFactory: async (puppeteerModuleOptions: PuppeteerModuleOptions) => {
          if (!puppeteerModuleOptions.launchOptions) {
            puppeteerModuleOptions.launchOptions =
              DEFAULT_CHROME_LAUNCH_OPTIONS;
          }

          if (
            puppeteerModuleOptions.maxInstances === undefined ||
            puppeteerModuleOptions.maxInstances <= 0
          ) {
            puppeteerModuleOptions.maxInstances = 1;
          }

          return new PuppeteerCore(puppeteerModuleOptions);
        },
        inject: [PUPPETEER_MODULE_OPTIONS],
      },
    ];

    return {
      module: PuppeteerModule,
      imports: options.imports,
      providers: [...providers],
      exports: [...providers],
    };
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
