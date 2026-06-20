import fs from 'node:fs/promises';
import path from 'node:path';

export const writeAtomic = async (filePath, data) => {
  const tmpPath = `${filePath}.tmp`;

  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    await fs.writeFile(
      tmpPath,
      JSON.stringify(data, null, 2),
      'utf8'
    );

    await fs.rename(tmpPath, filePath);
  } catch (error) {
    try {
      await fs.unlink(tmpPath);
    } catch {
    }

    throw error;
  }
};