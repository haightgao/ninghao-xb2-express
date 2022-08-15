import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const fileUpload = multer({
  dest: 'uploads/',
});

/**
 * 单文件拦截器
 */
export const fileInterceptor = fileUpload.single('file');
