import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '~/db/handler';
import { getUserIdInCookie } from '~/lib/client/getUserIdCookie';
import { prisma } from '../../src/db/prisma';

export default apiHandler({
  endpoints: {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const userId = getUserIdInCookie(req);

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      res.status(200).json({ user });
    },
  },
});
