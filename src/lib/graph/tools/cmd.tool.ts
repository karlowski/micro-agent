import { tool } from '@langchain/core/tools';

import { parsePipeline, runPipeline } from '../../../utils/cmd-runner.js';
import { isCommandAllowed } from '../../../utils/cmd-runner.js';

export default async () => {
  return tool(
    async ({ input }: { input: string }) => {
      const pipeline = parsePipeline(input);

      for (const command of pipeline) {
        const { cmd } = command;
        if (!isCommandAllowed(cmd)) {
          throw new Error(`Command is not allowed: ${cmd}`);
        }
      }

      return runPipeline(pipeline);
    },
    {
      name: 'cmd',
      description: 'Runs whitelisted system commands',
      schema: {
        type: 'object',
        properties: {
          input: { type: 'string' },
        },
        required: ['input'],
      },
    }
  );
}
