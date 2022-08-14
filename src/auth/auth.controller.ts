import { Request, Response, NextFunction, response } from 'express';
import * as authService from './auth.service';

/**
 * 用户登录
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    user: { id, name },
  } = req.body;

  const payload = { id, name };

  try {
    // 签发令牌
    const token = authService.signToken({ payload });

    res.send({ id, name, token });
  } catch (error) {
    next(error);
  }
};

/**
 * 验证登录
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  console.log('当前用户：', req.user);
  res.sendStatus(200);
};
