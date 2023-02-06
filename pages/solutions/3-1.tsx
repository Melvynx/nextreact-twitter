import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Error } from '~/components/Error';
import { Loader } from '~/components/Loader';
import { AddTweet } from '~/components/tweets/AddTweet';
import { TweetsNextButton } from '~/components/tweets/TweetsNextButton';
import { useUser } from '~/hooks/UserProvider';
import { client } from '~/lib/client/client';
import { tweetKeys, useInfiniteTweets } from '~/lib/tweets/query.tweet';
import { LikeButton } from '../../src/components/tweets/LikeButton';
import { RepliesButton } from '../../src/components/tweets/RepliesButton';
import { Tweet } from '../../src/components/tweets/Tweet';
import TwitterLayout from '../../src/components/TwitterLayout';

export default function OptimisticUpdate() {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
  } = useInfiniteTweets();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error error="Couldn't fetch tweet..." reset={() => refetch()} />;
  }

  const tweets = data.pages.flatMap((page) => page.tweets);

  return (
    <TwitterLayout>
      <AddTweet />
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet}>
          <RepliesButton count={tweet._count.replies} />
          <Like
            tweetId={tweet.id}
            liked={tweet.liked}
            count={tweet._count.likes}
          />
        </Tweet>
      ))}
      <TweetsNextButton
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </TwitterLayout>
  );
}

const notifyFailed = () => toast.error("Couldn't like tweet");

const likeTweet = async (tweetId: string, liked: boolean) =>
  client(`/api/tweets/${tweetId}/like`, {
    method: liked ? 'DELETE' : 'POST',
  });

type LikeUpdateProps = {
  tweetId: string;
  count: number;
  liked: boolean;
};

const Like = ({ count, liked, tweetId }: LikeUpdateProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const queryClient = useQueryClient();

  const onClick = () => {
    setIsLoading(true);
    likeTweet(tweetId, liked)
      .then(() => {
        void queryClient.invalidateQueries(tweetKeys.all);
      })
      .catch(() => {
        notifyFailed();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <LikeButton
      disabled={isLoading || !user}
      count={count}
      onClick={() => {
        if (isLoading) {
          return;
        }
        onClick();
      }}
      liked={liked}
    />
  );
};
