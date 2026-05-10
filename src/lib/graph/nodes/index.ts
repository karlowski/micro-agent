import { loadModuleMap } from '../../../utils/module-loader.js';

const nodesMap = await loadModuleMap(import.meta.url, {
  exclude: ['index.ts', 'index.js'],
});

export default nodesMap;

