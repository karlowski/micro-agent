import { StateGraph, START, END } from '@langchain/langgraph';

import { GraphState, State } from '../state/index.js';

type EdgeType = 'simple' | 'conditional';

interface BaseEdge {
  type: EdgeType;
  source: string;
}

interface SimpleEdge extends BaseEdge {
  type: 'simple';
  target: string;
}

interface ConditionalEdge extends BaseEdge {
  type: 'conditional';
  router: (state: any) => string;
  mapping: Record<string, string>;
}

export type GraphEdge = SimpleEdge | ConditionalEdge;

type EdgeHandler = (
  workflow: StateGraph<typeof GraphState>,
  edge: any
) => void;

export const edgeHandlers: Record<EdgeType, EdgeHandler> = {
  simple: (workflow, edge: SimpleEdge) => {
    workflow.addEdge(edge.source as any, edge.target as any);
  },
  conditional: (workflow, edge: ConditionalEdge) => {
    workflow.addConditionalEdges(
      edge.source as any, // TODO: fix
      edge.router,
      edge.mapping as any
    );
  },
  // TODO: revursive calls to LLM and interrupt, maybe..?
};

export const edgesConfig: GraphEdge[] = [
  {
    type: 'simple',
    source: START,
    target: 'agent',
  },
  {
    type: 'conditional',
    source: 'agent',
    router: (state: State) => {
      if (state.toolIterations >= 5) {
        return 'responder';
      }

      if (state.pendingToolCall) {
        return 'tool';
      }

      const lastToolCall = state.toolHistory.at(-1); 
      if (!state.pendingToolCall && (lastToolCall && !lastToolCall.success && lastToolCall.error)) {
        return 'agent';
      }

      return 'responder';
    },
    mapping: {
      agent: 'agent',
      tool: 'tool',
      responder: 'responder',
    },
  },
  {
    type: 'simple',
    source: 'tool',
    target: 'agent',
  },
  {
    type: 'simple',
    source: 'responder',
    target: END,
  },
];
