import path from 'path';
import Jimp from 'jimp';
import { FileModel } from './file.model';
import { connection } from '../app/database/mysql';

/**
 * 存储文件信息
 */
export const createFile = async (file: FileModel) => {
  const sql = `
    insert into file
    set ?
  `;

  const [data] = await connection.promise().query(sql, file);
  return data;
};

/**
 * 按 ID 查找文件
 */
export const findFileById = async (fileId: number) => {
  const sql = `
    select * from file
    where id = ?
  `;

  const [data] = await connection.promise().query(sql, fileId);

  return data[0];
};

/**
 * 调整图像尺寸
 */
export const imageResize = async (image: Jimp, file: Express.Multer.File) => {
  console.log('调整图像尺寸');
  // 图像尺寸
  const { imageSize } = image['_exif'];
  console.log('imageSize', imageSize);

  // 文件路径
  const filePath = path.join(file.destination, 'resized', file.filename);
  console.log('filePath', filePath);

  // 大尺寸
  if ((imageSize as any).width > 1280) {
    console.log('大尺寸');
    image.resize(1280, Jimp.AUTO).quality(85).write(`${filePath}-large`);
  }

  // 中等尺寸
  if ((imageSize as any).width > 640) {
    console.log('中等尺寸');
    image.resize(640, Jimp.AUTO).quality(85).write(`${filePath}-medium`);
  }

  // 缩略图
  if ((imageSize as any).width > 320) {
    console.log('缩略图');
    image.resize(320, Jimp.AUTO).quality(85).write(`${filePath}-thumbnail`);
  }
};
