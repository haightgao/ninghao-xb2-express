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
 * 按用户名查找用户
 */
export const getUserByName = async (name: string) => {
  const sql = `
    select id,name
    from user
    where name = ?
  `;

  const [data] = await connection.promise().query(sql, name);
  return (data as object[])[0];
};
