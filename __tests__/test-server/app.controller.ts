import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getTitleOfPage(@Query('url') url: string) {
    return this.appService.getTitleOfPage(url);
  }
}
