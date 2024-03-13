import { launch, PuppeteerLaunchOptions } from 'puppeteer';
import { PuppeteerModuleOptions } from './puppeteer-options.interface';
import { PuppeteerInstance } from './puppeteer.interface';

export class PuppeteerCore {
  private readonly pool: PuppeteerInstance[] = [];

  constructor(private readonly options: PuppeteerModuleOptions) {}

  async launch(instanceName: string, options?: PuppeteerLaunchOptions) {
    if (!options) options = this.options.launchOptions;

    const exists = this.pool.find((i) => i.instanceName === instanceName);
    if (exists) {
      throw new Error(`Instance with name ${instanceName} already exists`);
    }

    if (
      this.options.maxInstances &&
      this.pool.length >= this.options.maxInstances
    ) {
      throw new Error('Max instances reached');
    }

    const browser = await launch(options);
    const instance: PuppeteerInstance = { instanceName, browser };
    this.pool.push(instance);
    return instance;
  }

  async destroy(instance: PuppeteerInstance) {
    await instance.browser.close();
    this.pool.splice(this.pool.indexOf(instance), 1);
  }

  instanceOptions() {
    return this.options;
  }

  async instance(instanceName: string) {
    return this.pool.find((i) => i.instanceName === instanceName);
  }

  async totalInstances() {
    return this.pool.length;
  }

  async closeAll() {
    await Promise.all(this.pool.map((i) => i.browser.close()));
    this.pool.length = 0;
  }
}
