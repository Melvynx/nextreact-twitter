import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { apiHandler } from '~/db/handler';
import { getUserIdInCookie } from '~/lib/client/getUserIdCookie';
import { prisma } from '../../src/db/prisma';

const QueryScheme = z.object({
  email: z.string().email(),
});

export default apiHandler({
  endpoints: {
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { email } = QueryScheme.parse(req.body);

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      // store userId in cookie
      if (!user) {
        res.setHeader('Set-Cookie', `userId=; Path=/; HttpOnly`);
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.setHeader('Set-Cookie', `userId=${user.id}; Path=/; HttpOnly`);
      res.status(200).json({ user });
    },
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      const userId = getUserIdInCookie(req);

      if (!userId) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.setHeader('Set-Cookie', `userId=; Path=/; HttpOnly`);
      res.status(200).json({ message: 'User log out' });
    },
  },
});
