import { useEffect, useState } from 'react';
import { client } from '~/lib/client/client';
import { TlTweets, TweetsScheme } from '~/lib/scheme/tweets';
import { AddTweetForm } from '../../src/components/tweets/AddTweetForm';
import { Like } from '../../src/components/tweets/Like';
import { Replies } from '../../src/components/tweets/Replies';
import { Tweet } from '../../src/components/tweets/Tweet';
import TwitterLayout from '../../src/components/TwitterLayout';

const getTweets = async (signal?: AbortSignal) =>
  client(`/api/tweets`, { signal, zodSchema: TweetsScheme });

export default function FetchAllTweets() {
  // 💣 Tu peux supprimer ce state
  const [tweets, setTweets] = useState<TlTweets>([]);

  // 🦁 Remplace tout ceci en utilisant `useQuery` de `react-query`
  useEffect(() => {
    const abortController = new AbortController();
    getTweets(abortController.signal).then((data) => setTweets(data.tweets));

    return () => abortController.abort();
  }, []);

  // 🦁 Afficher un `loader` en fonction de `isLoading` de `useQuery`
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
