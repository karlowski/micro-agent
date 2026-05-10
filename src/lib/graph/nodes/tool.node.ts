import { State } from '../state/index.js';
import toolsMap from '../tools/index.js';

export default async (state: State) => {
  const toolCall = state.lastToolCall; 
  if (!toolCall) {
    throw new Error('ToolNode called without a toolCall in state.');
  }

  const tool = toolsMap.get(toolCall.name);
  if (!tool) {
    throw new Error(`No tool was found, searching: ${toolCall.name}`)
  } 

  const result = await tool.invoke(toolCall.args);

  return {
    context: [result],
    tool_history: [`Executed ${toolCall.name}`]
  };
};
