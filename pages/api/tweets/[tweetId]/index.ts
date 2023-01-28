// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { z } from 'zod';
import { apiHandler } from '~/db/handler';
import { getTweet } from '~/db/tweets';
import { getUserIdInCookie } from '~/lib/client/getUserIdCookie';

const GetTweetParams = z.object({
  tweetId: z.string(),
});

export default apiHandler({
  endpoints: {
    GET: async (req, res) => {
      const userId = getUserIdInCookie(req);
      const { tweetId } = GetTweetParams.parse(req.query);

      const tweet = await getTweet(tweetId, userId);

      if (!tweet) {
        res.status(404).json({ error: 'Tweet not found' });
        return;
      }

      const fixedTweet = {
        ...tweet,
        liked: tweet.likes.some((l) => l.userId === userId),
        replies: tweet.replies.map((r) => ({
          ...r,
          liked: r.likes.some((l) => l.userId === userId),
        })),
      };

      res.status(200).json({ tweet: fixedTweet });
    },
  },
});
