import { Annotation } from '@langchain/langgraph';

export const GraphState = Annotation.Root({
  input: Annotation<string>(),
  context: Annotation<string[]>({
    reducer: (old, next) => old.concat(next),
    default: () => [],
  }),
  output: Annotation<string>(),
  toolHistory: Annotation<string[]>({
    reducer: (old, next) => old.concat(next),
    default: () => [],
  }),
  lastToolCall: Annotation<any>()
});

export type State = typeof GraphState.State;
