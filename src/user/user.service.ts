import { connection } from '../app/database/mysql';
import { UserModel } from './user.model';

/**
 * 创建用户
 */
export const createUser = async (user: UserModel) => {
  const sql = `
    insert into user
    set ?
  `;

  const [data] = await connection.promise().query(sql, user);

  return data;
};

/**
 * 查找用户
 */
interface GetUserOptions {
  password?: boolean;
}

export const getUser = (condition: string) => {
  return async (
    param: string | number,
    options: GetUserOptions = {},
  ): Promise<UserModel> => {
    const { password } = options;
    const sql = `
      select 
        user.id,
        user.name,
        IF (
          COUNT(avatar.id),1,NULL
        ) as avatar
        ${password ? ', password' : ''}
      from 
        user
      LEFT JOIN avatar
          ON avatar.userId = user.Id
      where 
        ${condition} = ?
    `;

    const [data] = await connection.promise().query(sql, param);

    return data[0].id ? data[0] : null;
  };
};

/**
 * 按用户名查找用户
 */

export const getUserByName = getUser('user.name');

/**
 * 按用户Id查找用户
 */
export const getUserById = getUser('user.id');

/**
 * 更新用户
 */
export const updateUser = async (userId: number, userData: UserModel) => {
  const statement = `
    UPDATE user
    SET ?
    WHERE user.id = ?
  `;

  const params = [userData, userId];

  const [data] = await connection.promise().query(statement, params);

  return data;
};
