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

/**
 * 检查用户是否拥有指定资源
 */
interface PossessOptions {
  resourceId: number;
  resourceType: string;
  userId: string;
}

export const possess = async (options: PossessOptions) => {
  const { resourceId, resourceType, userId } = options;

  const sql = `
    select count(${resourceType}.id) as count
    from ${resourceType}
    where ${resourceType}.id = ? and userId = ?
  `;

  const [data] = await connection.promise().query(sql, [resourceId, userId]);

  return (data as any[])[0]['count'] ? true : false;
};
