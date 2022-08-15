import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import Jimp from 'jimp';
import { imageResize } from './file.service';

const fileUpload = multer({
  dest: 'uploads/',
});

/**
 * 单文件拦截器
 */
export const fileInterceptor = fileUpload.single('file');

/**
 * 文件处理器
 */
export const fileProcessor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('文件处理器');
  const { path } = req.file;

  let image: Jimp;

  try {
    // 读取图像文件
    image = await Jimp.read(path);
  } catch (error) {
    console.log('error', error);
    return next(error);
  }

  // 准备文件数据
  const { imageSize, tags } = image['_exif'];

  req.fileMetaData = {
    width: imageSize.width,
    height: imageSize.height,
    metadata: JSON.stringify(tags),
  };

  // 调整图像尺寸
  imageResize(image, req.file);

  next();
};
