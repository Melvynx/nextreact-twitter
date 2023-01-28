import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader } from '~/components/Loader';
import { useUser } from '~/hooks/UserProvider';
import { client } from '~/lib/client/client';
import { AddTweetForm } from '../../src/components/tweets/AddTweetForm';
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

  // we know that tweets is defined
  const tweets = data.tweets;

  return (
    <TwitterLayout>
      <AddTweet />
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet}>
          <Replies count={tweet._count.replies} />
          <Like count={tweet._count.likes} liked={tweet.liked} />
        </Tweet>
      ))}
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
          queryKey: ['tweets'],
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
