import { Injectable } from '@nestjs/common';
import { FileResponseDto } from './files.dto';
import { format } from 'date-fns';
import { path as appRootPath } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as path from 'node:path';
import { MFile } from './mfile';
import * as sharp from 'sharp';

@Injectable()
export class FilesService {
  async saveFiles(files: MFile[]): Promise<FileResponseDto[]> {
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${appRootPath}/.uploads/${dateFolder}`;

    await ensureDir(uploadFolder);

    const res: FileResponseDto[] = [];

    for (const file of files) {
      await writeFile(path.join(uploadFolder, file.originalname), file.buffer);

      res.push({
        url: path.join(uploadFolder, file.originalname),
        name: file.originalname,
      });
    }

    return res;
  }

  async convertToWebp(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }
}
