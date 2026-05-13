import { promises as fs } from 'fs';
import { tool } from '@langchain/core/tools';

import { getFileName, resolveDestination, resolveFilePath } from '../../../utils/file-writer.js';
import { ToolExecutionResponse } from '../types/tool.types.js';

interface WriteFileOptions {
  filename: string;
  extension: string;
  destination: string;
  content: string | Buffer;
}

export default async () => {
  return tool(
    async ({
      filename,
      extension,
      destination,
      content,
    }: WriteFileOptions): Promise<ToolExecutionResponse> => {
      let filePath = '';
      try {
        const filenameFull = getFileName(filename, extension);
        const targetDestination = await resolveDestination(destination);
        filePath = await resolveFilePath(filenameFull, targetDestination);
      } catch (error) {
        throw error;
      }

      try {
        await fs.writeFile(filePath, content);
      } catch (error) {
        throw error;
      }

      return {
        success: true,
        message: `file was successfully created at: ${filePath}`
      };
    },
    {
      name: 'write',
      description: 'Writes a file on the disk with specified filename, content, destination and extension. Destination is relative to app storage preset',
      schema: {
        type: 'object',
        properties: {
          filename: { type: 'string' },
          extension: { type: 'string' },
          destination: { type: 'string' },
          content: { type: 'string' }
        },
        required: ['filename', 'extension', 'destination', 'content'],
      },
    }
  );
}
