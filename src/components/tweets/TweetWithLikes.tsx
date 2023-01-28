import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { client } from '~/lib/client/client';
import { TlTweet, TlTweets, TweetView } from '~/lib/scheme/tweets';
import { Like } from './Like';
import { Replies } from './Replies';
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
      <Replies count={tweet._count.replies} />
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

const LikeUpdate = ({ count, liked, tweetId, parentTweetId }: LikeUpdateProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return tweetLike(tweetId, liked);
    },
    onMutate: () => {
      if (parentTweetId) {
        queryClient.cancelQueries(['tweet', parentTweetId]);
      } else {
        queryClient.cancelQueries(['tweets']);
      }

      const previousValue = queryClient.getQueryData(['tweets']);

      if (parentTweetId) {
        queryClient.setQueryData(
          ['tweet', parentTweetId],
          (old?: { tweet: TweetView }) => fakeUpdateParentTweet(tweetId, liked, old)
        );
      } else {
        queryClient.setQueryData(['tweets'], (old?: { tweets: TlTweets }) =>
          fakeUpdateTweet(tweetId, liked, old)
        );
      }

      return { previousValue };
    },
    onError: (err, variables, context) => {
      if (parentTweetId) {
        queryClient.setQueryData(['tweet', parentTweetId], context?.previousValue);
      } else {
        queryClient.setQueryData(['tweets'], context?.previousValue);
      }
      notifyFailed();
    },
    onSuccess: (updatedTweet) => {
      if (parentTweetId) {
        queryClient.invalidateQueries(['tweet', parentTweetId]);
      } else {
        queryClient.invalidateQueries(['tweets']);
      }
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

const fakeUpdateParentTweet = (
  tweetId: string,
  liked: boolean,
  old?: { tweet: TweetView }
) => {
  if (!old) {
    return old;
  }
  return {
    tweet: {
      ...old.tweet,
      liked: tweetId === old.tweet.id ? !liked : old.tweet.liked,
      _count: {
        ...old.tweet._count,
        likes:
          tweetId === old.tweet.id
            ? liked
              ? old.tweet._count.likes - 1
              : old.tweet._count.likes + 1
            : old.tweet._count.likes,
      },
      replies: old.tweet.replies.map((reply) => {
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
) => {
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
};
