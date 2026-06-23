import { db } from '../db/drizzle.js';
import { items, users } from '../db/schema/items.js';
import { eq } from 'drizzle-orm';

export const findAll = async () => {
  return await db.select().from(items);
};

export const findById = async id => {
  const result = await db
    .select()
    .from(items)
    .where(eq(items.id, Number(id)));

  return result[0] || null;
};

export const create = async item => {
  const result = await db
    .insert(items)
    .values(item);

  return {
    id: result[0]?.insertId,
    ...item
  };
};

export const update = async (
  id,
  item
) => {
  await db
    .update(items)
    .set(item)
    .where(eq(items.id, Number(id)));

  return findById(id);
};

export const remove = async id => {
  await db
    .delete(items)
    .where(eq(items.id, Number(id)));

  return true;
};

export const findUserByEmail =
  async email => {
    const result =
      await db
        .select()
        .from(users)
        .where(
          eq(
            users.email,
            email
          )
        );

    return result[0] || null;
  };

export const createAuthUser =
  async user => {
    const result =
      await db
        .insert(users)
        .values(user);

    return {
      id: result[0]?.insertId,
      email: user.email
    };
  };