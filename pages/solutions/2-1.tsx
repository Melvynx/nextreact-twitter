import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Error } from '~/components/Error';
import { Loader } from '~/components/Loader';
import { client } from '~/lib/client/client';
import { AddTweetForm } from '../../src/components/tweets/AddTweetForm';
import { Like } from '../../src/components/tweets/Like';
import { Replies } from '../../src/components/tweets/Replies';
import { Tweet } from '../../src/components/tweets/Tweet';
import TwitterLayout from '../../src/components/TwitterLayout';
import { TweetsScheme } from '../../src/lib/scheme/tweets';

const notifyFailed = () => toast.error("Couldn't fetch tweet...");

const getTweets = async (signal?: AbortSignal) =>
  client(`/api/tweets`, { signal, zodSchema: TweetsScheme });

export default function FetchAllTweets() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['tweets'],
    queryFn: ({ signal }) => getTweets(signal),
    onError: () => {
      notifyFailed();
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error error="Couldn't fetch tweet..." reset={() => refetch()} />;
  }

  // we know that tweets is defined
  const tweets = data.tweets;

  return (
    <TwitterLayout>
      <AddTweetForm />
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet}>
          <Replies count={tweet._count.replies} />
          <Like count={tweet._count.likes} liked={tweet.liked} />
        </Tweet>
      ))}
    </TwitterLayout>
  );
}
