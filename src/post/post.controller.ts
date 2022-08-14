import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { getPosts, createPost, updatePost, deletePost } from './post.service';

/**
 * 内容列表
 */

export const index = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getPosts();
    res.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 创建内容
 */

export const store = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, content } = req.body;

    const data = await createPost({ title, content });
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新内容
 */

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  const post = _.pick(req.body, ['title', 'content']);

  try {
    const data = await updatePost(parseInt(id, 10), post);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除内容
 */
export const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params;
    const data = await deletePost(parseInt(postId, 10));
    res.send(data);
  } catch (error) {
    next(error);
  }
};
