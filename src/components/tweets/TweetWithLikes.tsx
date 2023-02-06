import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { client } from '~/lib/client/client';
import type {
  TlTweet,
  TlTweets,
  TlTweetsPage,
  TweetView,
} from '~/lib/scheme/tweets';
import { tweetKeys } from '~/lib/tweets/query.tweet';
import { LikeButton } from './LikeButton';
import { RepliesButton } from './RepliesButton';
import { Tweet } from './Tweet';

export const TweetWithLikes = ({
  tweet,
  parentTweetId,
}: {
  tweet: TlTweet;
  parentTweetId?: string;
}) => {
  return (
    <Tweet key={tweet.id} tweet={tweet}>
      <RepliesButton count={tweet._count.replies} />
      <LikeUpdate
        tweetId={tweet.id}
        liked={tweet.liked}
        count={tweet._count.likes}
        parentTweetId={parentTweetId}
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
  parentTweetId?: string;
};

const LikeUpdate = ({
  count,
  liked,
  tweetId,
  parentTweetId,
}: LikeUpdateProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return tweetLike(tweetId, liked);
    },
    onMutate: () => {
      if (parentTweetId) {
        void queryClient.cancelQueries(tweetKeys.getById(parentTweetId));
      } else {
        void queryClient.cancelQueries(tweetKeys.all);
      }

      const previousValue = queryClient.getQueryData(['tweets']);

      if (parentTweetId) {
        queryClient.setQueryData(
          tweetKeys.getById(parentTweetId),
          (old?: { tweet: TweetView }) =>
            fakeUpdateParentTweet(tweetId, liked, old)
        );
      } else {
        queryClient.setQueryData(
          tweetKeys.all,
          (old?: { pages: TlTweetsPage[] }) => {
            if (!old) {
              return old;
            }
            return {
              pages: old.pages.map((page) => ({
                ...page,
                ...fakeUpdateTweet(tweetId, liked, { tweets: page.tweets }),
              })),
            };
          }
        );
      }

      return { previousValue };
    },
    onError: (err, variables, context) => {
      if (parentTweetId) {
        queryClient.setQueryData(
          tweetKeys.getById(parentTweetId),
          context?.previousValue
        );
      } else {
        void queryClient.invalidateQueries({
          queryKey: tweetKeys.all,
          refetchPage: (lastPage: TlTweetsPage) => {
            return lastPage.tweets.some((tweet) => tweet.id === tweetId);
          },
        });
      }
      notifyFailed();
    },
    onSuccess: () => {
      if (parentTweetId) {
        void queryClient.invalidateQueries(tweetKeys.getById(parentTweetId));
      } else {
        void queryClient.invalidateQueries(tweetKeys.all);
      }
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

const fakeUpdateParentTweet = (
  tweetId: string,
  liked: boolean,
  old?: { tweet: TweetView }
) => {
  if (!old) {
    return old;
  }

  const newLikes = liked
    ? old.tweet._count.likes - 1
    : old.tweet._count.likes + 1;

  return {
    tweet: {
      ...old.tweet,
      liked: tweetId === old.tweet.id ? !liked : old.tweet.liked,
      _count: {
        ...old.tweet._count,
        likes: tweetId === old.tweet.id ? newLikes : old.tweet._count.likes,
      },
      replies: old.tweet.replies?.map((reply) => {
        if (reply.id !== tweetId) {
          return reply;
        }
        return {
          ...reply,
          liked: !liked,
          _count: {
            ...reply._count,
            likes: liked ? reply._count.likes - 1 : reply._count.likes + 1,
          },
        };
      }),
    },
  };
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
