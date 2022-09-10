import { Request, Response, NextFunction } from 'express';

/**
 * 排序方式
 */
export const sort = async (req: Request, res: Response, next: NextFunction) => {
  const { sort } = req.query;

  let sqlSort: string;

  switch (sort) {
    case 'earliest':
      sqlSort = 'post.id ASC';
      break;
    case 'latest':
      sqlSort = 'post.id DESC';
      break;
    case 'most_comments':
      sqlSort = 'totalComments DESC, post.id DESC';
      break;
    default:
      sqlSort = 'post.id DESC';
      break;
  }

  req.sort = sqlSort;
  next();
};

/**
 * 过滤列表
 */
export const filter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { tag, user, action } = req.query;

  // 设置默认的过滤
  req.filter = {
    name: 'default',
    sql: 'post.id IS NOT NULL',
  };

  // 按标签名过滤
  if (tag && !user && !action) {
    req.filter = {
      name: 'tagName',
      sql: 'tag.name = ?',
      param: tag as string,
    };
  }

  // 过滤出用户发布的内容
  if (user && action == 'published' && !tag) {
    req.filter = {
      name: 'userPublished',
      sql: 'user.id = ?',
      param: user as string,
    };
  }

  next();
};
