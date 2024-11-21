import { Request } from 'express';
import { extname } from 'path';

// File filter for images and videos
export const fileFilter = (_req: Request, file, callback) => {
  const ext = extname(file.originalname).toLowerCase();
  const allowedImageExts = [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.webp',
    '.bmp',
    '.tiff',
    '.jfif',
    '.tif',
  ];
  const allowedVideoExts = [
    '.mp4',
    '.avi',
    '.mov',
    '.wmv',
    '.flv',
    '.mkv',
    '.webm',
    '.mpeg',
  ];

  if (![...allowedImageExts, ...allowedVideoExts].includes(ext)) {
    return callback(new Error('Only image and video files are allowed'), false);
  }

  callback(null, true);
};
