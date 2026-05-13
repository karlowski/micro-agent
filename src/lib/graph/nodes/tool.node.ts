import { State } from '../state/index.js';
import toolsMap from '../tools/index.js';

export default async (state: State) => {
  const toolCall = state.pendingToolCall;
  if (!toolCall) {
    throw new Error('ToolNode called without a toolCall in state.');
  }

  const tool = toolsMap.get(toolCall.name);
  if (!tool) {
    throw new Error(`No tool was found, searching: ${toolCall.name}`)
  }

  // TODO: error-handling according to new tools response flow
  try {
    const result = await tool.invoke(toolCall.args);

    return {
      context: [JSON.stringify(result)],
      toolHistory: [
        {
          name: toolCall.name,
          args: toolCall.args,
          result: JSON.stringify(result),
          success: true,
        }
      ],
      pendingToolCall: null,
      toolIterations: 1
    };
  } catch (error) {
    return {
      context: [`Tool error. Try different command. Error: ${String(error)}`],
      toolHistory: [
        {
          name: toolCall.name,
          args: toolCall.args,
          error,
          success: false,
        }
      ],
      pendingToolCall: null,
      toolIterations: 1
    };
  }
};
