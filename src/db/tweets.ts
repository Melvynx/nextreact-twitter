import { prisma } from './prisma';

const selectTweetQuery = (userId?: string) => ({
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
});

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

export const getTweet = (id: string, userId?: string) => {
  return prisma.tweet.findUnique({
    where: {
      id,
    },
    select: {
      ...selectTweetQuery(userId),
      replies: { select: selectTweetQuery(userId) },
    },
  });
};

// Type that modifies `likes` property to boolean
export type TlTweetFake<T> = Omit<T, 'likes'> & {
  likes: boolean;
};
