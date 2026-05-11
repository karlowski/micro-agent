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

  try {
    const result = await tool.invoke(toolCall.args);

    return {
      context: [String(result)],
      toolHistory: [
        {
          name: toolCall.name,
          args: toolCall.args,
          result: String(result),
          success: true,
        }
      ],
      pendingToolCall: null,
    };
  } catch (error) {
    return {
      context: [`Tool error: ${JSON.stringify(error)}`],
      toolHistory: [
        {
          name: toolCall.name,
          args: toolCall.args,
          error,
          success: false,
        }
      ],
      pendingToolCall: null,
    };
  }
};
