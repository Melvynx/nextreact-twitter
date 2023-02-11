// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { z } from 'zod';
import { apiHandler } from '~/db/handler';
import { getUserTweets } from '~/db/tweets';
import { getOptionalUserIdInCookie } from '~/lib/client/getUserIdCookie';

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
  userId: z.string(),
});

export default apiHandler({
  endpoints: {
    GET: async (req, res) => {
      // await wait(2000);
      const currentUserId = getOptionalUserIdInCookie(req);
      const params = PageParams.parse(req.query);
      const page = params.page ?? 0;
      const error = params.error; // for testing purpose

      const tweets = await getUserTweets(params.userId, currentUserId, page);

      res.status(200).json({
        tweets: error ? tweets.map(() => error) : tweets, // for testing purpose
        nextPage: tweets.length !== 0 ? page + 1 : null,
      });
    },
  },
});
