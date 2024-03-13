import { Browser } from 'puppeteer';

export interface PuppeteerInstance {
  instanceName: string;
  browser: Browser;
}
