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
interface GetUserOptions {
  password?: boolean;
}

export const getUserByName = async (
  name: string,
  options: GetUserOptions = {},
): Promise<UserModel> => {
  const { password } = options;
  const sql = `
    select id,name ${password ? ', password' : ''}
    from user
    where name = ?
  `;

  const [data] = await connection.promise().query(sql, name);
  return (data as object[])[0];
};
