import { getPool } from '../db/mysql.js';

export const findAll = async () => {
  const [rows] =
    await getPool().query(
      'SELECT * FROM items'
    );

  return rows;
};

export const findById = async id => {
  const [rows] =
    await getPool().query(
      'SELECT * FROM items WHERE id = ?',
      [id]
    );

  return rows[0] || null;
};

export const create = async item => {
  const [result] =
    await getPool().query(
      `
      INSERT INTO items
      (name, role, category, image)
      VALUES (?, ?, ?, ?)
      `,
      [
        item.name,
        item.role,
        item.category || '',
        item.image || ''
      ]
    );

  return findById(
    result.insertId
  );
};

export const update = async (
  id,
  item
) => {
  await getPool().query(
    `
    UPDATE items
    SET name=?, role=?, category=?, image=?
    WHERE id=?
    `,
    [
      item.name,
      item.role,
      item.category || '',
      item.image || '',
      id
    ]
  );

  return findById(id);
};

export const remove = async id => {
  const [result] =
    await getPool().query(
      'DELETE FROM items WHERE id=?',
      [id]
    );

  return result.affectedRows > 0;
};