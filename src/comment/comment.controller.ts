import { Request, Response, NextFunction } from 'express';
import {
  createComment,
  deleteComment,
  isReplyComment,
  updateComment,
  getComments,
  getCommentsTotalCount,
  getCommentReplies,
} from './comment.service';

/**
 * 发表评论
 */
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id: userId } = req.user;
  const { content, postId } = req.body;

  const comment = {
    content,
    postId,
    userId,
  };

  try {
    const data = await createComment(comment);

    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 回复评论
 */
export const reply = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { commentId } = req.params;
  const parentId = parseInt(commentId, 10);
  const { id: userId } = req.user;
  const { content, postId } = req.body;

  const comment = {
    content,
    postId,
    userId,
    parentId,
  };

  try {
    const reply = await isReplyComment(parentId);
    if (reply) return next(new Error('UNABLE_TO_REPLY_THIS_COMMENT'));
  } catch (error) {
    next(error);
  }

  try {
    const data = await createComment(comment);
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 修改评论
 */
export const upate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { commentId } = req.params;
  const { content } = req.body;

  const comment = {
    id: parseInt(commentId, 10),
    content,
  };

  try {
    const data = await updateComment(comment);

    res.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除评论
 */
export const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { commentId } = req.params;

  try {
    const data = await deleteComment(parseInt(commentId, 10));

    res.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 评论列表
 */
export const index = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const totalCount = await getCommentsTotalCount({
      filter: req.filter,
    });

    res.header('X-Total-Count', totalCount);
  } catch (error) {
    next(error);
  }

  try {
    const data = await getComments({
      filter: req.filter,
      pagigation: req.pagination,
    });
    res.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 评论回复列表
 */
export const indexReplies = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { commentId } = req.params;

  try {
    const replies = await getCommentReplies({
      commentId: parseInt(commentId, 10),
    });

    res.send(replies);
  } catch (error) {
    next(error);
  }
};
