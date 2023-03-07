import type { Prisma } from '@prisma/client';
import { prisma } from './prisma';

const selectTweetQuery = (userId?: string) =>
  ({
    id: true,
    content: true,
    createdAt: true,
    user: {
      select: {
        id: true,
        displayName: true,
        username: true,
        avatarUrl: true,
      },
    },
    likes: {
      where: {
        userId,
      },
      select: {
        id: true,
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
        replies: true,
      },
    },
  } satisfies Prisma.TweetSelect);

export const getTweets = async (userId?: string, page = 0) => {
  const tweets = await prisma.tweet.findMany({
    skip: page * 10,
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      tweetId: null,
    },
    select: selectTweetQuery(userId),
  });

  const fixedTweet = tweets.map((t) => ({
    ...t,
    liked: t.likes.some((l) => l.userId === userId),
    createdAt: t.createdAt.toISOString(),
  }));

  return fixedTweet;
};

export const getUserTweets = async (
  userId: string,
  currentUserId?: string,
  page = 0
) => {
  const tweets = await prisma.tweet.findMany({
    where: {
      userId,
      tweetId: null,
    },
    skip: page * 10,
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
    select: selectTweetQuery(currentUserId),
  });

  const fixedTweet = tweets.map((t) => ({
    ...t,
    liked: t.likes.some((l) => l.userId === currentUserId),
    createdAt: t.createdAt.toISOString(),
  }));

  return fixedTweet;
};

export const getTweet = async (id: string, userId?: string) => {
  const tweet = await prisma.tweet.findUnique({
    where: {
      id,
    },
    select: {
      ...selectTweetQuery(userId),
      replies: { select: selectTweetQuery(userId) },
    },
  });

  if (!tweet) {
    return tweet;
  }

  const fixedTweet = {
    ...tweet,
    liked: tweet.likes.some((l) => l.userId === userId),
    createdAt: tweet.createdAt.toISOString(),
    replies: tweet.replies.map((r) => ({
      ...r,
      liked: r.likes.some((l) => l.userId === userId),
      createdAt: r.createdAt.toISOString(),
    })),
  };

  return fixedTweet;
};

// Type that modifies `likes` property to boolean
export type TlTweetFake<T> = Omit<T, 'likes'> & {
  likes: boolean;
};
