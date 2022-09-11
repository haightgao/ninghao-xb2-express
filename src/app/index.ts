import express from 'express';
import cors from 'cors';
import postRouter from '../post/post.router';
import userRouter from '../user/user.router';
import authRouter from '../auth/auth.router';
import fileRouter from '../file/file.router';
import tagRouter from '../tags/tag.router';
import commentRouter from '../comment/comment.router';
import avatarRouter from '../avatar/avatar.router';
import likeRouter from '../like/like.router';
import appRouter from './app.router';
import { defaultErrorHandler } from './app.middleware';
import { currentUser } from './../auth/auth.middleware';

/**
 * 创建应用
 */
const app = express();

/**
 * 跨与处理
 */
app.use(
  cors({
    origin: '*',
    exposedHeaders: 'X-Total-Count',
  }),
);

/**
 * 当前用户
 */
app.use(currentUser);

/**
 * 处理 JSON
 */
app.use(express.json());

/**
 * 应用路由
 */
app.use(
  appRouter,
  postRouter,
  userRouter,
  authRouter,
  fileRouter,
  tagRouter,
  commentRouter,
  avatarRouter,
  likeRouter,
);

/**
 * 默认异常处理器
 */
app.use(defaultErrorHandler);

/**
 * 导出应用
 */
export default app;
