import { AIMessage } from '@langchain/core/messages';

import { llm } from '../../llm/index.js';
import { State } from '../state/index.js';

export default async (state: State) => {
  const messages = [
    { role: 'system', content: 'You are locally-running LLM connected to agent features. Use tools these when necessary.' },
    { role: 'user', content: state.input },
    ...state.context.map(c => ({ role: 'system', content: `Context: ${c}` }))
  ];

  const response: AIMessage = await llm.invoke(messages);
  
  return {
    ...state,
    output: response.content,
    toolHistory: response.tool_calls ?? [],
    pendingToolCall: response.tool_calls?.[0] ?? null,
    iterations: 1
  };
};