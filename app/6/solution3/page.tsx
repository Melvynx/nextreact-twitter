import { cookies } from 'next/headers';
import { Replies } from '~/components/tweets/Replies';
import { Tweet } from '~/components/tweets/Tweet';
import TwitterLayout from '~/components/TwitterLayout';
import { getTweets } from '~/db/tweets';
import { AddTweet } from './AddTweet';
import { LikeUpdate } from './LikeUpdate';

export default async function Solution6() {
  const nextCookies = cookies();
  const userIdCookie = nextCookies.get('userId');
  const userId = userIdCookie?.value ?? '';

  const tweets = await getTweets(userId, 0);

  return (
    <TwitterLayout>
      <AddTweet userId={userId} />
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet}>
          <Replies count={tweet._count.replies} />
          <LikeUpdate
            tweetId={tweet.id}
            count={tweet._count.likes}
            liked={tweet.liked}
          />
        </Tweet>
      ))}
    </TwitterLayout>
  );
}
