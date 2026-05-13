import { tool } from '@langchain/core/tools';

import { parsePipeline, runPipeline } from '../../../utils/cmd-runner.js';
import { isCommandAllowed } from '../../../utils/cmd-runner.js';
import { ToolExecutionResponse } from '../types/tool.types.js';

export default async () => {
  return tool(
    async ({ input }: { input: string }): Promise<ToolExecutionResponse> => {
      const pipeline = parsePipeline(input);

      for (const command of pipeline) {
        const { cmd } = command;
        if (!isCommandAllowed(cmd)) {
          throw new Error(`Command is not allowed: ${cmd}`);
        }
      }

      try {
        const result = await runPipeline(pipeline);

        return {
          success: true,
          message: `command "${input}" executed successfully, the result is at "payload"`,
          payload: result
        }
      } catch (error) {
        return {
          success: false,
          message: String(error)
        }
      }
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
