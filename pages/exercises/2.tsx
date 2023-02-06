import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader } from '~/components/Loader';
import { client } from '~/lib/client/client';
import type { TlTweets } from '~/lib/scheme/tweets';
import { TweetsScheme } from '~/lib/scheme/tweets';
import { AddTweetForm } from '../../src/components/tweets/AddTweetForm';
import { LikeButton } from '../../src/components/tweets/LikeButton';
import { RepliesButton } from '../../src/components/tweets/RepliesButton';
import { Tweet } from '../../src/components/tweets/Tweet';
import TwitterLayout from '../../src/components/TwitterLayout';

const notifyFailed = () => toast.error("Couldn't fetch tweet...");

const getTweets = async (signal?: AbortSignal) =>
  client(`/api/tweets`, { signal, zodSchema: TweetsScheme });

export default function FetchAllTweets() {
  // 💣 Tu peux supprimer ce state
  const [tweets, setTweets] = useState<TlTweets | null>(null);

  // 🦁 Remplace tout ceci en utilisant `useQuery` de `react-query`
  useEffect(() => {
    const abortController = new AbortController();

    getTweets(abortController.signal)
      .then((data) => {
        setTweets(data.tweets);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;

        notifyFailed();
        setTweets([]);
      });

    return () => abortController.abort();
  }, []);

  // 🦁 Remplace la vérification de `tweets` par un `isLoading` de `useQuery`
  if (!tweets) return <Loader />;

  // 🦁 Affiche une erreur si `isError` est `true`

  return (
    <TwitterLayout>
      <AddTweetForm />
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet}>
          <RepliesButton count={tweet._count.replies} />
          <LikeButton count={tweet._count.likes} liked={tweet.liked} />
        </Tweet>
      ))}
    </TwitterLayout>
  );
}
