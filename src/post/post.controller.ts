import { deletePostFiles, getPostFiles } from './../file/file.service';
import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  createPostTag,
  postHasTag,
  deletePostTag,
  getPostsTotalCount,
  getPostById,
} from './post.service';
import { TagModel } from '../tags/tag.model';
import { getTagByName, createTag } from '../tags/tag.service';

/**
 * 内容列表
 */

export const index = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const totalCount = await getPostsTotalCount({ filter: req.filter });
    res.header('X-Total-Count', totalCount);
  } catch (error) {
    next(error);
  }

  try {
    const data = await getPosts({
      sort: req.sort,
      filter: req.filter,
      pagination: req.pagination,
      currentUser: req.user,
    });
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
    const { id: userId } = req.user;

    const data = await createPost({ title, content, userId });
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
  const { postId } = req.params;

  const post = _.pick(req.body, ['title', 'content']);

  try {
    const data = await updatePost(parseInt(postId, 10), post);
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
  const { postId } = req.params;

  try {
    const files = await getPostFiles(parseInt(postId, 10));

    if (files.length) {
      await deletePostFiles(files);
    }

    const data = await deletePost(parseInt(postId, 10));
    res.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 添加内容标签
 */
export const storePostTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { postId } = req.params;
  const { name } = req.body;

  let tag: TagModel;

  try {
    tag = await getTagByName(name);
  } catch (error) {
    return next(error);
  }

  if (tag) {
    try {
      const postTag = await postHasTag(parseInt(postId, 10), tag.id);

      if (postTag) {
        return next(new Error('POST_ALREADY_HAS_THIS_TAG'));
      }
    } catch (error) {
      return next(error);
    }
  }

  if (!tag) {
    try {
      const data = await createTag({ name });
      tag = { id: data.insertId };
    } catch (error) {
      return next(error);
    }
  }

  try {
    await createPostTag(parseInt(postId, 10), tag.id);
    res.sendStatus(201);
  } catch (error) {
    return next(error);
  }
};

/**
 * 移除内容标签
 */
export const destroyPostTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { postId } = req.params;
  const { tagId } = req.body;

  try {
    await deletePostTag(parseInt(postId, 10), tagId);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

/**
 * 单个内容
 */
export const show = async (req: Request, res: Response, next: NextFunction) => {
  const { postId } = req.params;

  try {
    const post = await getPostById(parseInt(postId, 10), {
      currentUser: req.user,
    });
    res.send(post);
  } catch (error) {
    next(error);
  }
};
