import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Loader } from '~/components/Loader';
import { AddTweet } from '~/components/tweets/AddTweet';
import { client } from '~/lib/client/client';
import { Like } from '../../src/components/tweets/Like';
import { Replies } from '../../src/components/tweets/Replies';
import { Tweet } from '../../src/components/tweets/Tweet';
import TwitterLayout from '../../src/components/TwitterLayout';
import { TweetsScheme } from '../../src/lib/scheme/tweets';

const getTweets = async (signal?: AbortSignal) =>
  client(`/api/tweets`, { signal, zodSchema: TweetsScheme });

export default function FetchAllTweets() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tweets'],
    queryFn: ({ signal }) => getTweets(signal),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <p>An error occurred.</p>;
  }

  const tweets = data.tweets;

  return (
    <TwitterLayout>
      <AddTweet />
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet}>
          <Replies count={tweet._count.replies} />
          <LikeUpdate
            tweetId={tweet.id}
            liked={tweet.liked}
            count={tweet._count.likes}
          />
        </Tweet>
      ))}
    </TwitterLayout>
  );
}

const notifyFailed = () => toast.error("Couldn't like tweet");

const tweetLike = async (tweetId: string, liked: boolean) =>
  client(`/api/tweets/${tweetId}/like`, {
    method: liked ? 'DELETE' : 'POST',
  });

type LikeUpdateProps = {
  tweetId: string;
  count: number;
  liked: boolean;
};

const LikeUpdate = ({ count, liked, tweetId }: LikeUpdateProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const onClick = () => {
    setIsLoading(true);
    tweetLike(tweetId, liked)
      .then(() => {
        void queryClient.invalidateQueries(['tweets']);
      })
      .catch(() => {
        notifyFailed();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Like
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
