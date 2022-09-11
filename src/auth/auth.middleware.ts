import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userService from '../user/user.service';
import { PUBLIC_KEY } from '../app/app.config';
import { TokenPayload } from './auth.interface';
import { possess } from './auth.service';

/**
 * 验证用户登录
 */
export const validateLoginData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, password } = req.body;

  if (!name) return next(new Error('NAME_IS_REQUIRED'));

  if (!password) return next(new Error('PASSWORD_IS_REQUIRED'));

  const user = await userService.getUserByName(name, { password: true });

  if (!user) return next(new Error('USER_DOES_NOT_EXIST'));

  const matched = await bcrypt.compare(password, user.password as string);
  if (!matched) return next(new Error('PASSWORD_DOES_NOT_MATCH'));

  // 在请求主体中添加用户
  req.body.user = user;

  next();
};

/**
 * 验证用户身份
 */
export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  // try {
  //   // 提前 Authorization
  //   const authorization = req.header('Authorization');
  //   if (!authorization) throw new Error();

  //   // 提前 jwt 令牌
  //   const token = authorization.replace('Bearer ', '');
  //   if (!token) throw new Error();

  //   // 验证令牌
  //   const decoded = jwt.verify(token, PUBLIC_KEY as string, {
  //     algorithms: ['RS256'],
  //   });

  //   // 请求里添加当前用户
  //   req.user = decoded as TokenPayload;

  //   next();
  // } catch (error) {
  //   next(new Error('UNAUTHORIZED'));
  // }

  if (req.user.id) {
    next();
  } else {
    next(new Error('UNAUTHORIZED'));
  }
};

/**
 * 访问控制 放在 authGuard中间件 后面
 */
interface AccessControlOptions {
  possession?: boolean;
}

export const accessControl = (options: AccessControlOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log('访问控制');

    const { possession } = options;

    const { id: userId } = req.user;

    if (userId == 1) return next();

    if (userId) {
      const resourceIdParam = Object.keys(req.params)[0];
      const resourceType = resourceIdParam.replace('Id', '');
      const resourceId = parseInt(req.params[resourceIdParam], 10);

      if (possession && resourceId) {
        try {
          const ownResource = await possess({
            resourceId,
            resourceType,
            userId: userId.toString(),
          });

          if (!ownResource) {
            return next(new Error('USER_DOES_NOT_OWN_RESOURCE'));
          }
          next();
        } catch (error) {
          return next(error);
        }
      }
    }
  };
};

/**
 * 当前用户
 */
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let user: TokenPayload = {
    id: null,
    name: 'anonymous',
  };

  try {
    // 提前 Authorization
    const authorization = req.header('Authorization');

    // 提前 jwt 令牌
    const token = authorization.replace('Bearer ', '');

    if (token) {
      // 验证令牌
      const decoded = jwt.verify(token, PUBLIC_KEY as string, {
        algorithms: ['RS256'],
      });

      // 请求里添加当前用户
      user = decoded as TokenPayload;
    }
  } catch (error) {}

  req.user = user;

  next();
};
