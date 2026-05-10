import { execFile } from 'child_process';

const ALLOWED_CMDS = new Set(['ls', 'cat', 'pwd', 'top', 'free', 'find']); // TODO: customize..?

export const parseCommand = (input: string) => {
  const [cmd, ...args] = input.trim().split(/\s+/);

  return { cmd, args };
};

export const validateCommand = (cmd: string) => {
  return ALLOWED_CMDS.has(cmd);
};

export const runCommand = (cmd: string, args: string[]) => {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, (err, stdout, stderr) => {
      if (err) {
        return reject(stderr || err.message);
      }

      resolve(stdout);
    });
  });
};