import { authGuard } from './../auth/auth.middleware';
import express from 'express';
import * as likesController from './like.controller';

const router = express.Router();

/**
 * 点赞内容
 */
router.post(
  '/posts/:postId/like',
  authGuard,
  likesController.storeUserLikePost,
);

/**
 * 取消点赞
 */
router.delete(
  '/posts/:postId/like',
  authGuard,
  likesController.destroyUserLikePost,
);

export default router;
