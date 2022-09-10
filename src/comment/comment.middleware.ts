import { Request, Response, NextFunction } from 'express';

/**
 * 过滤器
 */
export const filter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { post, user, action } = req.query;

  // 默认过滤器
  req.filter = {
    name: 'default',
    sql: 'comment.parentId IS NULL',
  };

  // 内容的评论
  if (post && !user && !action) {
    req.filter = {
      name: 'postComments',
      sql: 'comment.parentId IS NULL AND comment.postId = ?',
      param: post as string,
    };
  }

  // 用户的评论
  if (user && !post && action == 'published') {
    req.filter = {
      name: 'uesrPublished',
      sql: 'comment.parentId IS NULL AND comment.userId = ?',
      param: user as string,
    };
  }

  // 用户的回复
  if (user && !post && action == 'replied') {
    req.filter = {
      name: 'uesrReplied',
      sql: 'comment.parentId IS NOT NULL AND comment.userId = ?',
      param: user as string,
    };
  }

  next();
};
