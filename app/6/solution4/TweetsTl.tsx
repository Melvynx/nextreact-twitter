'use client';

import { useQuery } from '@tanstack/react-query';
import { AddTweet } from '~/components/tweets/AddTweet';
import { TweetWithLikes } from '~/components/tweets/TweetWithLikes';
import { client } from '~/lib/client/client';
import type { TlTweets } from '~/lib/scheme/tweets';
import { TweetsScheme } from '~/lib/scheme/tweets';

type TweetsTlProps = {
  tweets: TlTweets;
  userId?: string;
};

const getApiTweet = async () => {
  return client(`/api/tweets`, {
    zodSchema: TweetsScheme,
  });
};

export default function TweetsTl({ tweets: defaultTweets }: TweetsTlProps) {
  const { data } = useQuery({
    queryKey: ['tweets'],
    queryFn: () => getApiTweet(),
    initialData: { tweets: defaultTweets },
  });

  const tweets = data.tweets;

  return (
    <>
      <AddTweet />
      {tweets.map((tweet) => (
        <TweetWithLikes key={tweet.id} tweet={tweet} />
      ))}
    </>
  );
}
