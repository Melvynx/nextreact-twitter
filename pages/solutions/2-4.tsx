import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { Error } from '~/components/Error';
import { Loader } from '~/components/Loader';
import { useUser } from '~/hooks/UserProvider';
import { client } from '~/lib/client/client';
import { AddTweetForm } from '../../src/components/tweets/AddTweetForm';
import { LikeButton } from '../../src/components/tweets/LikeButton';
import { RepliesButton } from '../../src/components/tweets/RepliesButton';
import { Tweet } from '../../src/components/tweets/Tweet';
import TwitterLayout from '../../src/components/TwitterLayout';
import { TweetsScheme } from '../../src/lib/scheme/tweets';

const getTweets = async (signal?: AbortSignal, page = 0) =>
  client(`/api/tweets?page=${page}`, { signal, zodSchema: TweetsScheme });

const tweetKeys = {
  all: ['tweets'],
};

const useInfiniteTweet = () =>
  useInfiniteQuery({
    queryKey: tweetKeys.all,
    queryFn: ({ signal, pageParam }) => getTweets(signal, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

export default function FetchAllTweets() {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteTweet();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error error="Couldn't fetch tweet..." reset={() => refetch()} />;
  }

  const tweets = data.pages.flatMap((page) => page.tweets);

  const nextPageStatus = hasNextPage ? 'hasNextPage' : 'noNextPage';

  return (
    <TwitterLayout>
      <AddTweet />
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet}>
          <RepliesButton count={tweet._count.replies} />
          <LikeButton count={tweet._count.likes} liked={tweet.liked} />
        </Tweet>
      ))}
      <button onClick={() => fetchNextPage()} className="block py-4">
        {isFetchingNextPage ? 'Loading more...' : nextPageStatus}
      </button>
    </TwitterLayout>
  );
}

const AddTweet = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (content: string) =>
      client('/api/tweets', { method: 'POST', data: { content } }),
    {
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: tweetKeys.all,
        });
      },
    }
  );

  if (!user) {
    return <p>Please login to add tweet</p>;
  }

  const handleSubmit = (content: string) => {
    mutation.mutate(content);
  };

  return <AddTweetForm disabled={mutation.isLoading} onSubmit={handleSubmit} />;
};
