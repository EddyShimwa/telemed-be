import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ApiResponseDecorator } from './common/decorators/apiResponse.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Welcome' })
  @ApiResponseDecorator()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
