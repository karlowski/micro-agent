import { promises as fs } from 'fs';
import path from 'path';

export const getFileName = (filename: string, extension: string): string => {
  const sanitizedExtension = extension.startsWith('.')
    ? extension
    : `.${extension}`;

  return `${filename}${sanitizedExtension}`;
}

export const resolveDestination = async (destination: string): Promise<string> => {
  const baseStoragePath = process.env.STORAGE_PATH;

  if (!baseStoragePath) {
    throw new Error('Missing STORAGE_PATH in .env');
  }

  const targetDirectory = path.resolve(baseStoragePath, destination);

  try {
    const stat = await fs.stat(targetDirectory);

    if (!stat.isDirectory()) {
      throw new Error(`Destination is not a directory: ${targetDirectory}`);
    }
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(targetDirectory, { recursive: true });

      return targetDirectory;
    }

    throw error;
  }

  return targetDirectory;
}

export const resolveFilePath = async (filename: string, destination: string): Promise<string> => {
  const filePath = path.join(destination, filename);

  try {
    await fs.access(filePath);

    throw new Error(`File already exists: ${filename}`);
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  return filePath;
}
