// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { z } from 'zod';
import { apiHandler } from '~/db/handler';
import { prisma } from '~/db/prisma';
import {
  getOptionalUserIdInCookie,
  getUserIdInCookie,
} from '~/lib/client/getUserIdCookie';
import { getTweets } from '../../../src/db/tweets';

const AddTweetBody = z.object({
  content: z.string(),
  tweetId: z.string().optional(),
});

const PageParams = z.object({
  page: z
    .string()
    .transform((s) => Number(s))
    .optional(),
  error: z.string().optional(), // for testing purpose
});

export default apiHandler({
  endpoints: {
    GET: async (req, res) => {
      // await wait(2000);
      const userId = getOptionalUserIdInCookie(req);
      const params = PageParams.parse(req.query);
      const page = params.page ?? 0;
      const error = params.error; // for testing purpose

      const tweets = await getTweets(userId, page);

      res.status(200).json({
        tweets: error ? tweets.map(() => error) : tweets, // for testing purpose
        nextPage: tweets.length !== 0 ? page + 1 : null,
      });
    },
    POST: async (req, res) => {
      const newTweet = AddTweetBody.parse(req.body);
      const userId = getUserIdInCookie(req);

      const tweet = await prisma.tweet.create({
        data: {
          ...newTweet,
          userId,
        },
      });

      res.status(200).json({ tweet });
    },
  },
});
