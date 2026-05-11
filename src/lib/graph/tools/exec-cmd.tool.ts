import { tool } from '@langchain/core/tools';

import { runCommand } from '../../../utils/cmd-runner.js';
import { parseCommand, isCommandAllowed } from '../../../utils/cmd-runner.js';

export default async () => {
  return tool(
    async ({ input }: { input: string }) => {
      const { cmd, args } = parseCommand(input);

      if (!isCommandAllowed(cmd)) {
        throw new Error('Command not allowed');
      }

      return await runCommand(cmd, args);
    },
    {
      name: 'exec-cmd',
      description: 'Runs "exec" with whitelisted system commands',
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

// export default async () => {
//   return tool(
//     async ({ cmd, args }: { cmd: string; args: string[] }) => {
//       console.log({ cmd, args });

//       if (!isCommandAllowed(cmd)) {
//         throw new Error('Command not allowed');
//       }

//       return await runCommand(cmd, args);
//     },
//     {
//       name: 'exec-cmd',
//       description: 'Runs "exec" with whitelisted system commands',
//       schema: {
//         type: 'object',
//         properties: {
//           cmd: { type: 'string' },
//           args: {
//             type: 'array',
//             items: { type: 'string' }
//           }
//         },
//         required: ['cmd', 'args']
//       }
//     }
//   );
// }
