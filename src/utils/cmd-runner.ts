import { execFile, spawn } from 'child_process';
import os from 'os';
import parse from 'bash-parser';

const ALLOWED_CMDS = new Set(['ls', 'cat', 'pwd', 'top', 'free', 'find', 'grep', 'head']); // TODO: customize..?

export type PipelineCommand = { cmd: string; args: string[] };

const resolveHomePath = (arg: string) =>
  arg.replace(/^~/, os.homedir());

const mapToProcesses = (ast: Record<string, any>[]): PipelineCommand[] => {
  const commands = ast.flatMap((node) => {
    if (node.type === 'Pipeline') return node.commands;
    if (node.type === 'Command') return [node];

    return [];
  });

  return commands.map((command) => {
    const cmd = command.name.text;
    const args = (command.suffix || [])
      .map((a: any) => a.text)
      .filter(Boolean)
      .map(resolveHomePath);

    return {
      cmd,
      args 
    }
  });
}

export const parsePipeline = (pipeline: string): PipelineCommand[] => {
  const ast = parse(pipeline);
  return mapToProcesses(ast.commands);
}

export const isCommandAllowed = (cmd: string): boolean => {
  return ALLOWED_CMDS.has(cmd);
};

export const runCommand = (cmd: string, args: string[]): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, (err, stdout, stderr) => {
      if (err) {
        return reject(stderr || err.message);
      }

      resolve(stdout);
    });
  });
};

export const runPipeline = (commands: PipelineCommand[]) => {
  const processes = commands.map(({ cmd, args }) =>
    spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe'] })
  );

  processes.reduce((prev, curr) => (prev.stdout.pipe(curr.stdin), curr));

  const last = processes.at(-1);

  if (!last) {
    throw new Error('No commands for pipeline');
  }

  return new Promise((resolve, reject) => {
    let output = '';
    let error = '';

    for (const p of processes) {
      p.on('error', reject);
      p.stderr.on('data', (d) => (error += d));
    }

    last.stdout.on('data', (d) => (output += d));
    last.on('close', (code) =>
      code === 0 ? resolve(output) : reject(new Error(error || `exit ${code}`))
    );
  });
};
