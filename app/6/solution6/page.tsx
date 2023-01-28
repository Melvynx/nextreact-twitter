import { cookies } from 'next/headers';
import { prisma } from '~/db/prisma';
import { getTweets } from '~/db/tweets';
import TweetsTl from './TweetsTl';

export default async function Solution6() {
  const nextCookies = cookies();
  const userIdCookie = nextCookies.get('userId');
  const userId = userIdCookie?.value ?? '';

  if (!userId) {
    throw new Error('Not logged in');
  }

  const tweets = await getTweets(userId, 0);

  const totalTweets = await prisma.tweet.count();

  return (
    <TweetsTl tweets={tweets}>
      <div className="p-4 bg-orange-900 border border-orange-400">
        <p>There is a total of {totalTweets} tweets.</p>
        <p className="text-xs">Im a server component</p>
      </div>
    </TweetsTl>
  );
}
