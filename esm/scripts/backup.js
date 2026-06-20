import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const itemsDir = path.join(__dirname, '../data/items');
const backupsDir = path.join(__dirname, '../data/backups');

await fs.mkdir(backupsDir, { recursive: true });

const files = await fs.readdir(itemsDir);

const backup = [];

for (const file of files) {
  if (!file.endsWith('.json')) continue;

  const content = await fs.readFile(
    path.join(itemsDir, file),
    'utf8'
  );

  backup.push(JSON.parse(content));
}

const timestamp = Date.now();

await fs.writeFile(
  path.join(backupsDir, `backup-${timestamp}.json`),
  JSON.stringify(backup, null, 2)
);

console.log('Backup created');