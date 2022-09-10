import { connection } from '../app/database/mysql';
import { AvatarModel } from './avatar.model';

/**
 * 保存头像文件信息
 */
export const createAvatar = async (avatar: AvatarModel) => {
  const statement = `
    INSERT INTO avatar
    SET ?
  `;

  const [data] = await connection.promise().query(statement, avatar);

  return data;
};

/**
 * 按用户Id查找头像
 */
export const findAvatarByUserId = async (userId: number) => {
  const statement = `
    SELECT *
    FrOM avatar
    WHERE userId = ?
    ORDER BY avatar.id DESC
    limit 1
  `;

  const [data] = await connection.promise().query(statement, userId);
  return data[0];
};
