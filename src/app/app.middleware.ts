import { Request, Response, NextFunction, response } from 'express';

/**
 * 输出请求地址
 */
export const requestUrl = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.url);
  next();
};

/**
 * 默认异常处理器
 */
export const defaultErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: number, message: string;

  message = '';
  /**
   * 处理异常
   */
  switch (message) {
    default:
      statusCode = 500;
      message = '服务出现了问题 ~~';
      break;
  }

  res.status(statusCode).send({ message });
};
