'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { LikeButton } from '~/components/tweets/LikeButton';
import { RepliesButton } from '~/components/tweets/RepliesButton';
import { Tweet } from '~/components/tweets/Tweet';
import { client } from '~/lib/client/client';
import type { TlTweet, TlTweets, TlTweetsPage } from '~/lib/scheme/tweets';
import { tweetKeys } from '~/lib/tweets/query.tweet';

export const TweetWithLikes = ({
  tweet,
  userId,
}: {
  tweet: TlTweet;
  userId: string;
}) => {
  return (
    <Tweet key={tweet.id} tweet={tweet}>
      <RepliesButton count={tweet._count.replies} />
      <Like
        tweetId={tweet.id}
        liked={tweet.liked}
        count={tweet._count.likes}
        userId={userId}
      />
    </Tweet>
  );
};

const notifyFailed = () => toast.error("Couldn't like tweet");

const tweetLike = async (tweetId: string, liked: boolean) =>
  client(`/api/tweets/${tweetId}/like`, {
    method: liked ? 'DELETE' : 'POST',
  });

type LikeUpdateProps = {
  tweetId: string;
  count: number;
  liked: boolean;
  userId: string;
};

const Like = ({ count, liked, tweetId, userId }: LikeUpdateProps) => {
  const queryClient = useQueryClient();

  const queryKey = tweetKeys.getByUser(userId);

  const mutation = useMutation({
    mutationFn: () => {
      return tweetLike(tweetId, liked);
    },
    onMutate: () => {
      void queryClient.cancelQueries(queryKey);

      const previousValue = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old?: { pages: TlTweetsPage[] }) => {
        if (!old) {
          return old;
        }
        return {
          pages: old.pages.map((page) => ({
            ...page,
            ...fakeUpdateTweet(tweetId, liked, { tweets: page.tweets }),
          })),
        };
      });

      return { previousValue };
    },
    onError: (err, variables, context) => {
      void queryClient.setQueriesData(queryKey, context?.previousValue);
      notifyFailed();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey,
        refetchPage: (lastPage: TlTweetsPage) => {
          return lastPage.tweets.some((tweet) => tweet.id === tweetId);
        },
      });
    },
  });

  return (
    <LikeButton
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

const fakeUpdateTweet = (
  tweetId: string,
  liked: boolean,
  old?: { tweets: TlTweets }
): { tweets: TlTweets } => {
  if (!old) {
    return {
      tweets: [],
    };
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
};
