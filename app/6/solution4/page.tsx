import { cookies } from 'next/headers';
import TwitterLayout from '~/components/TwitterLayout';
import { getTweets } from '~/db/tweets';
import TweetsTl from './TweetsTl';

export default async function Solution6() {
  const nextCookies = cookies();
  const userIdCookie = nextCookies.get('userId');
  const userId = userIdCookie?.value ?? '';

  const tweets = await getTweets(userId, 0);

  return (
    <TwitterLayout>
      <TweetsTl tweets={tweets} />
    </TwitterLayout>
  );
}
