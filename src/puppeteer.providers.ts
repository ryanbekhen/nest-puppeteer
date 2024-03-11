import { Browser } from 'puppeteer';
import { getBrowserToken, getPageToken } from './common';

export function createPuppeteerProviders(
  pages: string[] = [],
  instanceName?: string,
) {
  return (pages || []).map((page) => ({
    inject: [getBrowserToken(instanceName)],
    provide: getPageToken(page),
    useFactory: async (browser: Browser) => {
      return await browser.newPage();
    },
  }));
}
