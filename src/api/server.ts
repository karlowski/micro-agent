import { Server, createServer, IncomingMessage, ServerResponse } from 'http';

// TODO: refactor all this module

const readBody = (req: IncomingMessage): Promise<string> => {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', chunk => (body += chunk));
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

export const createHttpServer = (handler: Function): Server => {
  return createServer(async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== 'POST' || req.url !== '/question') {
      res.writeHead(404);
      return res.end();
    }

    try {
      const body = await readBody(req);
      const parsed = JSON.parse(body || '{}');

      if (!parsed.input) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'missing input' }));
      }

      const result = await handler(parsed.input);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ result }));
    } catch(error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error }));
    }
  });
}
