// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { z } from 'zod';
import { apiHandler } from '~/db/handler';
import { prisma } from '~/db/prisma';
import { getUserIdInCookie } from '~/lib/client/getUserIdCookie';

const UserQuery = z.object({
  userId: z.string(),
});

export default apiHandler({
  endpoints: {
    POST: async (req, res) => {
      const currentUserId = getUserIdInCookie(req);

      if (!currentUserId) {
        res.status(401).json({ error: 'You must be logged in' });
        return;
      }

      const { userId } = UserQuery.parse(req.query);

      const following = await prisma.userFollowsUser.create({
        data: {
          followerId: userId,
          followingId: currentUserId,
        },
      });

      res.status(200).json({ following });
    },
    DELETE: async (req, res) => {
      const currentUserId = getUserIdInCookie(req);

      if (!currentUserId) {
        res.status(401).json({ error: 'You must be logged in' });
        return;
      }

      const { userId } = UserQuery.parse(req.query);

      const following = await prisma.userFollowsUser.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: currentUserId,
          },
        },
      });

      res.status(200).json({ following });
    },
  },
});
