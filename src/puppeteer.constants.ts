import { PuppeteerLaunchOptions } from 'puppeteer';

export const PUPPETEER_MODULE_OPTIONS = 'PUPPETEER_MODULE_OPTIONS';
export const PUPPETEER_CORE = 'PUPPETEER_CORE';

const args: PuppeteerLaunchOptions['args'] = [
  '--allow-insecure-localhost', // Enables TLS/SSL errors on localhost to be ignored (no interstitial, no blocking of requests).
  '--allow-http-screen-capture', // Allow non-secure origins to use the screen capture API and the desktopCapture extension API.
  '--no-zygote', // https://codereview.chromium.org/2384163002
];
// add --no-sandbox when running on Linux, required with --no-zygote
if (typeof process.getuid === 'function') {
  args.push('--no-sandbox');
}

export const DEFAULT_CHROME_LAUNCH_OPTIONS: PuppeteerLaunchOptions = {
  headless: false,
  pipe: process.platform !== 'win32',
  args,
};
