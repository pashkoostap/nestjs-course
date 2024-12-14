import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TopPageSearchQueryParams } from './top-page.model';
import { CreateTopPageDto, FindTopPageDto } from './top-page.dto';
import { ConfigService } from '@nestjs/config';
import { ObjectIdValidationPipe } from 'src/pipes/object-id.validation.pipe';
import { TopPageService } from './top-page.service';
import { TOP_PAGE_NOT_FOUND_ERROR } from './top-page.constants';

@Controller('top-page')
export class TopPageController {
  constructor(
    private readonly configService: ConfigService,
    private readonly topPageService: TopPageService,
  ) {}

  @Post('create')
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @Get(':id')
  async get(@Param('id', ObjectIdValidationPipe) id: string) {
    const topPage = await this.topPageService.findById(id);

    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }

    return topPage;
  }

  @Delete(':id')
  async delete(@Param('id', ObjectIdValidationPipe) id: string) {
    const deleted = await this.topPageService.deleteById(id);

    if (!deleted) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }

    return deleted;
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async path(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    const updated = await this.topPageService.update(id, dto);

    if (!updated) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }

    return updated;
  }

  @Get('alias/:alias')
  async findByAlias(@Param('alias') alias: string) {
    const found = await this.topPageService.findByAlias(alias);

    if (!found) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }

    return found;
  }

  @Post('find')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async findByCategory(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByCategory(dto.firstCategory);
  }

  @Get('search')
  async search(@Query() { search }: TopPageSearchQueryParams) {
    return this.topPageService.findByText(search);
  }
}
