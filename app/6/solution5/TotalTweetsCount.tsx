import { FC } from 'react';
import { prisma } from '~/db/prisma';

const TotalTweetsCountInner = async () => {
  const totalTweets = await prisma.tweet.count();

  return (
    <div className="p-4 bg-orange-900 border border-orange-400">
      <p>There is a total of {totalTweets} tweets.</p>
      <p className="text-xs">Im a server component</p>
    </div>
  );
};

export const TotalTweetsCount = TotalTweetsCountInner as unknown as FC;
