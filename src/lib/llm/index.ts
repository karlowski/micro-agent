import { ChatOpenAI } from '@langchain/openai';

import toolsMap from '../graph/tools/index.js';
import { LLMConfig, llmConfig } from './llm.config.js';

const initLLM = (config: LLMConfig) => {
  const tools = Array.from(toolsMap.values());
  
  return new ChatOpenAI(config)
    .bindTools(tools);
}

export const llm = initLLM(llmConfig);
