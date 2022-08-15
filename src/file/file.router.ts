import { fileInterceptor } from './file.middleware';
import { authGuard } from './../auth/auth.middleware';
import express from 'express';
import * as fileController from './file.controller';

const router = express.Router();

/**
 * 上传文件
 */
router.post('/files', authGuard, fileInterceptor, fileController.store);

/**
 * 文件服务
 */
router.get('/files/:fileId/serve', fileController.serve);

export default router;
