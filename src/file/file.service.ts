import { FileModel } from './file.model';
import { connection } from '../app/database/mysql';

/**
 * 存储文件信息
 */
export const createFile = async (file: FileModel) => {
  const sql = `
    insert into file
    set ?
  `;

  const [data] = await connection.promise().query(sql, file);
  return data;
};

/**
 * 按 ID 查找文件
 */
export const findFileById = async (fileId: number) => {
  const sql = `
    select * from file
    where id = ?
  `;

  const [data] = await connection.promise().query(sql, fileId);

  return data[0];
};
