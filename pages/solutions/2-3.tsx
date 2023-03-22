import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { Error } from '~/components/Error';
import { Loader } from '~/components/Loader';
import { client } from '~/lib/client/client';
import { AddTweetForm } from '../../src/components/tweets/AddTweetForm';
import { LikeButton } from '../../src/components/tweets/LikeButton';
import { RepliesButton } from '../../src/components/tweets/RepliesButton';
import { Tweet } from '../../src/components/tweets/Tweet';
import TwitterLayout from '../../src/components/TwitterLayout';
import { TweetsScheme } from '../../src/lib/scheme/tweets';

const getTweets = async (signal?: AbortSignal, page = 0) =>
  client(`/api/tweets?page=${page}`, { signal, zodSchema: TweetsScheme });

export default function FetchAllTweets() {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['tweets'],
    queryFn: ({ signal, pageParam }) => getTweets(signal, pageParam ?? 0),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? 0,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error error="Couldn't fetch tweet..." reset={() => refetch()} />;
  }
  const tweets = data.pages.flatMap((page) => page.tweets);

  const nextPageStatus = hasNextPage ? 'Next Page' : 'There is not more tweets';

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
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (content: string) =>
      client('/api/tweets', { method: 'POST', data: { content } }),
    {
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: ['tweets'],
        });
      },
    }
  );

  const handleSubmit = (content: string) => {
    mutation.mutate(content);
  };

  return <AddTweetForm disabled={mutation.isLoading} onSubmit={handleSubmit} />;
};
