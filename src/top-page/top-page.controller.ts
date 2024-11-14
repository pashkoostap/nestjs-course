import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TopPageModel } from './top-page.model';
import { FindTopPageDto } from './top-page.dto';
import { ConfigService } from '@nestjs/config';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly configService: ConfigService) {}
  @Post('create')
  async create(@Body() dto: Omit<TopPageModel, '_id'>) {}

  @Get(':id')
  async get(@Param('id') id: string) {
    console.log(this.configService.get('TEST'));
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {}

  @Patch(':id')
  async path(@Param('id') id: string, @Body() dto: TopPageModel) {}

  @Post()
  @HttpCode(200)
  async find(@Body() dto: FindTopPageDto) {}
}
