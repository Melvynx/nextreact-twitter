import type { IncomingMessage } from 'http';
import type { NextApiRequest } from 'next';

export const getUserIdInCookie = (req: IncomingMessage | NextApiRequest) => {
  const userId = getOptionalUserIdInCookie(req);

  if (!userId) throw new Error('userId is not found in cookie.');

  return userId;
};

export const getOptionalUserIdInCookie = (
  req: IncomingMessage | NextApiRequest
) => {
  const cookie = req.headers.cookie;
  const userId = cookie?.split('userId=')[1]?.split(';')[0];

  return userId;
};
