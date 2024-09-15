import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/') //porta um
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/') //porta dois
  getHello(): string {
    return this.appService.getHello();
  }
}
