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
      <Like
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

const Like = ({ count, liked, tweetId, parentTweetId }: LikeUpdateProps) => {
  const queryClient = useQueryClient();

  const queryKey = parentTweetId
    ? tweetKeys.getById(parentTweetId)
    : tweetKeys.all;

  const mutation = useMutation({
    mutationFn: () => {
      return tweetLike(tweetId, liked);
    },
    onMutate: () => {
      void queryClient.cancelQueries(queryKey);

      const previousValue = queryClient.getQueryData(queryKey);

      if (parentTweetId) {
        queryClient.setQueryData(queryKey, (old?: { tweet: TweetView }) =>
          fakeUpdateParentTweet(tweetId, liked, old)
        );
      } else {
        queryClient.setQueryData(
          queryKey,
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
      void queryClient.setQueriesData(queryKey, context?.previousValue);
      notifyFailed();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey,
        refetchPage: parentTweetId
          ? undefined
          : (lastPage: TlTweetsPage) => {
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
