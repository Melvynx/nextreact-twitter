import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Error } from '~/components/Error';
import { Loader } from '~/components/Loader';
import { AddTweet } from '~/components/tweets/AddTweet';
import { TweetsNextButton } from '~/components/tweets/TweetsNextButton';
import { useUser } from '~/hooks/UserProvider';
import { client } from '~/lib/client/client';
import type { TlTweetsPage } from '~/lib/scheme/tweets';
import { tweetKeys, useInfiniteTweets } from '~/lib/tweets/query.tweet';
import { Like } from '../../src/components/tweets/Like';
import { Replies } from '../../src/components/tweets/Replies';
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

const likeTweet = async (tweetId: string, liked: boolean) => {
  return client(`/api/tweets/${tweetId}/like`, {
    method: liked ? 'DELETE' : 'POST',
  });
};

type LikeUpdateProps = {
  tweetId: string;
  count: number;
  liked: boolean;
};

const LikeUpdate = ({ count, liked, tweetId }: LikeUpdateProps) => {
  const queryClient = useQueryClient();

  const { user } = useUser();

  const mutation = useMutation({
    mutationFn: () => {
      return likeTweet(tweetId, liked);
    },

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: tweetKeys.all,
      });

      const previousValue = queryClient.getQueriesData(tweetKeys.all);

      queryClient.setQueryData(
        tweetKeys.all,
        (old?: { pages: TlTweetsPage[] }) => {
          if (!old) {
            return old;
          }
          return {
            pages: old.pages.map((page) => {
              if (!page.tweets.some((t) => t.id === tweetId)) {
                return page;
              }

              return {
                ...page,
                tweets: page.tweets.map((tweet) => {
                  if (tweet.id !== tweetId) {
                    return tweet;
                  }

                  return {
                    ...tweet,
                    liked: !liked,
                    _count: {
                      ...tweet._count,
                      likes: tweet._count.likes + (liked ? -1 : 1),
                    },
                  };
                }),
              };
            }),
          };
        }
      );

      return { previousValue };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: tweetKeys.all,
        refetchPage: (lastPage: TlTweetsPage) => {
          return lastPage.tweets.some((tweet) => tweet.id === tweetId);
        },
      });
    },
    onError: (err, variables, context) => {
      queryClient.setQueriesData(tweetKeys.all, context?.previousValue);
      notifyFailed();
    },
  });

  return (
    <Like
      disabled={!user}
      loading={mutation.isLoading}
      count={count}
      onClick={() => {
        mutation.mutate();
      }}
      liked={liked}
    />
  );
};
