import { AIMessage } from '@langchain/core/messages';

import { llm } from '../../llm/index.js';
import { State } from '../state/index.js';

export default async (state: State) => {
  const messages = [
    { role: 'system', content: 'You are locally-running LLM connected to agent features. Use tools when necessary but DO NOT try any commands repeadly in the same fashion when hit the error' },
    { role: 'user', content: state.input },
    ...state.context.map(c => ({ role: 'system', content: `Context: ${c}` }))
  ];

  try {
    const response: AIMessage = await llm.invoke(messages);

    return {
      output: response.content,
      pendingToolCall: response.tool_calls?.[0] || null,
    };
  } catch (error) {
    throw new Error(`Error from the LLM layer: ${JSON.stringify(error)}`);
  }
};