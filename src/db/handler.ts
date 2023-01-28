import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const MethodScheme = z.union([
  z.literal('DELETE'),
  z.literal('GET'),
  z.literal('OPTIONS'),
  z.literal('PATCH'),
  z.literal('POST'),
  z.literal('PUT'),
]);

type Method = typeof MethodScheme._output;

type Endpoint = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export type PartialRecord<K extends keyof never, T> = {
  [P in K]?: T;
};

type ApiOptions = {
  endpoints: PartialRecord<Method, Endpoint>;
};

export const apiHandler =
  ({ endpoints }: ApiOptions) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (error: unknown) {
        // nothing
      }
    }

    const method = MethodScheme.parse(req.method);

    const endpoint = endpoints[method];

    if (!endpoint) {
      res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
      await endpoint?.(req, res);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message, message: error.cause });
        return;
      }

      res.status(400).json({ error: 'error append', message: error });
    }
  };
