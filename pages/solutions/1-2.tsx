import { useEffect, useState } from 'react';
import { z } from 'zod';
import { TlTweets } from '~/lib/scheme/tweets';
import { AddTweetForm } from '../../src/components/tweets/AddTweetForm';
import { Like } from '../../src/components/tweets/Like';
import { Replies } from '../../src/components/tweets/Replies';
import { Tweet } from '../../src/components/tweets/Tweet';
import TwitterLayout from '../../src/components/TwitterLayout';

const TweetsScheme = z.object({
  tweets: z.array(
    z.object({
      id: z.string(),
      content: z.string(),
      createdAt: z.string(),
      user: z.object({
        id: z.string(),
        displayName: z.string(),
        username: z.string(),
        avatarUrl: z.string(),
      }),
      liked: z.boolean(),
      _count: z.object({
        likes: z.number(),
        replies: z.number(),
      }),
    })
  ),
});

const getTweets = async (signal: AbortSignal) =>
  fetch(`/api/tweets`, { signal })
    .then((res) => res.json())
    .then((data) => TweetsScheme.parse(data));

export default function FetchAllTweets() {
  const [tweets, setTweets] = useState<TlTweets>([]);

  useEffect(() => {
    const abortController = new AbortController();
    getTweets(abortController.signal).then((data) => setTweets(data.tweets));

    return () => abortController.abort();
  }, []);

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
