import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import * as userService from '../user/user.service';

/**
 * 验证用户登录
 */
export const validateLoginData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('验证用户数据');
  const { name, password } = req.body;

  if (!name) return next(new Error('NAME_IS_REQUIRED'));

  if (!password) return next(new Error('PASSWORD_IS_REQUIRED'));

  const user = await userService.getUserByName(name, { password: true });

  if (!user) return next(new Error('USER_DOES_NOT_EXIST'));

  const matched = await bcrypt.compare(password, user.password as string);
  if (!matched) return next(new Error('PASSWORD_DOES_NOT_MATCH'));

  next();
};
