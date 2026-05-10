import { loadModuleMap } from '../../../utils/module-loader.js';

const toolsMap = await loadModuleMap(import.meta.url, {
  exclude: ['index.ts', 'index.js'],
  factory: true
});

export default toolsMap;
