import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const itemsDir = path.join(__dirname, '../data/items');
const backupsDir = path.join(__dirname, '../data/backups');

export const createBackup = async () => {
  const timestamp = Date.now();

  const currentBackupDir =
    path.join(backupsDir, String(timestamp));

  await fs.mkdir(currentBackupDir, {
    recursive: true
  });

  const files = await fs.readdir(itemsDir);

  for (const file of files) {
    if (!file.endsWith('.json')) continue;

    await fs.copyFile(
      path.join(itemsDir, file),
      path.join(currentBackupDir, file)
    );
  }

  const backups = await fs.readdir(backupsDir);

  const sorted = backups
    .filter(dir => /^\d+$/.test(dir))
    .sort((a, b) => Number(a) - Number(b));

  while (sorted.length > 5) {
    const oldest = sorted.shift();

    await fs.rm(
      path.join(backupsDir, oldest),
      {
        recursive: true,
        force: true
      }
    );
  }
};