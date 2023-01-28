// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { z } from 'zod';
import { apiHandler } from '~/db/handler';
import { prisma } from '~/db/prisma';
import { getTweet } from '~/db/tweets';
import { getUserIdInCookie } from '~/lib/client/getUserIdCookie';
import { wait } from '~/lib/test-utiles/wait';

const ParamsScheme = z.object({
  tweetId: z.string(),
});

const BodyScheme = z.object({
  userId: z.string(),
});

export default apiHandler({
  endpoints: {
    POST: async (req, res) => {
      await wait(1000);

      const { tweetId } = ParamsScheme.parse(req.query);
      const userId = getUserIdInCookie(req);

      await prisma.tweetsOnLikes.create({
        data: {
          tweetId,
          userId,
        },
      });

      const tweet = await getTweet(userId, tweetId);

      res.status(200).json({ tweet });
    },
    DELETE: async (req, res) => {
      await wait(1000);

      const { tweetId } = ParamsScheme.parse(req.query);
      const userId = getUserIdInCookie(req);

      await prisma.tweetsOnLikes.delete({
        where: {
          tweetId_userId: {
            tweetId,
            userId,
          },
        },
      });

      const tweet = await getTweet(userId, tweetId);

      res.status(200).json({ tweet });
    },
  },
});
