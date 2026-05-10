import { createHttpServer } from './api/server.js';
import { edgesConfig } from './lib/graph/config/edges.config.js';
import { nodesConfig } from './lib/graph/config/nodes.config.js';
import { createGraph, createGraphInvoker } from './lib/graph/index.js';

const graph = createGraph(nodesConfig, edgesConfig);
const invoker = createGraphInvoker(graph);

const main = () => {
  return createHttpServer(invoker);
}

main()
  .listen(3000)
  .on('error', console.error);
