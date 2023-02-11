'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { TweetsNextButton } from '~/components/tweets/TweetsNextButton';
import { TweetWithLikes } from '~/components/tweets/TweetWithLikes';
import { client } from '~/lib/client/client';
import type { TlTweetsPage } from '~/lib/scheme/tweets';
import { TweetsScheme } from '~/lib/scheme/tweets';
import { tweetKeys } from '~/lib/tweets/query.tweet';

const getUserTweets = async (userId: string, signal?: AbortSignal, page = 0) =>
  client(`/api/users/${userId}/tweets?page=${page}`, {
    signal,
    zodSchema: TweetsScheme,
  });

export const useInfiniteTweets = (
  userId: string,
  defaultTweets: TlTweetsPage
) =>
  useInfiniteQuery({
    queryKey: tweetKeys.getByUser(userId),
    queryFn: ({ signal, pageParam }) =>
      getUserTweets(userId, signal, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialData: {
      pages: [defaultTweets],
      pageParams: [0],
    },
  });

type TweetsTlProps = {
  tweets: TlTweetsPage;
  userId: string;
};

export const TweetsTl = ({ tweets: defaultTweets, userId }: TweetsTlProps) => {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteTweets(userId, defaultTweets);

  const tweets = data?.pages.flatMap((page) => page.tweets) ?? [];

  return (
    <>
      {tweets.map((tweet) => (
        <TweetWithLikes key={tweet.id} tweet={tweet} />
      ))}
      <TweetsNextButton
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
};
