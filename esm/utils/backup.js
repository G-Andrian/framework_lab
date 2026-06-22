import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const itemsDir = path.join(__dirname, '../data/items');
const backupsDir = path.join(__dirname, '../data/backups');

export const createBackup = async () => {
  await fsp.mkdir(backupsDir, {
    recursive: true
  });

  const timestamp = Date.now();

  const backupFile =
    path.join(
      backupsDir,
      `${timestamp}.gz`
    );

  const files =
    await fsp.readdir(itemsDir);

  let content = '';

  for (const file of files) {
    if (!file.endsWith('.json')) {
      continue;
    }

    const data =
      await fsp.readFile(
        path.join(itemsDir, file),
        'utf8'
      );

    content += data + '\n';
  }

  await fsp.writeFile(
    path.join(backupsDir, 'temp.json'),
    content
  );

  await pipeline(
    fs.createReadStream(
      path.join(backupsDir, 'temp.json')
    ),
    createGzip(),
    fs.createWriteStream(
      backupFile
    )
  );

  await fsp.unlink(
    path.join(backupsDir, 'temp.json')
  );

  const backups =
    await fsp.readdir(backupsDir);

  const sorted = backups
    .filter(file =>
      file.endsWith('.gz')
    )
    .sort();

  while (sorted.length > 5) {
    const oldest =
      sorted.shift();

    await fsp.unlink(
      path.join(
        backupsDir,
        oldest
      )
    );
  }
};