import type { BrowserContext } from 'puppeteer';
import { getContextToken, getPageToken } from './common';

export function createPuppeteerProviders(
  instanceName?: string,
  pages: string[] = [],
) {
  return pages.map((page) => ({
    provide: getPageToken(page),
    useFactory: (context: BrowserContext) => context.newPage(),
    inject: [getContextToken(instanceName)],
  }));
}
