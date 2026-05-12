import { Annotation } from '@langchain/langgraph';

import { ToolHistoryItem } from './types.js';

export const GraphState = Annotation.Root({
  input: Annotation<string>(),
  output: Annotation<string>(),
  pendingToolCall: Annotation<any | null>(),
  context: Annotation<string[]>({
    reducer: (old, next) => old.concat(next),
    default: () => [],
  }),
  toolHistory: Annotation<ToolHistoryItem[]>({
    reducer: (old, next) => old.concat(next),
    default: () => [],
  }),
  toolIterations: Annotation<number>({
    reducer: (i, next) => i + next,
    default: () => 0,
  }),
});

export type State = typeof GraphState.State;
