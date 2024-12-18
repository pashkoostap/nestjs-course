import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileResponseDto } from './files.dto';
import { FilesService } from './files.service';
import { MFile } from './mfile';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('files'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileResponseDto[]> {
    const filesToSave: MFile[] = [new MFile(file)];

    if (file.mimetype.includes('image')) {
      const buffer = await this.filesService.convertToWebp(file.buffer);

      filesToSave.push(
        new MFile({
          originalname: file.originalname.split('.')[0] + '.webp',
          buffer,
        }),
      );
    }

    return this.filesService.saveFiles(filesToSave);
  }
}
