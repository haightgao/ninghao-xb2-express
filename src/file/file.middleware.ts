import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import Jimp from 'jimp';
import { imageResize } from './file.service';

/**
 * 文件过滤器
 */
export const fileFilter = (fileTypes: Array<string>) => {
  return (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    // 测试文件类型
    const allowed = fileTypes.some((type) => type === file.mimetype);

    if (allowed) {
      // 允许上传
      callback(null, true);
    } else {
      callback(new Error('FILE_TYPE_NOT_ACCEPT'));
    }
  };
};

const fileUploadFilter = fileFilter(['image/png', 'image/jpg', 'image/jpeg']);

/**
 * 创建一个 Multer
 */
const fileUpload = multer({
  dest: 'upload/',
  fileFilter: fileUploadFilter,
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
