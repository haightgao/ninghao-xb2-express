import { authGuard } from './../auth/auth.middleware';
import express from 'express';
import {
  validateUserData,
  hashPassword,
  validateUpdateUserData,
} from './user.middleware';
import * as userController from './user.controller';

const router = express.Router();

/**
 * 创建用户
 */
router.post('/users', validateUserData, hashPassword, userController.store);

/**
 * 用户账户
 */
router.get('/users/:userId', userController.show);

/**
 * 更新用户
 */
router.patch(
  '/users',
  authGuard,
  validateUpdateUserData,
  userController.update,
);

export default router;
