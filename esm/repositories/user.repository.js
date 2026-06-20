import { writeAtomic } from '../utils/writeAtomic.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const itemsDir = path.join(__dirname, '../data/items');

export const init = async () => {
  await fs.mkdir(itemsDir, { recursive: true });
};

export const findAll = async () => {
  const files = await fs.readdir(itemsDir);

  const users = [];

  for (const file of files) {
    if (!file.endsWith('.json')) continue;

    const filePath = path.join(itemsDir, file);
    const content = await fs.readFile(filePath, 'utf8');

    users.push(JSON.parse(content));
  }

  return users;
};

export const findById = async (id) => {
  try {
    const filePath = path.join(itemsDir, `${id}.json`);

    const content = await fs.readFile(filePath, 'utf8');

    return JSON.parse(content);
  } catch {
    return null;
  }
};

export const create = async (userData) => {
  const users = await findAll();

  const nextId =
    users.length > 0
      ? Math.max(...users.map(u => u.id)) + 1
      : 1;

  const user = {
    id: nextId,
    ...userData
  };

  const filePath = path.join(itemsDir, `${nextId}.json`);

  await writeAtomic(filePath, user);

  return user;
};

export const update = async (id, userData) => {
  const existingUser = await findById(id);

  if (!existingUser) {
    return null;
  }

  const updatedUser = {
    ...existingUser,
    ...userData,
    id: Number(id)
  };

  const filePath = path.join(itemsDir, `${id}.json`);

  await writeAtomic(filePath, updatedUser);

  return updatedUser;
};

export const remove = async (id) => {
  try {
    const filePath = path.join(itemsDir, `${id}.json`);

    await fs.unlink(filePath);

    return true;
  } catch {
    return false;
  }
};

export const setImage = async (id, imagePath) => {
  const user = await findById(id);

  if (!user) {
    return null;
  }

  user.image = imagePath;

  const filePath = path.join(itemsDir, `${id}.json`);

  await writeAtomic(filePath, user);

  return user;
};