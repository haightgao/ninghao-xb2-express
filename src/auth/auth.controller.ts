import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

/**
 * 用户登录
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, password } = req.body;

  res.send({ message: name });
};
