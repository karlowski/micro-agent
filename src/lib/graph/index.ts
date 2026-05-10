import { StateGraph } from '@langchain/langgraph';

import { GraphState } from './state/index.js';
import nodes from './nodes/index.js';
import { edgeHandlers, GraphEdge } from './config/edges.config.js';

export const createGraph = (nodesConfig: string[], edgesConfig: GraphEdge[]) => {
  const workflow = new StateGraph(GraphState);

  for (const node of nodesConfig) {
    const nodeFn = nodes.get(node);
    if (nodeFn) {
      workflow.addNode(node, nodeFn as any);
    } else {
      throw new Error(`No handler found for node: ${node}`);
    }
  }

  for (const edge of edgesConfig) {
    const handler = edgeHandlers[edge.type];

    if (handler) {
      handler(workflow, edge);
    } else {
      throw new Error(`No handler found for edge type: ${edge.type}`);
    }
  }

  return workflow.compile();
};

export const createGraphInvoker = (graph: any) => {
  return async (input: string) => {
    return graph.invoke({
      input,
      lastToolCall: null,
      context: [],
      output: '',
      toolHistory: [],
    });
  };
};
