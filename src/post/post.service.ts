import { PostModel } from './post.model';
import { connection } from '../app/database/mysql';
/**
 * 内容列表
 */
export const getPosts = async () => {
  const sql = `
    select 
      post.id,
      post.title,
      post.content,
      JSON_OBJECT(
        'id', user.id,
        'name', user.name
      ) as user
    from post
    left join user on post.userId = user.id
  `;

  const [data] = await connection.promise().query(sql);

  return data;
};

/**
 * 创建内容
 */

export const createPost = async (post: PostModel) => {
  const sql = `
    insert into post
    set ?
  `;

  const [data] = await connection.promise().query(sql, post);

  return data;
};

/**
 * 更新内容
 */
export const updatePost = async (postId: number, post: PostModel) => {
  const sql = `
    update post
    set ?
    where id = ?
  `;

  const [data] = await connection.promise().query(sql, [post, postId]);

  return data;
};

/**
 * 删除内容
 * @param postId
 * @returns
 */
export const deletePost = async (postId: number) => {
  const sql = `
    delete from post
    where id = ?
  `;

  const [data] = await connection.promise().query(sql, postId);

  return data;
};
