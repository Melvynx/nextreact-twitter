import { z } from 'zod';

const TlTweetScheme = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.string(),
  user: z.object({
    id: z.string(),
    displayName: z.string().nullable(),
    username: z.string(),
    avatarUrl: z.string().nullable(),
  }),
  liked: z.boolean(),
  _count: z.object({
    likes: z.number(),
    replies: z.number(),
  }),
});

export const TweetsScheme = z.object({
  tweets: z.array(TlTweetScheme),
  nextPage: z.number().optional().nullable(),
});

export type TlTweetsPage = z.infer<typeof TweetsScheme>;
export type TlTweets = z.infer<typeof TweetsScheme>['tweets'];
export type TlTweet = TlTweets[number];

// Extends TlTweetScheme to add `replies` property
export const TweetScheme = z.object({
  tweet: TlTweetScheme.extend({
    replies: z.array(TlTweetScheme).optional(),
  }),
});

export type TweetView = z.infer<typeof TweetScheme>['tweet'];
