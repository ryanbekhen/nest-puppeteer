import { PuppeteerLaunchOptions } from 'puppeteer';
import { ModuleMetadata, Type } from '@nestjs/common';

export interface PuppeteerModuleOptions {
  launchOptions?: PuppeteerLaunchOptions;
  maxInstances?: number;
}

export interface PuppeteerModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<PuppeteerOptionsFactory>;
  useClass?: Type<PuppeteerOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<PuppeteerModuleOptions> | PuppeteerModuleOptions;
  inject?: any[];
}

export interface PuppeteerOptionsFactory {
  createPuppeteerOptions():
    | Promise<PuppeteerModuleOptions>
    | PuppeteerModuleOptions;
}
