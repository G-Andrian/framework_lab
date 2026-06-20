import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

import itemModel from '../models/item.model.js';
import { writeAtomic } from '../utils/writeAtomic.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const itemsDir = path.join(__dirname, '../data/items');
const versionFile = path.join(__dirname, '../data/version.json');

const currentHash = crypto
  .createHash('md5')
  .update(JSON.stringify(itemModel))
  .digest('hex');

let savedHash = null;

try {
  const versionData = JSON.parse(
    await fs.readFile(versionFile, 'utf8')
  );

  savedHash = versionData.hash;
} catch {
  savedHash = null;
}

if (savedHash !== currentHash) {
  const files = await fs.readdir(itemsDir);

  for (const file of files) {
    if (!file.endsWith('.json')) continue;

    const filePath = path.join(itemsDir, file);

    const item = JSON.parse(
      await fs.readFile(filePath, 'utf8')
    );

    const migrated = {
      ...itemModel,
      ...item
    };

    await writeAtomic(filePath, migrated);
  }

  await writeAtomic(versionFile, {
    hash: currentHash
  });

  console.log('Migration completed');
} else {
  console.log('Migration not required');
}