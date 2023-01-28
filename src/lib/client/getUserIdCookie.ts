import { IncomingMessage } from 'http';
import { NextApiRequest } from 'next';

export const getUserIdInCookie = (req: NextApiRequest | IncomingMessage) => {
  const userId = getOptionalUserIdInCookie(req);

  if (!userId) throw new Error('userId is not found in cookie.');

  return userId;
};

export const getOptionalUserIdInCookie = (req: NextApiRequest | IncomingMessage) => {
  const cookie = req.headers.cookie;
  const userId = cookie?.split('userId=')[1]?.split(';')[0];

  return userId;
};
