import dotenv from 'dotenv';

dotenv.config();

export type LLMConfig = {
  modelName: string;
  temperature: number;
  configuration: {
    baseURL: string;
  };
  apiKey: string;
};

export const llmConfig: LLMConfig = {
  modelName: process.env.LLM_NAME || 'dummy',
  temperature: process.env.LLM_TEMP ? Number(process.env.LLM_TEMP ) : 0,
  configuration: {
    baseURL: process.env.LLM_BASE_URL || 'http://127.0.0.1',
  },
  apiKey: process.env.LLM_API_KEY || 'dummy',
}
