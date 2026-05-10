import { readdirSync } from 'node:fs';
import { basename, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

type ModuleMap<T = any> = Map<string, T>;

type LoaderOptions = {
  exclude?: string[];
  factory?: boolean;
  transform?: (module: any) => any;
};

// Note: this is so dumb
const resolveModule = async <T>(module: any, factory: boolean): Promise<T> => {
  if (factory) {
    return module.default();
  }

  return module.default;
}

export const loadModuleMap = async <T = any>(
  dirUrl: string,
  options: LoaderOptions = {}
): Promise<ModuleMap<T>> => {
  const { exclude = [], factory = false } = options;
  const tools = new Map<string, T>();
  const dirPath = dirname(fileURLToPath(dirUrl));
  const files = readdirSync(dirPath).filter((file) => !exclude.includes(file));

  for (const file of files) {
    const nameRaw = basename(file, extname(file));
    const name = nameRaw.split('.')[0];
    
    const modulePath = new URL(`./${file}`, dirUrl).href;
    const moduleRaw = await import(modulePath);
    const module = await resolveModule<T>(moduleRaw, factory);

    tools.set(name, module);
  }

  return tools;
}
