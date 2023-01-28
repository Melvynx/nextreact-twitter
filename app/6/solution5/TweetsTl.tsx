'use client';

import { useQuery } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { AddTweet } from '~/components/tweets/AddTweet';
import { TweetWithLikes } from '~/components/tweets/TweetWithLikes';
import { client } from '~/lib/client/client';
import { TlTweets, TweetsScheme } from '~/lib/scheme/tweets';

type TweetsTlProps = {
  tweets: TlTweets;
};

const getApiTweet = async () => {
  return client(`/api/tweets`, {
    zodSchema: TweetsScheme,
  });
};

export default function TweetsTl({
  tweets: defaultTweets,
  children,
}: PropsWithChildren<TweetsTlProps>) {
  const { data } = useQuery({
    queryKey: ['tweets'],
    queryFn: () => getApiTweet(),
    initialData: { tweets: defaultTweets },
    refetchOnMount: false,
  });

  const tweets = data.tweets;

  return (
    <>
      <AddTweet />
      <div>{children}</div>
      {tweets.map((tweet) => (
        <TweetWithLikes key={tweet.id} tweet={tweet} />
      ))}
    </>
  );
}
