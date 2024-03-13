import { Inject } from '@nestjs/common';
import { PUPPETEER_CORE } from './puppeteer.constants';

export const InjectCore = () => Inject(PUPPETEER_CORE);
