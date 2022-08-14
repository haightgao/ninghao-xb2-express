import { Request, Response, NextFunction } from 'express';
import { getPosts } from './post.service';

/**
 * 内容列表
 */

export const index = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization !== 'SECRET') {
    return next(new Error());
  }
  const data = getPosts();
  res.send(data);
};
