import { Request } from 'express';
import { promises as fs } from 'fs';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export default class FileHelper {
  static async fileGenerator(
    request: Request,
    cwd: string,
    file: Express.Multer.File,
  ) {
    const fileId = uuidv4().slice(0, 8) + extname(file.originalname);

    const filePath = join(cwd, fileId);
    await fs.mkdir(cwd, { recursive: true });
    const fileBuffer = await fs.readFile(file.path);
    await fs.writeFile(filePath, fileBuffer);

    const baseUrl = `${request.protocol}://${request.get('host')}`;

    return { baseUrl, fileId };
  }
}
