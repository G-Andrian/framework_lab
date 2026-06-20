import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeAtomic } from '../utils/writeAtomic.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const itemsDir = path.join(__dirname, '../data/items');

const items = [
  {
    id: 1,
    name: 'Keyboard',
    role: 'inventory',
    category: 'hardware'
  },
  {
    id: 2,
    name: 'Mouse',
    role: 'inventory',
    category: 'hardware'
  },
  {
    id: 3,
    name: 'Monitor',
    role: 'inventory',
    category: 'electronics'
  }
];

for (const item of items) {
  await writeAtomic(
    path.join(itemsDir, `${item.id}.json`),
    item
  );
}

console.log('Seed completed');