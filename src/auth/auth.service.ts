import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../app/app.config';
import { connection } from '../app/database/mysql';

/**
 * 签发令牌
 */
interface SignTokenOptions {
  payload?: any;
}

export const signToken = (options: SignTokenOptions) => {
  const { payload } = options;
  // 签发令牌
  const token = jwt.sign(payload, PRIVATE_KEY as string, {
    algorithm: 'RS256',
  });

  return token;
};
