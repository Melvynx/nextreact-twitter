import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Error } from '~/components/Error';
import { Loader } from '~/components/Loader';
import { AddTweet } from '~/components/tweets/AddTweet';
import { TweetsNextButton } from '~/components/tweets/TweetsNextButton';
import { client } from '~/lib/client/client';
import { useInfiniteTweets } from '~/lib/tweets/query.tweet';
import { Like } from '../../src/components/tweets/Like';
import { Replies } from '../../src/components/tweets/Replies';
import { Tweet } from '../../src/components/tweets/Tweet';
import TwitterLayout from '../../src/components/TwitterLayout';
import type { TlTweets } from '../../src/lib/scheme/tweets';

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
          <Replies count={tweet._count.replies} />
          <LikeUpdate
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

const LikeUpdate = ({ count, liked, tweetId }: LikeUpdateProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return likeTweet(tweetId, liked);
    },
    onMutate: async () => {
      await queryClient.cancelQueries(['tweets']);

      const previousValue = queryClient.getQueryData(['tweets']);

      queryClient.setQueryData(['tweets'], (old?: { tweets: TlTweets }) => {
        if (!old) {
          return old;
        }
        return {
          tweets: old.tweets.map((tweet) => {
            if (tweet.id !== tweetId) {
              return tweet;
            }
            return {
              ...tweet,
              liked: !liked,
              _count: {
                ...tweet._count,
                likes: liked ? tweet._count.likes - 1 : tweet._count.likes + 1,
              },
            };
          }),
        };
      });

      return { previousValue };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['tweets'], context?.previousValue);
      notifyFailed();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries(['tweets']);
    },
  });

  return (
    <Like
      count={count}
      onClick={() => {
        if (mutation.isLoading) {
          return;
        }
        mutation.mutate();
      }}
      liked={liked}
    />
  );
};
