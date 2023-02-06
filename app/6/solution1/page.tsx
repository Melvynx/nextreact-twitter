import { cookies } from 'next/headers';
import { AddTweetForm } from '~/components/tweets/AddTweetForm';
import { LikeButton } from '~/components/tweets/LikeButton';
import { RepliesButton } from '~/components/tweets/RepliesButton';
import { Tweet } from '~/components/tweets/Tweet';
import TwitterLayout from '~/components/TwitterLayout';
import { getTweets } from '~/db/tweets';

export default async function Solution6() {
  const nextCookies = cookies();
  const userIdCookie = nextCookies.get('userId');
  const userId = userIdCookie?.value ?? '';

  const tweets = await getTweets(userId, 0);

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
