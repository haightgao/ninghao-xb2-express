import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { createAvatar, findAvatarByUserId } from './avatar.service';

/**
 * 上传头像
 */
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id: userId } = req.user;

  // 头像文件信息
  const fileInfo = _.pick(req.file, ['mimetype', 'filename', 'size']);

  const avatar = {
    ...fileInfo,
    userId,
  };

  try {
    const data = await createAvatar(avatar);
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 按用户Id查找头像
 */
export const serve = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;

  try {
    const avatar = await findAvatarByUserId(parseInt(userId, 10));

    if (!avatar) {
      throw new Error('FILE_NOT_FOUND');
    }
    console.log(avatar);

    const { size } = req.query;

    let filename = avatar.filename;
    let root = path.join('upload', 'avatar');
    let resized = 'resized';

    if (size) {
      const imageSizes = ['large', 'medium', 'small'];
      if (!imageSizes.some((item) => item == size)) {
        throw new Error('FILE_NOT_FOUND');
      }

      const fileExist = fs.existsSync(
        path.join(root, resized, `${filename}-${size}`),
      );

      if (!fileExist) {
        throw new Error('FILE_NOT_FOUND');
      }

      if (fileExist) {
        filename = `${filename}-${size}`;
        root = path.join(root, resized);
      }
    }

    res.sendFile(filename, {
      root,
      headers: {
        'Content-Type': avatar.mimetype,
      },
    });
  } catch (error) {
    next(error);
  }
};
